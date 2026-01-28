export type TokenType = 
  | 'KEYWORD'
  | 'IDENTIFIER'
  | 'NUMBER'
  | 'OPERATOR'
  | 'PUNCTUATION'
  | 'EOF';

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  col: number;
  id: string; // Unique ID for visualization mapping
}

export type ASTNodeType = 
  | 'Program'
  | 'VariableDeclaration'
  | 'assignment' // lowercase to distinguish if needed, but keeping consistent
  | 'BinaryExpression'
  | 'Literal'
  | 'Identifier'
  | 'CallExpression';

export interface ASTNode {
  type: ASTNodeType;
  start?: number;
  end?: number;
  [key: string]: any;
}

export interface Program extends ASTNode {
  type: 'Program';
  body: ASTNode[];
}

export interface ExecutionStep {
  id: string; // Unique step ID
  message: string;
  scope: Record<string, any>;
  nodeId?: string; // Correlates to AST node or Token
  output?: string;
  level: 'info' | 'result' | 'error';
}
