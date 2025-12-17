/**
 * Virtual File System - In-memory file system for AI-generated code
 * Part of Cursor-style agentic architecture
 */

export interface VirtualFile {
  path: string
  content: string
}

export class VirtualFileSystem {
  private files: Map<string, string> = new Map()

  addFile(path: string, content: string): void {
    this.files.set(path, content)
  }

  writeFile(path: string, content: string): void {
    this.files.set(path, content)
  }

  getFile(path: string): string | undefined {
    return this.files.get(path)
  }

  getAllFiles(): VirtualFile[] {
    return Array.from(this.files.entries()).map(([path, content]) => ({
      path,
      content
    }))
  }

  getFilePaths(): string[] {
    return Array.from(this.files.keys())
  }

  hasFile(path: string): boolean {
    return this.files.has(path)
  }

  removeFile(path: string): void {
    this.files.delete(path)
  }

  clear(): void {
    this.files.clear()
  }

  getFileTreeSummary(): string {
    const files = this.getAllFiles()
    return files.map(f => f.path).join('\n')
  }

  getFileTree(): Record<string, string> {
    const tree: Record<string, string> = {}
    this.files.forEach((content, path) => {
      tree[path] = content
    })
    return tree
  }
}

