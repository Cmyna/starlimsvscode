import path = require("path")
import Parser = require("web-tree-sitter")


const sslWasmPath = path.join(__dirname, "../node_modules/tree-sitter-ssl/tree-sitter-ssl.wasm")

const createParser = async (path) => {
    await Parser.init()
    const parser = new Parser
    const language = await Parser.Language.load(path)
    parser.setLanguage(language)
    return parser
}


export const parser = createParser(sslWasmPath)