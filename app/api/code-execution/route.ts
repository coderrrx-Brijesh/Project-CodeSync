import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import * as util from "util";

const execPromise = util.promisify(exec);

// Define handlers for different programming languages
const languageHandlers: Record<
  string,
  (code: string) => Promise<{ success: boolean; output: string }>
> = {
  javascript: async (code: string) => {
    const tempDir = getTempDir();
    const filePath = path.join(tempDir, "code.js");

    try {
      await fs.promises.writeFile(filePath, code);
      const { stdout, stderr } = await execPromise(`node "${filePath}"`, {
        timeout: 10000,
      });

      return {
        success: !stderr,
        output: stderr || stdout || "Code executed successfully (no output)",
      };
    } catch (error: any) {
      return {
        success: false,
        output: error.message || String(error),
      };
    } finally {
      // Clean up
      try {
        await fs.promises.unlink(filePath);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  },

  typescript: async (code: string) => {
    const tempDir = getTempDir();
    const tsFilePath = path.join(tempDir, "code.ts");
    const jsFilePath = path.join(tempDir, "code.js");

    try {
      await fs.promises.writeFile(tsFilePath, code);

      // First compile TypeScript to JavaScript
      const compileResult = await execPromise(
        `npx tsc "${tsFilePath}" --outFile "${jsFilePath}"`,
        { timeout: 5000 }
      ).catch((error) => ({ stderr: error.message, stdout: "" }));

      if (compileResult.stderr) {
        return {
          success: false,
          output: `TypeScript compilation error: ${compileResult.stderr}`,
        };
      }

      // Then execute the JavaScript
      const { stdout, stderr } = await execPromise(`node "${jsFilePath}"`, {
        timeout: 10000,
      });

      return {
        success: !stderr,
        output: stderr || stdout || "Code executed successfully (no output)",
      };
    } catch (error: any) {
      return {
        success: false,
        output: error.message || String(error),
      };
    } finally {
      // Clean up
      try {
        await fs.promises.unlink(tsFilePath).catch(() => {});
        await fs.promises.unlink(jsFilePath).catch(() => {});
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  },

  python: async (code: string) => {
    const tempDir = getTempDir();
    const filePath = path.join(tempDir, "code.py");

    try {
      await fs.promises.writeFile(filePath, code);
      const { stdout, stderr } = await execPromise(`python "${filePath}"`, {
        timeout: 10000,
      });

      return {
        success: !stderr,
        output: stderr || stdout || "Code executed successfully (no output)",
      };
    } catch (error: any) {
      return {
        success: false,
        output: error.message || String(error),
      };
    } finally {
      // Clean up
      try {
        await fs.promises.unlink(filePath);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  },

  java: async (code: string) => {
    const tempDir = getTempDir();
    // Detect the class name from the code
    const classNameMatch = code.match(/public\s+class\s+(\w+)/);
    const className = classNameMatch ? classNameMatch[1] : "Main";
    const filePath = path.join(tempDir, `${className}.java`);

    try {
      await fs.promises.writeFile(filePath, code);

      // Compile the Java code
      const compileResult = await execPromise(`javac "${filePath}"`, {
        timeout: 10000,
      }).catch((error) => ({ stderr: error.message, stdout: "" }));

      if (compileResult.stderr) {
        return {
          success: false,
          output: `Java compilation error: ${compileResult.stderr}`,
        };
      }

      // Execute the compiled Java code
      const { stdout, stderr } = await execPromise(
        `java -cp "${tempDir}" ${className}`,
        { timeout: 10000 }
      );

      return {
        success: !stderr,
        output: stderr || stdout || "Code executed successfully (no output)",
      };
    } catch (error: any) {
      return {
        success: false,
        output: error.message || String(error),
      };
    } finally {
      // Clean up
      try {
        await fs.promises.unlink(filePath);
        await fs.promises.unlink(path.join(tempDir, `${className}.class`));
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  },

  ruby: async (code: string) => {
    const tempDir = getTempDir();
    const filePath = path.join(tempDir, "code.rb");

    try {
      await fs.promises.writeFile(filePath, code);
      const { stdout, stderr } = await execPromise(`ruby "${filePath}"`, {
        timeout: 10000,
      });

      return {
        success: !stderr,
        output: stderr || stdout || "Code executed successfully (no output)",
      };
    } catch (error: any) {
      return {
        success: false,
        output: error.message || String(error),
      };
    } finally {
      // Clean up
      try {
        await fs.promises.unlink(filePath);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  },

  cpp: async (code: string) => {
    const tempDir = getTempDir();
    const filePath = path.join(tempDir, "code.cpp");
    const execPath = path.join(
      tempDir,
      os.platform() === "win32" ? "code.exe" : "code"
    );

    try {
      await fs.promises.writeFile(filePath, code);

      // Compile the C++ code
      const compileResult = await execPromise(
        `g++ "${filePath}" -o "${execPath}"`,
        { timeout: 10000 }
      ).catch((error) => ({ stderr: error.message, stdout: "" }));

      if (compileResult.stderr) {
        return {
          success: false,
          output: `C++ compilation error: ${compileResult.stderr}`,
        };
      }

      // Execute the compiled code
      const { stdout, stderr } = await execPromise(`"${execPath}"`, {
        timeout: 10000,
      });

      return {
        success: !stderr,
        output: stderr || stdout || "Code executed successfully (no output)",
      };
    } catch (error: any) {
      return {
        success: false,
        output: error.message || String(error),
      };
    } finally {
      // Clean up
      try {
        await fs.promises.unlink(filePath);
        await fs.promises.unlink(execPath);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  },

  go: async (code: string) => {
    const tempDir = getTempDir();
    const filePath = path.join(tempDir, "code.go");
    const execPath = path.join(
      tempDir,
      os.platform() === "win32" ? "code.exe" : "code"
    );

    try {
      await fs.promises.writeFile(filePath, code);

      // Compile and run the Go code
      const { stdout, stderr } = await execPromise(`go run "${filePath}"`, {
        timeout: 10000,
      });

      return {
        success: !stderr,
        output: stderr || stdout || "Code executed successfully (no output)",
      };
    } catch (error: any) {
      return {
        success: false,
        output: error.message || String(error),
      };
    } finally {
      // Clean up
      try {
        await fs.promises.unlink(filePath);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  },
};

// Helper function to get a temporary directory
function getTempDir(): string {
  const tempDir = path.join(os.tmpdir(), "code-execution");

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  return tempDir;
}

export async function POST(request: NextRequest) {
  try {
    const { code, language } = await request.json();

    if (!code || !language) {
      return NextResponse.json(
        { error: "Code and language are required" },
        { status: 400 }
      );
    }

    const handler = languageHandlers[language.toLowerCase()];

    if (!handler) {
      return NextResponse.json(
        {
          success: false,
          output: `Language '${language}' is not supported yet.`,
        },
        { status: 200 }
      );
    }

    const result = await handler(code);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Code execution error:", error);

    return NextResponse.json(
      {
        success: false,
        output: `Server error: ${error.message || String(error)}`,
      },
      { status: 500 }
    );
  }
}

// Add a GET handler for healthcheck
export async function GET(request: NextRequest) {
  try {
    // Check if the request URL includes the healthcheck endpoint
    const url = new URL(request.url);
    if (url.pathname.endsWith("/healthcheck")) {
      // Return supported languages
      return NextResponse.json({
        status: "ok",
        supported_languages: Object.keys(languageHandlers),
        message: "Code execution service is operational",
      });
    }

    // Default response
    return NextResponse.json({
      status: "ok",
      message: "Code execution API is running",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message || String(error),
      },
      { status: 500 }
    );
  }
}
