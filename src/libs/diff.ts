import { DiffFilterOptions } from "../models/types";


export class DiffProcessor {
  static process(diff: string, options: DiffFilterOptions = {}): string {
    const excludedExtensions = options.excludeFiles || ['.png', '.jpg', '.gif'];
    const excludePatterns = options.excludePatterns || [/import/];
    
    let currentFile = '';
    
    return diff.split('\n')
      .filter(line => {
        if (line.startsWith('diff --git')) {
          currentFile = line.split(' ')[2];
          return false;
        }
        
        if (excludedExtensions.some(ext => currentFile.endsWith(ext))) {
          return false;
        }

        return line.match(/^[+-]/) && 
               !excludePatterns.some(pattern => pattern.test(line));
      })
      .join('\n');
  }
}