import { ASTNode, Program, ExecutionStep } from './types';

export function execute(ast: Program): ExecutionStep[] {
     const logs: ExecutionStep[] = [];
     const scope: Record<string, any> = {};
     let stepCounter = 0;

     function log(message: string, level: 'info' | 'result' | 'error' = 'info', output?: string, nodeId?: string) {
          logs.push({
               id: `step-${stepCounter++}`,
               message,
               scope: { ...scope }, // Snapshot scope
               level,
               output,
               nodeId
          });
     }

     function evaluate(node: ASTNode): any {
          if (!node) return null;

          if (node.type === 'Program') {
               log('Starting Program Execution', 'info');
               let lastVal;
               for (const stmt of node.body) {
                    lastVal = evaluate(stmt);
               }
               log('Program Execution Finished', 'info');
               return lastVal;
          }

          if (node.type === 'VariableDeclaration') {
               log(`Declaring variable '${node.id.value}'`, 'info');
               const value = evaluate(node.init);
               scope[node.id.value] = value;
               log(`Initialized '${node.id.value}' to ${value}`, 'result');
               return value;
          }

          if (node.type === 'BinaryExpression') {
               const left = evaluate(node.left);
               const right = evaluate(node.right);
               log(`Evaluating: ${left} ${node.operator} ${right}`, 'info');
               let result = 0;
               switch (node.operator) {
                    case '+': result = left + right; break;
                    case '-': result = left - right; break;
                    case '*': result = left * right; break;
                    case '/': result = left / right; break;
               }
               return result;
          }

          if (node.type === 'Literal') {
               return node.value;
          }

          if (node.type === 'Identifier') {
               if (node.value in scope) {
                    return scope[node.value];
               }
               log(`Error: Variable '${node.value}' not defined`, 'error');
               return null;
               // In a real compiler, we'd throw, but for visualization we might just log error.
          }

          if (node.type === 'CallExpression') {
               if (node.callee.value === 'print') {
                    const arg = evaluate(node.arguments[0]);
                    log(`Print Output: ${arg}`, 'result', String(arg));
                    return arg;
               }
          }

          return null;
     }

     try {
          evaluate(ast);
     } catch (err: any) {
          log(`Runtime Error: ${err.message}`, 'error');
     }

     return logs;
}
