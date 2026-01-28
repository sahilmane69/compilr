import { Token, TokenType, ASTNode, Program } from './types';

export function parse(tokens: Token[]): Program {
     let current = 0;

     function peek(): Token {
          return tokens[current];
     }

     function consume(type?: TokenType, value?: string): Token {
          const token = tokens[current];
          if (type && token.type !== type) {
               throw new Error(`Expected token type ${type}, got ${token.type} at line ${token.line}`);
          }
          if (value && token.value !== value) {
               throw new Error(`Expected token value ${value}, got ${token.value} at line ${token.line}`);
          }
          current++;
          return token;
     }

     function parseProgram(): Program {
          const body: ASTNode[] = [];
          while (current < tokens.length && peek().type !== 'EOF') {
               body.push(parseStatement());
          }
          return { type: 'Program', body };
     }

     function parseStatement(): ASTNode {
          const token = peek();
          if (token.type === 'KEYWORD' && token.value === 'let') {
               return parseVariableDeclaration();
          }
          if (token.type === 'KEYWORD' && token.value === 'print') {
               return parsePrintStatement();
          }
          return parseExpressionStatement();
     }

     function parseVariableDeclaration(): ASTNode {
          consume('KEYWORD', 'let');
          const id = consume('IDENTIFIER');
          consume('OPERATOR', '=');
          const init = parseExpression();
          consume('PUNCTUATION', ';');
          return {
               type: 'VariableDeclaration',
               id: { type: 'Identifier', value: id.value },
               init
          };
     }

     function parsePrintStatement(): ASTNode {
          consume('KEYWORD', 'print');
          const argument = parseExpression();
          consume('PUNCTUATION', ';');
          return {
               type: 'CallExpression',
               callee: { type: 'Identifier', value: 'print' },
               arguments: [argument]
          };
     }

     function parseExpressionStatement(): ASTNode {
          const expression = parseExpression();
          // Optional semicolon
          if (peek().value === ';') {
               consume('PUNCTUATION', ';');
          }
          return expression;
     }

     function parseExpression(): ASTNode {
          let left = parseTerm();

          while (peek().value === '+' || peek().value === '-') {
               const operator = consume().value;
               const right = parseTerm();
               left = {
                    type: 'BinaryExpression',
                    operator,
                    left,
                    right
               };
          }
          return left;
     }

     function parseTerm(): ASTNode {
          let left = parseFactor();

          while (peek().value === '*' || peek().value === '/') {
               const operator = consume().value;
               const right = parseFactor();
               left = {
                    type: 'BinaryExpression',
                    operator,
                    left,
                    right
               };
          }
          return left;
     }

     function parseFactor(): ASTNode {
          const token = peek();
          if (token.type === 'NUMBER') {
               consume();
               return { type: 'Literal', value: parseFloat(token.value), raw: token.value };
          }
          if (token.type === 'IDENTIFIER') {
               consume();
               return { type: 'Identifier', value: token.value };
          }
          if (token.value === '(') {
               consume('PUNCTUATION', '(');
               const expr = parseExpression();
               consume('PUNCTUATION', ')');
               return expr;
          }
          throw new Error(`Unexpected token ${token.value} at line ${token.line}`);
     }

     try {
          return parseProgram();
     } catch (e) {
          console.error(e);
          // Return a partial or error node in a real app, 
          // but for now we'll just return empty program to prevent crash
          return { type: 'Program', body: [] };
     }
}
