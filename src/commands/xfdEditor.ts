import * as vscode from "vscode";
import { getNonce } from "../utilities/getNonce";
import { getUri } from "../utilities/getUri";

/**
 * this file register commands for editing/viewing XFD
 */
const htmlContainer = (
    title: string, 
    webview: vscode.Webview, 
    nonce: string,
    webviewUri: vscode.Uri,
) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" 
        content="
            default-src 'self'; 
            style-src 'self' 'unsafe-inline' ${webview.cspSource}; 
            font-src ${webview.cspSource}; 
            script-src 'nonce-${nonce}';" >
    <title>${title}</title>
</head>
<body>
    <div id="abc">asdf</div>
    <script type="module" nonce="${nonce}" src="${webviewUri}"></script>
    <script>
    console.log("test")
    </script>
</body>
</html>
    `;


export const register = (context: vscode.ExtensionContext) => {

    /**
     * editor open xfd view command, it will open a web view for rendering XFD form
     */
    const openXfdView = vscode.commands.registerCommand("STARLIMS.openXfdView", async () => {
        const panel = vscode.window.createWebviewPanel(
            'myWebview', // viewType
            'My Webview', // 标题
            vscode.ViewColumn.One, // 显示在编辑器的哪个部分
            {} // Webview选项
        );

        const nonce = getNonce();
        const jsEntry = getUri(panel.webview, context.extensionUri, ["dist", "xfdView.js"]);
        const html = htmlContainer("test", panel.webview, nonce, jsEntry);
        
        panel.webview.html = html;
    });
    context.subscriptions.push(openXfdView);
};
