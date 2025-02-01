export interface ExecutionResult {
  success: boolean;
  output: string;
}

export class CodeExecutor {
  static async executeCode(code: string, language: string): Promise<ExecutionResult> {
    try {
      switch (language) {
        case 'javascript':
          return await this.executeJavaScript(code);
        case 'python':
          return await this.executePython(code);
        case 'typescript':
          return await this.executeTypeScript(code);
        default:
          return {
            success: false,
            output: `Language '${language}' is not supported yet.`
          };
      }
    } catch (error) {
      return {
        success: false,
        output: String(error)
      };
    }
  }

  private static async executeJavaScript(code: string): Promise<ExecutionResult> {
    const logs: string[] = [];
    const customConsole = {
      log: (...args: any[]) => {
        logs.push(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' '));
      },
      error: (...args: any[]) => {
        logs.push(`Error: ${args.join(' ')}`);
      }
    };

    try {
      const fn = new Function('console', code);
      fn(customConsole);
      return {
        success: true,
        output: logs.join('\n')
      };
    } catch (error) {
      return {
        success: false,
        output: String(error)
      };
    }
  }

  private static async executePython(code: string): Promise<ExecutionResult> {
    try {
      // For now, return a message about Python support
      return {
        success: false,
        output: "Python execution is currently disabled. Please use JavaScript or TypeScript."
      };
    } catch (error) {
      return {
        success: false,
        output: String(error)
      };
    }
  }

  private static async executeTypeScript(code: string): Promise<ExecutionResult> {
    // For TypeScript, we'll just strip types and run as JavaScript
    // In a production environment, you'd want to properly compile TS
    const strippedCode = code.replace(/:\s*[A-Za-z<>[\]]+/g, '');
    return await this.executeJavaScript(strippedCode);
  }
}