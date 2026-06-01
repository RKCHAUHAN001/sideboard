const vscode = require('vscode');
const { getWebviewContent } = require('./sideboardUI');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    let disposable = vscode.commands.registerCommand('sideboard.openWhiteboard', function () {
        const panel = vscode.window.createWebviewPanel(
            'sideboardCanvas',
            'sideboard: Logic Whiteboard',
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );
        panel.webview.html = getWebviewContent();
    });
    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = { activate, deactivate };