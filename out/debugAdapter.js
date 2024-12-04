const { DebugSession, InitializedEvent, StoppedEvent, Thread, StackFrame, Scope, Variable } = require('vscode-debugadapter');

class JbsDebugSession extends DebugSession {
  
  // Inicialização do depurador
  initializeRequest(response, args) {
    super.initializeRequest(response, args);
    response.body.supportsEvaluateForHovers = true;  // Habilita a avaliação de expressões no hover
  }

  // Lógica para iniciar a execução do código
  launchRequest(response, args) {
    // Aqui você pode interagir com o ambiente de execução da sua linguagem
    // Para esse exemplo, simularemos a execução de código com a função WriteToOperationLog
    this.sendEvent(new InitializedEvent());
    
    // Simulando execução
    this._sendStoppedEvent();
  }

  // Envia o evento de "parada" (breakpoint) para o VS Code
  _sendStoppedEvent() {
    const thread = new Thread(1, "main");
    const stackFrame = new StackFrame(1, "main", new Location("file:///main.jbs", 0));
    const scopes = [
      new Scope("Local", 1, false)
    ];
    
    this.sendEvent(new StoppedEvent("breakpoint", 1));
    this.sendResponse({ body: { threadId: 1 } });
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
}

// Executa o Debug Adapter
DebugSession.run(JbsDebugSession);
