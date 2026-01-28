import { LanguageProcessor, IRNode } from './interface';

// A specialized mock parser that generates JVM-style AST/Bytecode View
// for educational visualization of basic Java constructs.

export const JavaProcessor: LanguageProcessor = {
     name: 'Java (JVM-Style)',
     description: 'Visualizes Java as JVM Compilation Units with class/method scopes.',
     defaultCode: `public class Main {
    public static void main(String[] args) {
        int a = 10;
        int b = 20;
        int sum = a + b;
        System.out.println(sum);
    }
}`,

     tokenize(code: string) {
          // Basic fallback
          return [];
     },

     parse(code: string) {
          const nodes: Record<string, IRNode> = {};
          let idCounter = 0;

          const createNode = (type: string, irType: string, label: string, role: any, meta: any = {}): string => {
               const id = `java-node-${idCounter++}`;
               nodes[id] = { id, type, irType, label, children: [], role, metadata: meta };
               return id;
          };

          const rootId = createNode('CompilationUnit', 'IR_Program', 'Main.java', 'structure');

          if (code.includes('class Main')) {
               const classId = createNode('ClassDeclaration', 'IR_Class', 'Main', 'definition', { modifiers: ['public'] });
               nodes[rootId].children.push(classId);

               if (code.includes('main')) {
                    const methodId = createNode('MethodDeclaration', 'IR_Function', 'main', 'definition', { modifiers: ['public', 'static'], dataType: 'void' });
                    nodes[classId].children.push(methodId);

                    nodes[methodId].children.push(createNode('ReturnType', 'IR_Type', 'void', 'keyword'));
                    nodes[methodId].children.push(createNode('Parameter', 'IR_Variable', 'args', 'definition', { dataType: 'String[]' }));

                    const blockId = createNode('BlockStatement', 'IR_Block', '{}', 'structure');
                    nodes[methodId].children.push(blockId);

                    // Quick parse of body
                    const lines = code.split('\n');
                    lines.forEach(line => {
                         line = line.trim();
                         // int a = 10;
                         if (line.match(/^int\s+\w+\s*=/)) {
                              const parts = line.match(/int\s+(\w+)\s*=\s*(.*);/);
                              if (parts) {
                                   const [_, name, expr] = parts;
                                   const varId = createNode('VariableDeclaration', 'IR_Variable', `int ${name}`, 'definition', { dataType: 'int' });
                                   nodes[blockId].children.push(varId);

                                   if (expr.includes('+')) {
                                        const opId = createNode('InfixExpression', 'IR_Expression', '+', 'operator');
                                        nodes[varId].children.push(opId);
                                        const [l, r] = expr.split('+');
                                        nodes[opId].children.push(createNode('SimpleName', 'IR_Reference', l.trim(), 'usage'));
                                        nodes[opId].children.push(createNode('SimpleName', 'IR_Reference', r.trim(), 'usage'));
                                   } else {
                                        nodes[varId].children.push(createNode('NumberLiteral', 'IR_Literal', expr, 'literal'));
                                   }
                              }
                         } else if (line.includes('System.out.println')) {
                              const callId = createNode('MethodInvocation', 'IR_Call', 'println', 'call');
                              nodes[blockId].children.push(callId);

                              nodes[callId].children.push(createNode('QualifiedName', 'IR_Reference', 'System.out', 'usage'));
                              const argMatch = line.match(/\((.*)\)/);
                              if (argMatch) {
                                   nodes[callId].children.push(createNode('SimpleName', 'IR_Reference', argMatch[1], 'usage'));
                              }
                         }
                    });
               }
          }

          return { rootId, nodes };
     },

     async execute(code: string) {
          return [
               { id: 'j1', action: 'enter', message: 'Class Load: Main', nodeId: 'java-node-1', scopeSnapshot: {} },
               { id: 'j2', action: 'enter', message: 'Invoke static main', nodeId: 'java-node-2', scopeSnapshot: {} },
               { id: 'j3', action: 'compute', message: 'int a = 10', nodeId: 'java-node-5', scopeSnapshot: { a: '10' } },
               { id: 'j4', action: 'compute', message: 'int b = 20', nodeId: 'java-node-8', scopeSnapshot: { a: '10', b: '20' } },
               { id: 'j5', action: 'compute', message: 'System.out.println', nodeId: 'java-node-11', scopeSnapshot: { sum: '30' } }
          ];
     }
};
