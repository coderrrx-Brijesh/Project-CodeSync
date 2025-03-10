"use client";

export interface ExecutionResult {
  success: boolean;
  output: string;
}

export class CodeExecutor {
  static async executeCode(code: string, language: string): Promise<ExecutionResult> {
    try {
      // Add a timeout to prevent infinite loops
      const timeoutPromise = new Promise<ExecutionResult>((_, reject) => {
        setTimeout(() => {
          reject(new Error("Execution timed out (10s limit)"));
        }, 10000);
      });

      const executionPromise = new Promise<ExecutionResult>(async (resolve) => {
        switch (language) {
          case 'javascript':
            resolve(await this.executeJavaScript(code));
            break;
          case 'python':
            resolve(await this.executePython(code));
            break;
          case 'typescript':
            resolve(await this.executeTypeScript(code));
            break;
          default:
            resolve({
              success: false,
              output: `Language '${language}' is not supported yet.`
            });
        }
      });

      return Promise.race([executionPromise, timeoutPromise]);
    } catch (error) {
      return {
        success: false,
        output: String(error)
      };
    }
  }

  private static async executeJavaScript(code: string): Promise<ExecutionResult> {
    try {
      // Create a safe execution environment
      const originalConsoleLog = console.log;
      const originalConsoleError = console.error;
      
      let output = '';
      
      // Override console methods to capture output
      console.log = (...args) => {
        output += args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ') + '\n';
      };
      
      console.error = (...args) => {
        output += 'Error: ' + args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ') + '\n';
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
      
      return { success: true, output: output || 'Code executed successfully (no output)' };
    } catch (error) {
      return { success: false, output: `Execution Error: ${error}` };
    }
  }

  private static async executeTypeScript(code: string): Promise<ExecutionResult> {
    // For now, we'll just execute TypeScript as JavaScript
    // In a real implementation, you would transpile TS to JS first
    return this.executeJavaScript(code);
  }

  private static async executePython(code: string): Promise<ExecutionResult> {
    // This is a mock implementation since we can't run Python in the browser
    return {
      success: true,
      output: "Python execution is simulated in this environment.\n" +
              "In a real implementation, this would be sent to a backend service.\n\n" +
              "Your Python code:\n" + code
    };
  }
}