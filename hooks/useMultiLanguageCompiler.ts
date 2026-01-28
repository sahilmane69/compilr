import { useState, useEffect } from 'react';
import { LanguageProcessor, IRNode } from '../lib/languages/interface';
import { JavaScriptProcessor } from '../lib/languages/javascript';
import { CppProcessor } from '../lib/languages/cpp';
import { JavaProcessor } from '../lib/languages/java';

// Remove SimpleLang for now to focus on the 3 main ones requested
export const PROCESSORS: Record<string, LanguageProcessor> = {
     'javascript': JavaScriptProcessor,
     'cpp': CppProcessor,
     'java': JavaProcessor,
};

export function useMultiLanguageCompiler() {
     const [language, setLanguage] = useState<string>('cpp');
     const [code, setCode] = useState(PROCESSORS['cpp'].defaultCode);

     const [tokens, setTokens] = useState<any[]>([]);
     const [graph, setGraph] = useState<{ rootId: string; nodes: Record<string, IRNode> }>({ rootId: '', nodes: {} });
     const [execFrames, setExecFrames] = useState<any[]>([]);

     useEffect(() => {
          // Reset code when language changes to the default for that language
          setCode(PROCESSORS[language].defaultCode);
     }, [language]);

     useEffect(() => {
          const proc = PROCESSORS[language];
          if (!proc) return;

          // 1. Tokens
          const t = proc.tokenize(code);
          setTokens(t);

          // 2. Parse (Graph)
          const g = proc.parse(code);
          setGraph(g);

          // 3. Exec
          proc.execute(code).then(frames => {
               setExecFrames(frames);
          });

     }, [code, language]);

     return {
          language,
          setLanguage,
          code,
          setCode,
          tokens,
          graph,
          execFrames
     };
}
