import { useState, useEffect, useMemo } from 'react';
import { tokenize } from '../lib/compiler/lexer';
import { parse } from '../lib/compiler/parser';
import { execute } from '../lib/compiler/interpreter';
import { Token, Program, ExecutionStep } from '../lib/compiler/types';

const INITIAL_CODE = `let a = 10;
let b = 20;
let sum = a + b * 2;
print sum;`;

export function useCompiler() {
     const [code, setCode] = useState(INITIAL_CODE);
     const [tokens, setTokens] = useState<Token[]>([]);
     const [ast, setAst] = useState<Program | null>(null);
     const [logs, setLogs] = useState<ExecutionStep[]>([]);
     const [error, setError] = useState<string | null>(null);

     useEffect(() => {
          try {
               setError(null);
               // 1. Lexical Analysis
               const newTokens = tokenize(code);
               setTokens(newTokens);

               // 2. Syntax Analysis
               const newAst = parse(newTokens);
               setAst(newAst);

               // 3. Execution
               // Only execute if valid AST (simple check)
               if (newAst.body.length > 0) {
                    const newLogs = execute(newAst);
                    setLogs(newLogs);
               }
          } catch (err: any) {
               console.error(err);
               setError(err.message);
          }
     }, [code]);

     return {
          code,
          setCode,
          tokens,
          ast,
          logs,
          error
     };
}
