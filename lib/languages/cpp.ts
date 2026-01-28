import { LanguageProcessor, IRNode, SourceRange } from './interface';

// A specialized mock parser that generates the specific Clang-like AST requested by the user
// for educational visualization of basic C++ constructs.

export const CppProcessor: LanguageProcessor = {
     name: 'C++ (Clang-Like)',
     description: 'Visualizes C++ as a Clang TranslationUnit with full type resolution.',
     defaultCode: `#include <iostream>

int main() {
  int a = 10;
  int b = 20;
  int sum = a + b;
  std::cout << sum;
  return 0;
}`,

     tokenize(code: string) {
          // Simple tokenizer for display
          const tokens: any[] = [];
          let current = 0;
          let i = 0;
          while (current < code.length) {
               const char = code[current];
               if (/\s/.test(char)) { current++; continue; }

               const start = current;
               let type = 'PUNCTUATION';
               let val = char;

               if (/[a-zA-Z_]/.test(char)) {
                    val = '';
                    while (current < code.length && /[a-zA-Z0-9_:]/.test(code[current])) val += code[current++];
                    type = 'IDENTIFIER';
               } else if (/[0-9]/.test(char)) {
                    val = '';
                    while (current < code.length && /[0-9]/.test(code[current])) val += code[current++];
                    type = 'NUMBER';
               } else {
                    current++;
               }

               tokens.push({ type, value: val, id: `tok-${i++}-${start}` });
          }
          return tokens;
     },

     parse(code: string) {
          const nodes: Record<string, IRNode> = {};
          let idCounter = 0;

          // Helper to create nodes
          const createNode = (type: string, irType: string, label: string, role: any, meta: any = {}): string => {
               const id = `cpp-node-${idCounter++}`;
               nodes[id] = {
                    id,
                    type,
                    irType,
                    label,
                    children: [],
                    role,
                    metadata: meta
               };
               return id;
          };

          // Construct the fixed AST structure for the demo code (Mocking the Parser Logic)
          // We parse basic lines to make it semi-dynamic

          const rootId = createNode('TranslationUnit', 'IR_Program', 'TranslationUnit', 'structure');

          if (code.includes('main')) {
               const mainId = createNode('FunctionDeclaration', 'IR_Function', 'main', 'definition', { dataType: 'int' });
               nodes[rootId].children.push(mainId);

               // Function Details
               const retId = createNode('ReturnType', 'IR_Type', 'int', 'keyword');
               const paramsId = createNode('ParameterList', 'IR_List', '(void)', 'structure');
               const bodyId = createNode('CompoundStatement', 'IR_Block', '{}', 'structure', { scope: 'function:main' });

               nodes[mainId].children.push(retId, paramsId, bodyId);

               // Naive line parsing for demo
               const lines = code.split('\n');
               lines.forEach((line, idx) => {
                    line = line.trim();
                    if (line.startsWith('int ') && line.includes('=')) {
                         // Variable Declaration
                         // int a = 10;
                         const parts = line.match(/int\s+(\w+)\s*=\s*(.*);/);
                         if (parts) {
                              const [_, name, expr] = parts;
                              const declStmtId = createNode('DeclarationStatement', 'IR_Statement', '', 'structure');
                              const varDeclId = createNode('VarDecl', 'IR_Variable', `int ${name} = ...`, 'definition', { dataType: 'int', modifiers: [], lvalue: true });

                              nodes[bodyId].children.push(declStmtId);
                              nodes[declStmtId].children.push(varDeclId);

                              // VarDecl children
                              nodes[varDeclId].children.push(createNode('Type', 'IR_Type', 'int', 'keyword'));
                              nodes[varDeclId].children.push(createNode('Identifier', 'IR_Identifier', name, 'definition'));

                              // Initializer
                              if (expr.includes('+')) {
                                   // Binary Op
                                   const [left, right] = expr.split('+').map(s => s.trim());
                                   const opId = createNode('BinaryOperator', 'IR_Expression', '+', 'operator', { dataType: 'int' });
                                   nodes[varDeclId].children.push(opId);

                                   nodes[opId].children.push(createNode('DeclRefExpr', 'IR_Reference', left, 'usage', { lvalue: false, dataType: 'int' }));
                                   nodes[opId].children.push(createNode('DeclRefExpr', 'IR_Reference', right, 'usage', { lvalue: false, dataType: 'int' }));
                              } else {
                                   // Literal
                                   nodes[varDeclId].children.push(createNode('IntegerLiteral', 'IR_Literal', expr, 'literal', { value: expr, dataType: 'int' }));
                              }
                         }
                    } else if (line.startsWith('std::cout')) {
                         // cout expression
                         const callId = createNode('CallExpr', 'IR_Call', 'operator<<', 'call');
                         nodes[bodyId].children.push(callId);

                         nodes[callId].children.push(createNode('Function', 'IR_Identifier', 'std::cout', 'usage'));

                         // Try to grab the printed variable
                         const parts = line.split('<<');
                         if (parts[1]) {
                              const val = parts[1].replace(';', '').trim();
                              nodes[callId].children.push(createNode('DeclRefExpr', 'IR_Reference', val, 'usage', { dataType: 'int' }));
                         }
                    } else if (line.startsWith('return')) {
                         const retStmtId = createNode('ReturnStmt', 'IR_Statement', 'return', 'keyword');
                         nodes[bodyId].children.push(retStmtId);
                         nodes[retStmtId].children.push(createNode('IntegerLiteral', 'IR_Literal', '0', 'literal'));
                    }
               });
          }

          return { rootId, nodes };
     },

     async execute(code: string) {
          // Fake execution trace
          return [
               { id: '1', action: 'enter', message: 'Enter main()', nodeId: 'cpp-node-1', scopeSnapshot: {} },
               { id: '2', action: 'compute', message: 'Allocating Stack Frame', nodeId: 'cpp-node-1', scopeSnapshot: {} },
               { id: '3', action: 'compute', message: 'int a = 10', nodeId: 'cpp-node-5', scopeSnapshot: { a: '10' } },
               { id: '4', action: 'compute', message: 'int b = 20', nodeId: 'cpp-node-9', scopeSnapshot: { a: '10', b: '20' } },
               { id: '5', action: 'compute', message: 'Resolving a + b', nodeId: 'cpp-node-12', scopeSnapshot: { a: '10', b: '20' } },
               { id: '6', action: 'compute', message: 'int sum = 30', nodeId: 'cpp-node-12', scopeSnapshot: { a: '10', b: '20', sum: '30' } },
               { id: '7', action: 'leave', message: 'std::cout << 30', nodeId: 'cpp-node-15', scopeSnapshot: {} }
          ];
     }
};
