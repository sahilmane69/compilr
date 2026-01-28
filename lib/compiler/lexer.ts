import { Token, TokenType } from './types';

export function tokenize(input: string): Token[] {
     const tokens: Token[] = [];
     let cursor = 0;
     let line = 1;
     let col = 1;

     const keywords = ['let', 'const', 'var', 'print', 'if', 'else', 'while', 'function', 'return'];

     while (cursor < input.length) {
          const char = input[cursor];

          // Skip whitespace
          if (/\s/.test(char)) {
               if (char === '\n') {
                    line++;
                    col = 1;
               } else {
                    col++;
               }
               cursor++;
               continue;
          }

          const startCol = col;
          const startId = `token-${cursor}`;

          // Numbers
          if (/[0-9]/.test(char)) {
               let value = '';
               while (cursor < input.length && /[0-9.]/.test(input[cursor])) {
                    value += input[cursor];
                    cursor++;
                    col++;
               }
               tokens.push({ type: 'NUMBER', value, line, col: startCol, id: startId });
               continue;
          }

          // Identifiers and Keywords
          if (/[a-zA-Z_]/.test(char)) {
               let value = '';
               while (cursor < input.length && /[a-zA-Z0-9_]/.test(input[cursor])) {
                    value += input[cursor];
                    cursor++;
                    col++;
               }
               const type: TokenType = keywords.includes(value) ? 'KEYWORD' : 'IDENTIFIER';
               tokens.push({ type, value, line, col: startCol, id: startId });
               continue;
          }

          // Punctuation
          if (/[{};(),.]/.test(char)) {
               tokens.push({ type: 'PUNCTUATION', value: char, line, col: startCol, id: startId });
               cursor++;
               col++;
               continue;
          }

          // Operators
          if (/[=+\-*/><!]/.test(char)) {
               // Check for two-char operators like ==, !=, <=, >= later if needed.
               // For now simple 1 char.
               tokens.push({ type: 'OPERATOR', value: char, line, col: startCol, id: startId });
               cursor++;
               col++;
               continue;
          }

          // Unknown char (skip or error, strictly we skip here for resilience)
          cursor++;
          col++;
     }

     tokens.push({ type: 'EOF', value: '', line, col, id: 'eof' });
     return tokens;
}
