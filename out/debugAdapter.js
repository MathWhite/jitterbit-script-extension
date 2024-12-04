const { DebugSession, InitializedEvent, StoppedEvent, Thread, StackFrame, Scope, Variable, Location } = require('vscode-debugadapter');

class JbsDebugSession extends DebugSession {

  constructor() {
    super();
    this._threads = [new Thread(1, "main")]; // Simulando um único thread
    this._breakpoints = new Map(); // Mapeamento de breakpoints
  }

  // Inicialização do depurador
  initializeRequest(response, args) {
    super.initializeRequest(response, args);
    response.body.supportsEvaluateForHovers = true;  // Habilita a avaliação de expressões no hover
    response.body.supportsSetVariable = true;  // Habilita a modificação de variáveis durante a execução
    this.sendResponse(response);
  }
  // Lógica para iniciar a execução do código
  launchRequest(response, args) {
    this.sendEvent(new InitializedEvent());
    this._sendStoppedEvent(); // Simulando a execução e parando no início
    response.body = {
      threadId: 1
    };
    this.sendResponse(response);
  }

  // Envia o evento de "parada" (breakpoint) para o VS Code
  _sendStoppedEvent() {
    const thread = this._threads[0];
    const stackFrame = new StackFrame(1, "main", new Location("file:///main.jbs", 0));
    const scopes = [
      new Scope("Local", 1, false)
    ];

    this.sendEvent(new StoppedEvent("breakpoint", 1)); // Simula a parada no breakpoint
    this.sendResponse({ body: { threadId: 1 } });
  }

  // Configura os breakpoints no código
  setBreakPointsRequest(response, args) {
    const breakpoints = args.breakpoints.map(bp => {
      const { line } = bp;
      // Armazena os breakpoints na memória (mapeamento simples)
      this._breakpoints.set(line, true);
      return { line, verified: true };
    });

    response.body = { breakpoints };
    this.sendResponse(response);
  }

  // Solicita a pilha de execução
  stackTraceRequest(response, args) {
    const frames = [
      new StackFrame(1, "main", "file:///main.jbs", 0),
      new StackFrame(2, "init", "file:///main.jbs", 5)
    ];

    response.body = {
      stackFrames: frames,
      totalFrames: frames.length
    };
    this.sendResponse(response);
  }

  // Solicita as variáveis de um escopo
  scopesRequest(response, args) {
    const scopes = [
      new Scope("Local", 1, false)
    ];

    response.body = { scopes };
    this.sendResponse(response);
  }

  // Solicita as variáveis de um escopo específico
  variablesRequest(response, args) {
    const variables = [
      new Variable("var1", "10", false),
      new Variable("var2", "\"Hello World\"", false)
    ];

    response.body = { variables };
    this.sendResponse(response);
  }

  // Mapeamento de comandos de depuração: transforma as funções da sua linguagem para ações compreensíveis
  evaluateRequest(response, args) {
    const expression = args.expression;

    // Verifica se a expressão é a função WriteToOperationLog
    if (expression.startsWith("WriteToOperationLog")) {
      // Extraímos o conteúdo do log passado como argumento
      const logContent = expression.match(/\("(.+)"\)/)[1];

      // Mapeia para um comando de depuração padrão (equivalente ao console.log)
      console.log(logContent);  // Simula o comportamento da função

      // Retorna o resultado para o VS Code
      response.body = {
        result: `Log: ${logContent}`,
        variablesReference: 0
      };
      this.sendResponse(response);
    } else {
      // Caso a expressão não seja reconhecida
      response.body = {
        result: `Expression not recognized: ${expression}`,
        variablesReference: 0
      };
      this.sendResponse(response);
    }
  }

  // Modifica uma variável no escopo
  setVariableRequest(response, args) {
    const { name, value } = args;
    // Aqui você pode modificar as variáveis conforme a lógica do seu depurador
    console.log(`Set variable: ${name} = ${value}`);

    // Retorna a nova variável
    response.body = { value: value };
    this.sendResponse(response);
  }

  // Finaliza a depuração
  terminateRequest(response, args) {
    this.sendEvent(new StoppedEvent("terminated", 1));
    this.sendResponse(response);
  }
}

// Executa o Debug Adapter
DebugSession.run(JbsDebugSession);
