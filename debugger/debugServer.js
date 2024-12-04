const { DebugSession } = require('vscode-debugadapter');

class MyDebugSession extends DebugSession {
  constructor() {
    super();
    this.interpreter = new Interpreter();
  }

  initializeRequest(response) {
    response.body = {
      supportsStepIn: true,
      supportsStepOut: true,
      supportsContinue: true,
      supportsSetVariable: true,
      supportsConfigurationDoneRequest: true,
      supportsPause: true
    };
    this.sendResponse(response);
  }

  launchRequest(response, args) {
    this.interpreter.breakpoints = args.breakpoints || [];
    // Inicializa o interpretador
    this.sendResponse(response);
  }

  nextRequest(response) {
    // Lógica de execução linha a linha (passo a passo)
    this.interpreter.runLine('exemplo de código');
    this.sendResponse(response);
  }

  pauseRequest(response) {
    // Pausa a execução
    this.interpreter.pauseExecution();
    this.sendResponse(response);
  }

  setVariableRequest(response, args) {
    this.interpreter.setVariable(args.name, args.value);
    this.sendResponse(response);
  }

  // Outros métodos do DAP podem ser implementados aqui, como StepIn, Continue, etc.
}

DebugSession.run(MyDebugSession);
