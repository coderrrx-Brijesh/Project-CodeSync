"use client";

export interface ExecutionResult {
  success: boolean;
  output: string;
}

export interface APIHealthCheck {
  available: boolean;
  supportedLanguages: string[];
}

export class CodeExecutor {
  // Simple in-memory cache to avoid executing the same code multiple times
  private static executionCache: Map<string, ExecutionResult> = new Map();

  // Track API availability
  private static apiAvailable: boolean = true;
  private static supportedLanguages: string[] = ["javascript", "typescript"];

  // Generate a cache key from code and language
  private static getCacheKey(code: string, language: string): string {
    return `${language}:${code}`;
  }

  // Check if the API is available and get supported languages
  static async checkAPIHealth(): Promise<APIHealthCheck> {
    try {
      const response = await fetch("/api/code-execution/healthcheck", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Add cache busting to avoid browser caching
        cache: "no-store",
      });

      if (!response.ok) {
        this.apiAvailable = false;
        return {
          available: false,
          supportedLanguages: ["javascript"],
        };
      }

      const data = await response.json();
      this.apiAvailable = true;
      this.supportedLanguages = data.supported_languages || [
        "javascript",
        "typescript",
      ];

      return {
        available: true,
        supportedLanguages: this.supportedLanguages,
      };
    } catch (error) {
      this.apiAvailable = false;
      return {
        available: false,
        supportedLanguages: ["javascript"],
      };
    }
  }

  static async executeCode(
    code: string,
    language: string
  ): Promise<ExecutionResult> {
    try {
      // Normalize language
      const normalizedLanguage = language.toLowerCase();

      // Check cache first
      const cacheKey = this.getCacheKey(code, normalizedLanguage);
      if (this.executionCache.has(cacheKey)) {
        return this.executionCache.get(cacheKey)!;
      }

      // If we know API is not available and language is not JavaScript, return early
      if (!this.apiAvailable && normalizedLanguage !== "javascript") {
        const result: ExecutionResult = {
          success: false,
          output: `Cannot execute ${language} code. Backend service is unavailable and only JavaScript can be run in the browser.`,
        };
        this.executionCache.set(cacheKey, result);
        return result;
      }

      // Add a timeout to prevent infinite loops
      const timeoutPromise = new Promise<ExecutionResult>((_, reject) => {
        setTimeout(() => {
          reject(new Error("Execution timed out (10s limit)"));
        }, 10000);
      });

      const executionPromise = new Promise<ExecutionResult>(async (resolve) => {
        try {
          // For JavaScript, we can use the browser fallback if needed
          if (normalizedLanguage === "javascript") {
            if (!this.apiAvailable) {
              const result = await this.executeJavaScriptInBrowser(code);
              this.executionCache.set(cacheKey, result);
              resolve(result);
              return;
            }
          }

          // Try to execute code via the backend API
          const response = await fetch("/api/code-execution", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code, language: normalizedLanguage }),
          });

          if (!response.ok) {
            // If API fails, try fallback for supported languages
            if (normalizedLanguage === "javascript") {
              console.warn(
                "API unavailable, using browser fallback for JavaScript"
              );
              this.apiAvailable = false;
              const result = await this.executeJavaScriptInBrowser(code);
              this.executionCache.set(cacheKey, result);
              resolve(result);
              return;
            }

            this.apiAvailable = false;
            const errorText = await response.text();
            const result = {
              success: false,
              output: `API Error: ${response.status} ${errorText}`,
            };
            this.executionCache.set(cacheKey, result);
            resolve(result);
            return;
          }

          this.apiAvailable = true;
          const result = await response.json();
          this.executionCache.set(cacheKey, result);
          resolve(result);
        } catch (error) {
          // Network error or other exception
          this.apiAvailable = false;
          if (normalizedLanguage === "javascript") {
            console.warn(
              "API request failed, using browser fallback for JavaScript"
            );
            const result = await this.executeJavaScriptInBrowser(code);
            this.executionCache.set(cacheKey, result);
            resolve(result);
            return;
          }

          const result = {
            success: false,
            output: `Network Error: ${String(error)}`,
          };
          this.executionCache.set(cacheKey, result);
          resolve(result);
        }
      });

      const result = await Promise.race([executionPromise, timeoutPromise]);
      this.executionCache.set(cacheKey, result);
      return result;
    } catch (error) {
      const result = {
        success: false,
        output: String(error),
      };
      return result;
    }
  }

  // Get list of supported languages
  static getSupportedLanguages(): string[] {
    return this.supportedLanguages;
  }

  // Clear the execution cache
  static clearCache(): void {
    this.executionCache.clear();
  }

  // Client-side fallback for JavaScript execution in case the API is unavailable
  static async executeJavaScriptInBrowser(
    code: string
  ): Promise<ExecutionResult> {
    try {
      // Create a safe execution environment
      const originalConsoleLog = console.log;
      const originalConsoleError = console.error;

      let output = "";

      // Override console methods to capture output
      console.log = (...args) => {
        output +=
          args
            .map((arg) =>
              typeof arg === "object"
                ? JSON.stringify(arg, null, 2)
                : String(arg)
            )
            .join(" ") + "\n";
      };

      console.error = (...args) => {
        output +=
          "Error: " +
          args
            .map((arg) =>
              typeof arg === "object"
                ? JSON.stringify(arg, null, 2)
                : String(arg)
            )
            .join(" ") +
          "\n";
      };

      // Execute the code in a try-catch block
      try {
        // Use Function constructor to create a function from the code
        const fn = new Function(code);
        await fn();
      } catch (error) {
        output += `Runtime Error: ${error}\n`;
        return { success: false, output };
      } finally {
        // Restore original console methods
        console.log = originalConsoleLog;
        console.error = originalConsoleError;
      }

      return {
        success: true,
        output: output || "Code executed successfully (no output)",
      };
    } catch (error) {
      return { success: false, output: `Execution Error: ${error}` };
    }
  }
}
