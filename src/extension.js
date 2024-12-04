const vscode = require('vscode');

function activate(context) {
  // Registrar o comando para iniciar o debugger
  /*const tokenColorCustomizations = {
    "editor.tokenColorCustomizations": {
      "textMateRules": [
        {
          "scope": "keyword.tag.jitterbitscript",
          "settings": {
            "foreground": "#71a6ad"
          }
        }
      ]
    }
  };

  vscode.workspace.getConfiguration().update('editor.tokenColorCustomizations', tokenColorCustomizations, vscode.ConfigurationTarget.Global);
  vscode.workspace.getConfiguration().update('editor.tokenColorCustomizations', tokenColorCustomizations, vscode.ConfigurationTarget.Workspace);
*/

  const startDebugging = vscode.commands.registerCommand('extension.startDebugging', async () => {
    const configuration = vscode.workspace.getConfiguration('launch');
    const debugConfig = configuration.get('configurations') || [];
    
    if (debugConfig.length === 0) {
      vscode.window.showErrorMessage('Nenhuma configuração de depuração encontrada.');
      return;
    }

    const result = await vscode.debug.startDebugging(undefined, debugConfig[0]);
    if (!result) {
      vscode.window.showErrorMessage('Não foi possível iniciar a depuração.');
    }
  });

  context.subscriptions.push(startDebugging);

  // Monitorar quando uma sessão de depuração começa
  vscode.debug.onDidStartDebugSession((e) => {
    console.log('Sessão de depuração iniciada:', e);
  });

  // Monitorar quando uma sessão de depuração termina
  vscode.debug.onDidTerminateDebugSession((e) => {
    console.log('Sessão de depuração terminada:', e);
  });

  // Monitorar alterações de breakpoints
  vscode.debug.onDidChangeBreakpoints((e) => {
    console.log('Breakpoints alterados:', e);
  });

  const hoverProvider = vscode.languages.registerHoverProvider('javascript', {
    provideHover(document, position, token) {
      const wordRange = document.getWordRangeAtPosition(position);
      const word = document.getText(wordRange);

      const session = vscode.debug.activeDebugSession;
      if (session) {
        return session.variables().then(variables => {
          const variable = variables.find(v => v.name === word);
          if (variable) {
            return new vscode.Hover(`Valor: ${variable.value}`); // Corrigido aqui
          }
          return null;
        });
      }
      return null;
    }
  });

  context.subscriptions.push(hoverProvider);
}

function deactivate() {}

module.exports = { activate, deactivate };
