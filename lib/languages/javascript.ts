import { parse } from '@babel/parser';
import { LanguageProcessor, IRNode } from './interface';

export const JavaScriptProcessor: LanguageProcessor = {
     name: 'JavaScript',
     description: 'Visualizes standard JS AST using Babel Parser.',

     defaultCode: `const a = 10;
const b = 20;
const sum = a + b;
console.log(sum);`,

     tokenize(code: string) {
          try {
               const ast = parse(code, {
                    sourceType: 'module',
                    tokens: true,
                    plugins: ['typescript']
               });

               return (ast.tokens || []).map((t: any, i) => ({
                    id: `tok-${i}`,
                    type: t.type.label,
                    value: code.slice(t.start, t.end),
                    line: t.loc.start.line,
                    col: t.loc.start.column
               }));
          } catch (e) {
               return [];
          }
     },

     parse(code: string): { rootId: string; nodes: Record<string, IRNode> } {
          try {
               const ast = parse(code, { sourceType: 'module', plugins: ['typescript'] });
               const nodes: Record<string, IRNode> = {};

               let idCounter = 0;
               const traverse = (node: any): string => {
                    if (!node) return '';
                    const id = `js-node-${idCounter++}`;
                    const type = node.type;

                    const childIds: string[] = [];

                    // Generic traversal w/ exclusion of metadata props
                    for (const key in node) {
                         if (['loc', 'start', 'end', 'comments', 'extra', 'range'].includes(key)) continue;

                         if (Array.isArray(node[key])) {
                              node[key].forEach((child: any) => {
                                   if (child && typeof child.type === 'string') {
                                        childIds.push(traverse(child));
                                   }
                              });
                         } else if (node[key] && typeof node[key] === 'object' && typeof node[key].type === 'string') {
                              childIds.push(traverse(node[key]));
                         }
                    }

                    // Logic to determine role/irType
                    let irType = 'IR_Node';
                    let role: any = 'structure';
                    if (type.includes('Declaration')) { irType = 'IR_Statement'; role = 'definition'; }
                    if (type.includes('Expression')) { irType = 'IR_Expression'; role = 'usage'; }
                    if (type === 'Identifier') { irType = 'IR_Identifier'; role = 'usage'; }
                    if (type.includes('Literal')) { irType = 'IR_Literal'; role = 'literal'; }

                    // Label Creation
                    let label = type;
                    if (node.id && node.id.name) label = node.id.name;
                    if (type === 'Identifier') label = node.name;
                    if (type === 'NumericLiteral') label = String(node.value);
                    if (type === 'BinaryExpression') label = node.operator;

                    nodes[id] = {
                         id,
                         type,
                         irType,
                         label,
                         children: childIds,
                         role,
                         metadata: {
                              dataType: 'any',
                              scope: 'module'
                         }
                    };

                    return id;
               };

               const rootId = traverse(ast.program);
               return { rootId, nodes };

          } catch (e: any) {
               return { rootId: 'err', nodes: {} };
          }
     },

     async execute(code: string) {
          // Re-implemented simple mock execution for visualization
          const frames: any[] = [];
          const mockConsole = {
               log: (...args: any[]) => frames.push({
                    id: `exec-${frames.length}`,
                    nodeId: 'unknown', // Babel AST mapping to exec is tricky without custom interpreter, skipping nodeId for JS exec vis
                    action: 'compute',
                    message: `console.log: ${args.join(' ')}`,
                    scopeSnapshot: {}
               })
          };

          try {
               // eslint-disable-next-line no-new-func
               const fn = new Function('console', code);
               fn(mockConsole);
          } catch (e: any) {
               frames.push({ id: 'err', action: 'error', message: e.message, nodeId: 'error', scopeSnapshot: {} });
          }
          return frames;
     }
};
