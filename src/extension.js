const vscode = require('vscode');
const { DebugAdapterDescriptorFactory } = require('vscode-debugadapter');

function activate(context) {
  let disposable = vscode.commands.registerCommand('extension.startDebugging', () => {
    // Inicia a depuração usando o servidor DAP
    vscode.debug.startDebugging(undefined, {
      type: 'jbs-debugger',
      request: 'launch',
      name: 'Launch Program'
    });
  });

  context.subscriptions.push(disposable);
}

module.exports = {
  activate
};
