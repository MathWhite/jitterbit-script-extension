import * as vscode from 'vscode';

function activate(context) {
  // Registrar o comando para iniciar o debugger
  const startDebugging = vscode.commands.registerCommand('extension.startDebugging', async () => {
    // Recuperar configuração de depuração
    const configuration = vscode.workspace.getConfiguration('launch');
    const debugConfig = configuration.get('configurations') || [];
    
    if (debugConfig.length === 0) {
      vscode.window.showErrorMessage('Nenhuma configuração de depuração encontrada.');
      return;
    }

    // Iniciar o debugging com a primeira configuração encontrada
    const result = await vscode.debug.startDebugging(undefined, debugConfig[0]);
    if (!result) {
      vscode.window.showErrorMessage('Não foi possível iniciar a depuração.');
    }
  });

  // Adicionar o comando ao contexto
  context.subscriptions.push(startDebugging);

  // Monitorar quando os breakpoints forem alterados
  vscode.debug.onDidChangeBreakpoints((e) => {
    console.log('Breakpoints alterados:', e);
  });

  // Monitorar os eventos da sessão de depuração
  vscode.debug.onDidReceiveDebugSessionEvent((e) => {
    if (e.event === 'stopped') {
      const session = e.body.session;
      console.log('Depuração parada:', session);

      // Obter variáveis da sessão ao parar no breakpoint
      session.variables().then((vars) => {
        if (vars && vars.length > 0) {
          console.log('Variáveis:', vars);
        } else {
          console.log('Nenhuma variável encontrada.');
        }
      }).catch(err => {
        console.error('Erro ao obter variáveis:', err);
      });
    }
  });

  // Adicionar hover provider para exibir variáveis ao passar o mouse
  const hoverProvider = vscode.languages.registerHoverProvider('javascript', {
    provideHover(document, position, token) {
      // Verifica o conteúdo da palavra onde o mouse está posicionado
      const wordRange = document.getWordRangeAtPosition(position);
      const word = document.getText(wordRange);

      // Obter a sessão de depuração atual
      const session = vscode.debug.activeDebugSession;
      if (session) {
        return session.variables().then(variables => {
          // Encontrar a variável correspondente ao nome da palavra
          const variable = variables.find(v => v.name === word);
          if (variable) {
            // Exibir valor da variável no tooltip
            return new vscode.Hover(`Valor: ${variable.value}`);
          }
          return null;
        });
      }
      return null;
    }
  });

  context.subscriptions.push(hoverProvider);
}

// Função de desativação
function deactivate() {}

export { activate, deactivate };
