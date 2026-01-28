"use client";

import { useMultiLanguageCompiler, PROCESSORS } from '../hooks/useMultiLanguageCompiler';
import styles from './CompilerIDE.module.css';
import { GraphView } from './visualization/GraphView';
import { useRef, useEffect } from 'react';

export function CompilerIDE() {
     const {
          language,
          setLanguage,
          code,
          setCode,
          tokens,
          graph,
          execFrames
     } = useMultiLanguageCompiler();

     const textareaRef = useRef<HTMLTextAreaElement>(null);
     const gutterRef = useRef<HTMLDivElement>(null);

     // Sync scrolling
     const handleScroll = () => {
          if (textareaRef.current && gutterRef.current) {
               gutterRef.current.scrollTop = textareaRef.current.scrollTop;
          }
     };

     const lineCount = code.split('\n').length;
     const lines = Array.from({ length: lineCount }, (_, i) => i + 1);

     return (
          <div className={styles.ideContainer}>
               {/* Code Editor */}
               <div className={styles.editorPanel}>
                    <div className={styles.editorHeader}>
                         <div className={styles.editorHeaderLeft}>
                              <select
                                   className={styles.languageSelect}
                                   value={language}
                                   onChange={e => setLanguage(e.target.value)}
                              >
                                   {Object.keys(PROCESSORS).map(k => (
                                        <option key={k} value={k}>{PROCESSORS[k].name}</option>
                                   ))}
                              </select>
                              <span>INPUT</span>
                         </div>
                         <span className={styles.editorHeaderRight}>EDITOR</span>
                    </div>

                    <div className={styles.codeContainer}>
                         <div className={styles.gutter} ref={gutterRef}>
                              {lines.map(n => <div key={n}>{n}</div>)}
                         </div>
                         <textarea
                              ref={textareaRef}
                              className={styles.textarea}
                              value={code}
                              onChange={(e) => setCode(e.target.value)}
                              onScroll={handleScroll}
                              spellCheck={false}
                              autoCapitalize="off"
                              autoComplete="off"
                              autoCorrect="off"
                         />
                    </div>
               </div>

               {/* Pipeline Visualization */}
               <div className={styles.pipelineGrid}>

                    {/* Stage 1: Lexical Analysis */}
                    <section className={styles.stageCard} style={{ maxHeight: '35vh', minHeight: '20vh', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
                         <div className={styles.stageHeader}>
                              <span className={styles.stageTitle}>1. Lexical Analysis (Tokens)</span>
                              <span style={{ fontSize: '0.75rem', color: '#666' }}>{tokens.length} tokens</span>
                         </div>
                         <div className={styles.stageContent} style={{ flex: 1, overflowY: 'auto' }}>
                              <div className={styles.tokenWrapper}>
                                   {tokens.length === 0 && <span className="text-muted" style={{ padding: 10 }}>No tokens generated</span>}
                                   {tokens.map((t) => (
                                        <div key={t.id} className={styles.tokenPill} title={`Type: ${t.type}`}>
                                             <span style={{ opacity: 0.5, marginRight: 6, fontSize: '0.8em', fontWeight: 600 }}>{t.type.substring(0, 3).toUpperCase()}</span>
                                             <span style={{ fontFamily: 'var(--font-mono)' }}>{t.value}</span>
                                        </div>
                                   ))}
                              </div>
                         </div>
                    </section>

                    {/* Stage 2: Syntax Analysis (Graph) */}
                    <section className={styles.stageCard} style={{ flex: 1, minHeight: 400 }}>
                         <div className={styles.stageHeader}>
                              <span className={styles.stageTitle}>2. Syntax Analysis (AST Graph)</span>
                         </div>
                         {/* We remove padding for the graph to fill the area */}
                         <div style={{ width: '100%', height: '100%', position: 'relative', background: '#0f0f11' }}>
                              <GraphView data={graph} />
                         </div>
                    </section>

                    {/* Stage 3: Execution */}
                    <section className={styles.stageCard} style={{ minHeight: '300px' }}>
                         <div className={styles.stageHeader}>
                              <span className={styles.stageTitle}>3. Execution Log</span>
                              <span style={{ fontSize: '0.75rem', color: '#666' }}>Console Output</span>
                         </div>
                         <div className={styles.stageContent}>
                              {execFrames.length === 0 && <div className="text-muted" style={{ padding: 10 }}>Waiting for execution...</div>}
                              {execFrames.map((step) => (
                                   <div key={step.id} className={styles.logItem}>
                                        <span className={`${styles.logLevel} ${step.action === 'error' ? styles.logError : styles.logInfo}`}>
                                             [{step.action === 'compute' ? 'LOG' : step.action.toUpperCase()}]
                                        </span>
                                        <span style={{ fontFamily: 'var(--font-mono)' }}>{step.message}</span>
                                   </div>
                              ))}
                         </div>
                    </section>

               </div>
          </div>
     );
}
