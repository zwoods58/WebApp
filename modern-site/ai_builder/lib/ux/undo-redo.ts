/**
 * Undo/Redo Functionality
 * P2 Feature 14: Undo/Redo Functionality
 * 
 * Undo/redo stack with keyboard shortcuts
 */

export interface UndoRedoState {
  code: string
  timestamp: number
  description?: string
}

export interface UndoRedoStack {
  undoStack: UndoRedoState[]
  redoStack: UndoRedoState[]
  maxHistory: number
}

class UndoRedoManager {
  private undoStack: UndoRedoState[] = []
  private redoStack: UndoRedoState[] = []
  private maxHistory: number = 50
  private currentState: UndoRedoState | null = null

  constructor(maxHistory: number = 50) {
    this.maxHistory = maxHistory
  }

  /**
   * Save state to undo stack
   */
  saveState(code: string, description?: string): void {
    // Don't save if same as current state
    if (this.currentState && this.currentState.code === code) {
      return
    }

    // Push current state to undo stack if exists
    if (this.currentState) {
      this.undoStack.push(this.currentState)
      
      // Limit stack size
      if (this.undoStack.length > this.maxHistory) {
        this.undoStack.shift()
      }
    }

    // Clear redo stack when new state is saved
    this.redoStack = []

    // Set new current state
    this.currentState = {
      code,
      timestamp: Date.now(),
      description
    }
  }

  /**
   * Undo - return previous state
   */
  undo(): UndoRedoState | null {
    if (this.undoStack.length === 0) {
      return null
    }

    // Push current state to redo stack
    if (this.currentState) {
      this.redoStack.push(this.currentState)
    }

    // Pop from undo stack
    const previousState = this.undoStack.pop()!
    this.currentState = previousState

    return previousState
  }

  /**
   * Redo - return next state
   */
  redo(): UndoRedoState | null {
    if (this.redoStack.length === 0) {
      return null
    }

    // Push current state to undo stack
    if (this.currentState) {
      this.undoStack.push(this.currentState)
    }

    // Pop from redo stack
    const nextState = this.redoStack.pop()!
    this.currentState = nextState

    return nextState
  }

  /**
   * Check if undo is available
   */
  canUndo(): boolean {
    return this.undoStack.length > 0
  }

  /**
   * Check if redo is available
   */
  canRedo(): boolean {
    return this.redoStack.length > 0
  }

  /**
   * Get undo stack size
   */
  getUndoCount(): number {
    return this.undoStack.length
  }

  /**
   * Get redo stack size
   */
  getRedoCount(): number {
    return this.redoStack.length
  }

  /**
   * Clear all history
   */
  clear(): void {
    this.undoStack = []
    this.redoStack = []
    this.currentState = null
  }

  /**
   * Get current state
   */
  getCurrentState(): UndoRedoState | null {
    return this.currentState
  }
}

// Singleton instances per draft
const managers = new Map<string, UndoRedoManager>()

export function getUndoRedoManager(draftId: string): UndoRedoManager {
  if (!managers.has(draftId)) {
    managers.set(draftId, new UndoRedoManager(50))
  }
  return managers.get(draftId)!
}

/**
 * Keyboard shortcut handler for undo/redo
 * Note: This should be used in a React component with useEffect
 */
export function setupUndoRedoShortcuts(
  draftId: string,
  onUndo: (state: UndoRedoState) => void,
  onRedo: (state: UndoRedoState) => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {}
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    // Ctrl+Z or Cmd+Z for undo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey && !e.altKey) {
      e.preventDefault()
      const manager = getUndoRedoManager(draftId)
      const state = manager.undo()
      if (state) {
        onUndo(state)
      }
    }
    
    // Ctrl+Shift+Z or Cmd+Shift+Z for redo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
      e.preventDefault()
      const manager = getUndoRedoManager(draftId)
      const state = manager.redo()
      if (state) {
        onRedo(state)
      }
    }
    
    // Ctrl+Y or Cmd+Y for redo (alternative)
    if ((e.ctrlKey || e.metaKey) && e.key === 'y' && !e.shiftKey) {
      e.preventDefault()
      const manager = getUndoRedoManager(draftId)
      const state = manager.redo()
      if (state) {
        onRedo(state)
      }
    }
  }

  window.addEventListener('keydown', handleKeyDown)
  return () => {
    window.removeEventListener('keydown', handleKeyDown)
  }
}





