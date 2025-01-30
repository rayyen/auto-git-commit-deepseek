import { DiffFilterOptions } from "../models/types";

export class DiffProcessor {
  static process(diff: string, options: DiffFilterOptions): string {
    return diff
      .split("\n")
      .filter(line => this.filterLine(line, options))
      .join("\n");
  }

  private static filterLine(line: string, options: DiffFilterOptions): boolean {
    if (this.isExcludedFile(line, options.excludeFiles || [])) {
      return false;
    }
    
    if (this.matchesPattern(line, options.excludePatterns || [])) {
      return false;
    }

    return line.match(/^[+-]/) !== null;
  }

  private static isExcludedFile(
    line: string,
    excludeFiles: string[]
  ): boolean {
    if (line.startsWith("diff --git")) {
      const filePath = line.split(" ")[2];
      return excludeFiles.some(pattern => 
        filePath.endsWith(pattern.replace("*", ""))
      );
    }
    return false;
  }

  private static matchesPattern(
    line: string,
    excludePatterns: RegExp[]
  ): boolean {
    return excludePatterns.some(pattern => 
      pattern.test(line.trim())
    );
  }
}