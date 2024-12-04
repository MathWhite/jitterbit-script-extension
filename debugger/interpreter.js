class Interpreter {
    constructor() {
      this.variables = {};  // Armazena as variáveis
      this.breakpoints = [];  // Armazena os breakpoints
      this.currentLine = 0;  // Linha atual
    }
  
    setVariable(name, value) {
      this.variables[name] = value;
    }
  
    getVariable(name) {
      return this.variables[name];
    }
  
    runLine(line) {
      this.currentLine++;
  
      // Verifica se a linha atual é um breakpoint
      if (this.breakpoints.includes(this.currentLine)) {
        this.pauseExecution();
      }
  
      // Aqui, você pode adicionar o processamento da linha de código (exemplo de condicional)
      if (line.startsWith("If")) {
        const parts = line.slice(3, -1).split(", ");
        const condition = parts[0];
        const trueValue = parts[1];
        const falseValue = parts[2];
  
        if (eval(condition)) {
          this.setVariable('result', trueValue);
        } else {
          this.setVariable('result', falseValue);
        }
      }
  
      // Exemplo de outros comandos que podem ser interpretados
    }
  
    pauseExecution() {
      console.log("Execução pausada na linha:", this.currentLine);
      // Aqui, você pode chamar um método de depuração do VS Code para pausar
    }
  }
  