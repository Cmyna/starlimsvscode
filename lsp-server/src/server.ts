import { createConnection } from "vscode-languageserver/node";
import { DidChangeConfigurationNotification, InitializeParams, InitializeResult, ProposedFeatures, TextDocumentSyncKind } from "vscode-languageserver";



const connection = createConnection(ProposedFeatures.all)


let hasConfigurationCapability: boolean = false
let hasWorkspaceFolderCapability: boolean = false
let hasDiagnosticRelatedInformationCapability: boolean = false

connection.onInitialize((params: InitializeParams) => {
    let capabilities = params.capabilities;

    // Does the client support the `workspace/configuration` request?
    // If not, we fall back using global settings.
    hasConfigurationCapability = !!(
      capabilities.workspace && !!capabilities.workspace.configuration
    );
    hasWorkspaceFolderCapability = !!(
      capabilities.workspace && !!capabilities.workspace.workspaceFolders
    );
    hasDiagnosticRelatedInformationCapability = !!(
      capabilities.textDocument &&
      capabilities.textDocument.publishDiagnostics &&
      capabilities.textDocument.publishDiagnostics.relatedInformation
    );
    
    const result: InitializeResult = {
      capabilities: {
        textDocumentSync: TextDocumentSyncKind.Incremental,
        // all triggers `"` and `'` is used for something like DoProc
        completionProvider: {
          resolveProvider: true,
          triggerCharacters: [".", "\"", "'"],
        },
        signatureHelpProvider: {
         
          triggerCharacters: ["(", "\"", "'"]
        },
        hoverProvider: true,
        definitionProvider: true,
      }
    };
    if (hasWorkspaceFolderCapability) {
      result.capabilities.workspace = {
        workspaceFolders: {
          supported: true
        }
      };
    }
    return result;
})


connection.onInitialized(() => {
    if (hasConfigurationCapability) {
        // Register for all configuration changes.
        connection.client.register(DidChangeConfigurationNotification.type, undefined);
    }
    if (hasWorkspaceFolderCapability) {
        connection.workspace.onDidChangeWorkspaceFolders(_event => {
        connection.console.log('Workspace folder change event received.');
        });
    }
});


