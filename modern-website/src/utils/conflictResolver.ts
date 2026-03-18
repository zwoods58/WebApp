/**
 * Conflict Resolution System
 * Handles conflicts between offline and online data during synchronization
 */

import { OfflineOperation } from '@/types/offlineTypes';

export interface ConflictResolution {
  strategy: 'client_wins' | 'server_wins' | 'merge' | 'user_choice';
  resolvedData: any;
  conflictReason: string;
}

export interface ConflictData {
  localOperation: OfflineOperation;
  serverData: any;
  conflictType: 'data_mismatch' | 'duplicate' | 'version_conflict' | 'constraint_violation';
  timestamp: number;
}

export interface MergeStrategy {
  field: string;
  strategy: 'local' | 'server' | 'latest' | 'sum' | 'max' | 'custom';
  customResolver?: (local: any, server: any) => any;
}

export class ConflictResolver {
  private static instance: ConflictResolver;
  private conflictHistory: Map<string, ConflictData[]> = new Map();
  private mergeStrategies: Map<string, MergeStrategy[]> = new Map();

  private constructor() {
    this.initializeDefaultStrategies();
  }

  static getInstance(): ConflictResolver {
    if (!ConflictResolver.instance) {
      ConflictResolver.instance = new ConflictResolver();
    }
    return ConflictResolver.instance;
  }

  /**
   * Resolve conflict between local operation and server data
   */
  async resolveConflict(
    localOperation: OfflineOperation,
    serverData: any,
    conflictType: ConflictData['conflictType']
  ): Promise<ConflictResolution> {
    
    const conflictData: ConflictData = {
      localOperation,
      serverData,
      conflictType,
      timestamp: Date.now()
    };

    // Log conflict for debugging
    this.logConflict(conflictData);

    // Choose resolution strategy
    const strategy = this.selectResolutionStrategy(localOperation, serverData, conflictType);

    // Apply resolution
    const resolution = await this.applyResolution(localOperation, serverData, strategy);

    return resolution;
  }

  /**
   * Select appropriate resolution strategy
   */
  private selectResolutionStrategy(
    localOperation: OfflineOperation,
    serverData: any,
    conflictType: ConflictData['conflictType']
  ): ConflictResolution['strategy'] {
    
    switch (conflictType) {
      case 'duplicate':
        // For duplicates, server wins (operation already processed)
        return 'server_wins';
      
      case 'version_conflict':
        // For version conflicts, use feature-specific strategy
        return this.getVersionStrategy(localOperation.feature);
      
      case 'constraint_violation':
        // For constraint violations, try to merge or ask user
        return 'merge';
      
      case 'data_mismatch':
        // For data mismatches, try intelligent merge
        return 'merge';
      
      default:
        // Default to client wins for unknown conflicts
        return 'client_wins';
    }
  }

  /**
   * Get version strategy based on feature
   */
  private getVersionStrategy(feature: string): ConflictResolution['strategy'] {
    switch (feature) {
      case 'cash':
        // For financial data, server wins to avoid double charges
        return 'server_wins';
      
      case 'inventory':
        // For inventory, try to merge quantities
        return 'merge';
      
      case 'calendar':
        // For appointments, latest update wins
        return 'client_wins';
      
      case 'credit':
        // For credit, server wins for safety
        return 'server_wins';
      
      case 'beehive':
        // For social features, client wins
        return 'client_wins';
      
      default:
        return 'client_wins';
    }
  }

  /**
   * Apply resolution strategy
   */
  private async applyResolution(
    localOperation: OfflineOperation,
    serverData: any,
    strategy: ConflictResolution['strategy']
  ): Promise<ConflictResolution> {
    
    switch (strategy) {
      case 'client_wins':
        return this.resolveClientWins(localOperation, serverData);
      
      case 'server_wins':
        return this.resolveServerWins(localOperation, serverData);
      
      case 'merge':
        return this.resolveMerge(localOperation, serverData);
      
      case 'user_choice':
        return this.resolveUserChoice(localOperation, serverData);
      
      default:
        throw new Error(`Unknown resolution strategy: ${strategy}`);
    }
  }

  /**
   * Client wins resolution
   */
  private resolveClientWins(
    localOperation: OfflineOperation,
    serverData: any
  ): ConflictResolution {
    return {
      strategy: 'client_wins',
      resolvedData: localOperation.data,
      conflictReason: 'Local operation takes precedence'
    };
  }

  /**
   * Server wins resolution
   */
  private resolveServerWins(
    localOperation: OfflineOperation,
    serverData: any
  ): ConflictResolution {
    return {
      strategy: 'server_wins',
      resolvedData: serverData,
      conflictReason: 'Server data is authoritative'
    };
  }

  /**
   * Merge resolution
   */
  private resolveMerge(
    localOperation: OfflineOperation,
    serverData: any
  ): ConflictResolution {
    
    const feature = localOperation.feature;
    const mergeStrategies = this.mergeStrategies.get(feature) || [];
    
    let resolvedData = { ...serverData };
    const conflictFields: string[] = [];

    // Apply merge strategies for each field
    mergeStrategies.forEach(strategy => {
      const localValue = (localOperation.data as any)[strategy.field];
      const serverValue = (serverData as any)[strategy.field];

      if (localValue !== undefined && serverValue !== undefined && localValue !== serverValue) {
        const mergedValue = this.mergeFieldValues(localValue, serverValue, strategy);
        (resolvedData as any)[strategy.field] = mergedValue;
        conflictFields.push(strategy.field);
      }
    });

    return {
      strategy: 'merge',
      resolvedData,
      conflictReason: `Merged conflicting fields: ${conflictFields.join(', ')}`
    };
  }

  /**
   * User choice resolution (would show UI dialog)
   */
  private resolveUserChoice(
    localOperation: OfflineOperation,
    serverData: any
  ): ConflictResolution {
    
    // In a real implementation, this would show a dialog to the user
    // For now, default to client wins with user choice note
    console.warn('🤔 User choice required - defaulting to client wins');
    
    return {
      strategy: 'user_choice',
      resolvedData: localOperation.data,
      conflictReason: 'User selected local version (auto-resolved)'
    };
  }

  /**
   * Merge field values based on strategy
   */
  private mergeFieldValues(
    localValue: any,
    serverValue: any,
    strategy: MergeStrategy
  ): any {
    
    switch (strategy.strategy) {
      case 'local':
        return localValue;
      
      case 'server':
        return serverValue;
      
      case 'latest':
        // Use timestamp if available, otherwise local
        return localValue;
      
      case 'sum':
        // For numeric values
        if (typeof localValue === 'number' && typeof serverValue === 'number') {
          return localValue + serverValue;
        }
        return localValue;
      
      case 'max':
        // For numeric values
        if (typeof localValue === 'number' && typeof serverValue === 'number') {
          return Math.max(localValue, serverValue);
        }
        return localValue;
      
      case 'custom':
        if (strategy.customResolver) {
          return strategy.customResolver(localValue, serverValue);
        }
        return localValue;
      
      default:
        return localValue;
    }
  }

  /**
   * Initialize default merge strategies
   */
  private initializeDefaultStrategies() {
    
    // Cash/Transaction merge strategies
    this.mergeStrategies.set('cash', [
      { field: 'amount', strategy: 'server' }, // Financial amounts - server wins
      { field: 'description', strategy: 'local' }, // Descriptions - local wins
      { field: 'customer_name', strategy: 'latest' }, // Customer names - latest
      { field: 'payment_method', strategy: 'server' } // Payment method - server wins
    ]);

    // Inventory merge strategies
    this.mergeStrategies.set('inventory', [
      { field: 'quantity', strategy: 'sum' }, // Quantities - sum both
      { field: 'cost_price', strategy: 'max' }, // Cost - use higher value
      { field: 'selling_price', strategy: 'max' }, // Price - use higher value
      { field: 'item_name', strategy: 'local' }, // Names - local wins
      { field: 'category', strategy: 'local' } // Category - local wins
    ]);

    // Calendar merge strategies
    this.mergeStrategies.set('calendar', [
      { field: 'status', strategy: 'latest' }, // Status - latest wins
      { field: 'notes', strategy: 'custom', customResolver: this.mergeNotes },
      { field: 'appointment_time', strategy: 'local' }, // Time - local wins
      { field: 'duration', strategy: 'max' } // Duration - use longer
    ]);

    // Credit merge strategies
    this.mergeStrategies.set('credit', [
      { field: 'amount', strategy: 'server' }, // Credit amounts - server wins
      { field: 'creditType', strategy: 'local' }, // Type - local wins
      { field: 'terms', strategy: 'latest' }, // Terms - latest wins
      { field: 'customerData', strategy: 'custom', customResolver: this.mergeCustomerData }
    ]);

    // Beehive merge strategies
    this.mergeStrategies.set('beehive', [
      { field: 'content', strategy: 'custom', customResolver: this.mergeContent },
      { field: 'title', strategy: 'local' }, // Title - local wins
      { field: 'category', strategy: 'local' }, // Category - local wins
      { field: 'priority', strategy: 'max' } // Priority - use higher
    ]);
  }

  /**
   * Custom merge for notes
   */
  private mergeNotes(localNotes: string, serverNotes: string): string {
    if (!localNotes) return serverNotes;
    if (!serverNotes) return localNotes;
    
    // Combine notes with timestamp
    return `${localNotes}\n\n(Merged with server notes: ${serverNotes})`;
  }

  /**
   * Custom merge for customer data
   */
  private mergeCustomerData(localData: any, serverData: any): any {
    const merged = { ...serverData };
    
    // Update non-empty fields from local
    Object.keys(localData).forEach(key => {
      if (localData[key] && (!serverData[key] || localData[key] !== serverData[key])) {
        merged[key] = localData[key];
      }
    });
    
    return merged;
  }

  /**
   * Custom merge for content
   */
  private mergeContent(localContent: string, serverContent: string): string {
    if (!localContent) return serverContent;
    if (!serverContent) return localContent;
    
    // For content, prefer the longer/more detailed version
    return localContent.length > serverContent.length ? localContent : serverContent;
  }

  /**
   * Log conflict for debugging
   */
  private logConflict(conflictData: ConflictData) {
    const key = `${conflictData.localOperation.feature}-${conflictData.conflictType}`;
    
    if (!this.conflictHistory.has(key)) {
      this.conflictHistory.set(key, []);
    }
    
    this.conflictHistory.get(key)!.push(conflictData);
    
    // Keep only last 10 conflicts per type
    const conflicts = this.conflictHistory.get(key)!;
    if (conflicts.length > 10) {
      conflicts.shift();
    }
    
    console.warn(`⚠️ Conflict detected: ${key}`, {
      operation: conflictData.localOperation.type,
      timestamp: new Date(conflictData.timestamp).toISOString()
    });
  }

  /**
   * Get conflict statistics
   */
  getConflictStats(): {
    totalConflicts: number;
    conflictsByType: Record<string, number>;
    conflictsByFeature: Record<string, number>;
    recentConflicts: ConflictData[];
  } {
    
    const conflictsByType: Record<string, number> = {};
    const conflictsByFeature: Record<string, number> = {};
    const allConflicts: ConflictData[] = [];

    this.conflictHistory.forEach((conflicts, key) => {
      const [feature, type] = key.split('-');
      
      conflictsByType[type] = (conflictsByType[type] || 0) + conflicts.length;
      conflictsByFeature[feature] = (conflictsByFeature[feature] || 0) + conflicts.length;
      allConflicts.push(...conflicts);
    });

    // Sort recent conflicts by timestamp
    const recentConflicts = allConflicts
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);

    return {
      totalConflicts: allConflicts.length,
      conflictsByType,
      conflictsByFeature,
      recentConflicts
    };
  }

  /**
   * Clear conflict history
   */
  clearConflictHistory(): void {
    this.conflictHistory.clear();
    console.log('🧹 Conflict history cleared');
  }

  /**
   * Add custom merge strategy
   */
  addMergeStrategy(feature: string, strategies: MergeStrategy[]): void {
    this.mergeStrategies.set(feature, strategies);
    console.log(`📝 Custom merge strategy added for ${feature}`);
  }

  /**
   * Get merge strategies for a feature
   */
  getMergeStrategies(feature: string): MergeStrategy[] {
    return this.mergeStrategies.get(feature) || [];
  }
}

// Export singleton instance
export const conflictResolver = ConflictResolver.getInstance();
