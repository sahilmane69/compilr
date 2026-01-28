export interface SourceRange {
     startLine: number;
     startCol: number;
     endLine: number;
     endCol: number;
}

export type SemanticRole = 'definition' | 'usage' | 'call' | 'keyword' | 'literal' | 'operator' | 'structure';

export interface IRNodeMetadata {
     dataType?: string;     // e.g., "int", "void"
     scope?: string;        // e.g., "global", "function:main"
     modifiers?: string[];  // e.g., ["public", "static"]
     value?: string | number;
     lvalue?: boolean;      // True if it can be assigned to
     executionStep?: number; // Order index
}

export interface IRNode {
     id: string;
     type: string;          // The specific language type (e.g., "FunctionDeclaration", "VarDecl")
     irType: string;        // The normalized IR type (e.g., "IR_Function", "IR_Variable")
     label: string;         // Display label (e.g., "main", "a", "+")
     children: string[];
     range?: SourceRange;
     role: SemanticRole;
     metadata: IRNodeMetadata;
}

export interface LanguageProcessor {
     name: string;
     defaultCode: string;
     description: string;
     tokenize(code: string): any[]; // Keeping generic for now
     parse(code: string): { rootId: string; nodes: Record<string, IRNode> };
     execute(code: string): Promise<any[]>;
}
