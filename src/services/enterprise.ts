/**
 * Defines the interface for STARLIMS enterprise services.
 */
export interface Enterprise {
  getEnterpriseItem(uri: string): any;
  getEnterpriseItemCode(uri: string): any;
  getLocalCopy(uri: string, workspaceFolder: string, returnCode: boolean): Promise<string | null>;
  getConfig(): any;
  saveEnterpriseItemCode(uri: string, code: string): any;
  runScript(uri: string): any;
  clearLog(uri: string): any;
}
