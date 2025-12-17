/**
 * Search Engine
 * P2 Feature 2: Search & Discovery
 */

export interface SearchResult {
  id: string
  type: 'project' | 'file' | 'code' | 'template'
  title: string
  description: string
  relevance: number
  metadata?: Record<string, any>
}

export interface SearchOptions {
  query: string
  type?: SearchResult['type']
  limit?: number
  offset?: number
  filters?: Record<string, any>
}

class SearchEngine {
  private index: Map<string, SearchResult[]> = new Map()

  /**
   * Index content
   */
  indexContent(result: SearchResult): void {
    if (!this.index.has(result.type)) {
      this.index.set(result.type, [])
    }
    this.index.get(result.type)!.push(result)
  }

  /**
   * Search content
   */
  search(options: SearchOptions): SearchResult[] {
    const { query, type, limit = 20, offset = 0, filters } = options
    const queryLower = query.toLowerCase()
    const queryTerms = queryLower.split(/\s+/).filter(term => term.length > 0)

    let results: SearchResult[] = []

    // Search in specified type or all types
    const typesToSearch = type ? [type] : Array.from(this.index.keys())

    for (const searchType of typesToSearch) {
      const content = this.index.get(searchType) || []
      
      for (const item of content) {
        const titleMatch = item.title.toLowerCase().includes(queryLower)
        const descriptionMatch = item.description.toLowerCase().includes(queryLower)
        
        // Calculate relevance score
        let relevance = 0
        if (titleMatch) relevance += 10
        if (descriptionMatch) relevance += 5

        // Count term matches
        for (const term of queryTerms) {
          const titleTermCount = (item.title.toLowerCase().match(new RegExp(term, 'g')) || []).length
          const descTermCount = (item.description.toLowerCase().match(new RegExp(term, 'g')) || []).length
          relevance += titleTermCount * 2 + descTermCount
        }

        // Apply filters
        if (filters) {
          let matchesFilters = true
          for (const [key, value] of Object.entries(filters)) {
            if (item.metadata?.[key] !== value) {
              matchesFilters = false
              break
            }
          }
          if (!matchesFilters) continue
        }

        if (relevance > 0) {
          results.push({
            ...item,
            relevance
          })
        }
      }
    }

    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance)

    // Apply pagination
    return results.slice(offset, offset + limit)
  }

  /**
   * Clear index
   */
  clearIndex(type?: SearchResult['type']): void {
    if (type) {
      this.index.delete(type)
    } else {
      this.index.clear()
    }
  }

  /**
   * Get autocomplete suggestions
   */
  getAutocomplete(query: string, limit: number = 5): string[] {
    const queryLower = query.toLowerCase()
    const suggestions = new Set<string>()

    for (const results of this.index.values()) {
      for (const result of results) {
        const titleLower = result.title.toLowerCase()
        if (titleLower.startsWith(queryLower)) {
          suggestions.add(result.title)
          if (suggestions.size >= limit) break
        }
      }
      if (suggestions.size >= limit) break
    }

    return Array.from(suggestions).slice(0, limit)
  }
}

// Singleton instance
let searchEngine: SearchEngine | null = null

export function getSearchEngine(): SearchEngine {
  if (!searchEngine) {
    searchEngine = new SearchEngine()
  }
  return searchEngine
}





