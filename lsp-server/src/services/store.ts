import { SyntaxNode, Tree } from "web-tree-sitter"
import { parser } from "../parser"
import Parser = require("web-tree-sitter")


export type ServerScriptItem = {
    tree: Tree,
    procedures: ProcedureDefinition[],
    regions: RegionDefinition[]
}


export type RegionDefinition = {
    name: string,
    content: string
}


export type ProcedureDefinition = {
    name: string,
    parameters: string[],
    document: JsDoc
}

export type JsDoc = {
    mdText: string,
    data: {
        tag?: string,
        text: string,
    }[]
}

type Store = {
    [uri: string]: ServerScriptItem
}

const store: Store = {}


export const post = async (uri: string, text: string) => {
    const _parser = await parser
    const tree = (await parser).parse(text)
    const procDefs = extractProceduresDefinitions(tree, _parser)
    const regionDefs = extractRegionDefs(tree, _parser)
    const item = {
        tree: tree,
        procedures: procDefs,
        regions: regionDefs
    } as ServerScriptItem
    store[uri] = item
}


const extractRegionDefs = (tree: Tree, parser: Parser): RegionDefinition[] => {
    const queryStr = `
    (region_scope
        (region) .
        (id) @region-id
    ) @region`
    const query = parser.getLanguage().query(queryStr)
    const matches = query.matches(tree.rootNode)
    const res = matches.map(match => {
        const regionName = match.captures.find(c => c.name === "region-id")
        const wholeRegion = match.captures.find(c => c.name === "region")
        return {
            name: regionName.text,
            content: wholeRegion.node.text
        } as RegionDefinition
    })
    return res
}


const extractProceduresDefinitions = (tree: Tree, parser: Parser): ProcedureDefinition[] => {
    const queryStr = `
    (comment)? @doc .
    (proc_def
        (procedure) . (id) @proc-name
        (params_declare 
            (id) @param-name
        )?
    )`
    const query = parser.getLanguage().query(queryStr)
    const matches = query.matches(tree.rootNode)
    const res = matches.map(match => {
        const procedureName = match.captures.find(c => c.name === "proc-name")
        const docText = match.captures.find(c => c.name === "doc")
        const params = match.captures.filter(c => c.name === "param-name")

        return {
            name: procedureName.text,
            parameters: params.map(c => c.text),
            document: asDocObject(docText.text)
        } as ProcedureDefinition
    })
    return res
}

const asDocObject = (docText: string): JsDoc => {
    // remove last char if it is ';'
    let text = docText
    if (text.at(-1) === ";") text = text.slice(0, -1)
    // to jsdoc parser
    throw "TODO"
}