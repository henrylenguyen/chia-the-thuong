/**
 * Migration Manager - Handles migration from localStorage to IndexedDB
 * Provides seamless transition with data integrity verification
 */

import { IndexedDBManager } from './indexeddb-manager.js';
import { MIGRATION_MAPPING, DEFAULT_DATA } from '../utils/db-schema.js';

export class MigrationManager {
  constructor() {
    this.indexedDBManager = null;
    this.migrationStatus = {
      isCompleted: false,
      hasErrors: false,
      migratedData: {},
      errors: []
    };
  }

  /**
   * Initialize migration manager
   */
  async init() {
    try {
      console.log('🔄 Initializing Migration Manager...');
      
      this.indexedDBManager = new IndexedDBManager();
      await this.indexedDBManager.init();
      
      console.log('✅ Migration Manager initialized');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Migration Manager:', error);
      return false;
    }
  }

  /**
   * Check if migration is needed
   */
  needsMigration() {
    // Check if IndexedDB has been initialized
    const migrationFlag = localStorage.getItem('indexeddb_migration_completed');
    if (migrationFlag === 'true') {
      return false;
    }

    // Check if there's localStorage data to migrate
    const hasLocalStorageData = this.hasLocalStorageData();
    
    console.log('🔍 Migration check:', {
      migrationCompleted: migrationFlag === 'true',
      hasLocalStorageData
    });

    return hasLocalStorageData;
  }

  /**
   * Check if localStorage has data to migrate
   */
  hasLocalStorageData() {
    const keys = ['japaneseAppStats', 'wrongAnswers', 'theme', 'lastVisited'];
    return keys.some(key => localStorage.getItem(key) !== null);
  }

  /**
   * Perform migration from localStorage to IndexedDB
   */
  async migrateFromLocalStorage() {
    try {
      console.log('🚀 Starting migration from localStorage to IndexedDB...');
      
      if (!this.indexedDBManager) {
        throw new Error('IndexedDB Manager not initialized');
      }

      // Reset migration status
      this.migrationStatus = {
        isCompleted: false,
        hasErrors: false,
        migratedData: {},
        errors: []
      };

      // Migrate each data type
      await this.migrateUserStats();
      await this.migrateWrongAnswers();
      await this.migrateUserPreferences();
      await this.migrateExerciseProgress();

      // Verify migration
      const isValid = await this.verifyMigration();
      
      if (isValid) {
        // Mark migration as completed
        localStorage.setItem('indexeddb_migration_completed', 'true');
        this.migrationStatus.isCompleted = true;
        
        console.log('✅ Migration completed successfully');
        
        // Optionally clean up localStorage
        await this.cleanupLocalStorage();
        
        return true;
      } else {
        throw new Error('Migration verification failed');
      }
      
    } catch (error) {
      console.error('❌ Migration failed:', error);
      this.migrationStatus.hasErrors = true;
      this.migrationStatus.errors.push(error.message);
      
      // Rollback on failure
      await this.rollbackMigration();
      return false;
    }
  }

  /**
   * Migrate user statistics
   */
  async migrateUserStats() {
    try {
      const statsData = localStorage.getItem('japaneseAppStats');
      
      if (statsData) {
        const parsed = JSON.parse(statsData);
        const transformed = MIGRATION_MAPPING['globalStats'].transform(parsed);
        
        await this.indexedDBManager.create('userStats', transformed);
        this.migrationStatus.migratedData.userStats = transformed;
        
        console.log('📊 User stats migrated');
      } else {
        // Create default stats
        await this.indexedDBManager.create('userStats', DEFAULT_DATA.userStats);
        console.log('📊 Default user stats created');
      }
    } catch (error) {
      console.error('❌ Failed to migrate user stats:', error);
      throw error;
    }
  }

  /**
   * Migrate wrong answers
   */
  async migrateWrongAnswers() {
    try {
      const wrongAnswersData = localStorage.getItem('wrongAnswers');
      
      if (wrongAnswersData) {
        const parsed = JSON.parse(wrongAnswersData);
        const transformed = MIGRATION_MAPPING['wrongAnswers'].transform(parsed);
        
        // Batch insert wrong answers
        const operations = transformed.map(answer => ({
          type: 'create',
          store: 'wrongAnswers',
          data: answer
        }));
        
        await this.indexedDBManager.batch(operations);
        this.migrationStatus.migratedData.wrongAnswers = transformed;
        
        console.log(`📝 ${transformed.length} wrong answers migrated`);
      }
    } catch (error) {
      console.error('❌ Failed to migrate wrong answers:', error);
      throw error;
    }
  }

  /**
   * Migrate user preferences
   */
  async migrateUserPreferences() {
    try {
      const preferences = [
        { key: 'theme', storageKey: 'theme' },
        { key: 'language', storageKey: 'language', defaultValue: 'vi' },
        { key: 'soundEnabled', storageKey: 'soundEnabled', defaultValue: true },
        { key: 'animationsEnabled', storageKey: 'animationsEnabled', defaultValue: true }
      ];

      const operations = [];
      
      for (const pref of preferences) {
        const value = localStorage.getItem(pref.storageKey) || pref.defaultValue;
        const prefData = {
          key: pref.key,
          value: value === 'true' ? true : value === 'false' ? false : value,
          type: typeof value,
          lastUpdated: new Date()
        };
        
        operations.push({
          type: 'create',
          store: 'userPreferences',
          data: prefData
        });
      }

      await this.indexedDBManager.batch(operations);
      this.migrationStatus.migratedData.userPreferences = operations.map(op => op.data);
      
      console.log('⚙️ User preferences migrated');
    } catch (error) {
      console.error('❌ Failed to migrate user preferences:', error);
      throw error;
    }
  }

  /**
   * Migrate exercise progress
   */
  async migrateExerciseProgress() {
    try {
      const statsData = localStorage.getItem('japaneseAppStats');
      
      if (statsData) {
        const parsed = JSON.parse(statsData);
        const exerciseProgress = parsed.exerciseProgress || {};
        
        if (Object.keys(exerciseProgress).length > 0) {
          const transformed = MIGRATION_MAPPING['exerciseProgress'].transform(exerciseProgress);
          
          const operations = transformed.map(progress => ({
            type: 'create',
            store: 'exerciseProgress',
            data: progress
          }));
          
          await this.indexedDBManager.batch(operations);
          this.migrationStatus.migratedData.exerciseProgress = transformed;
          
          console.log(`📈 ${transformed.length} exercise progress records migrated`);
        }
      }
    } catch (error) {
      console.error('❌ Failed to migrate exercise progress:', error);
      throw error;
    }
  }

  /**
   * Verify migration integrity
   */
  async verifyMigration() {
    try {
      console.log('🔍 Verifying migration...');
      
      // Check if essential data exists
      const userStats = await this.indexedDBManager.read('userStats', 'global');
      if (!userStats) {
        throw new Error('User stats not found after migration');
      }

      // Check data counts
      const wrongAnswersCount = await this.indexedDBManager.count('wrongAnswers');
      const preferencesCount = await this.indexedDBManager.count('userPreferences');
      
      console.log('📊 Migration verification:', {
        userStats: !!userStats,
        wrongAnswersCount,
        preferencesCount
      });

      return true;
    } catch (error) {
      console.error('❌ Migration verification failed:', error);
      return false;
    }
  }

  /**
   * Rollback migration on failure
   */
  async rollbackMigration() {
    try {
      console.log('🔄 Rolling back migration...');
      
      // Clear all IndexedDB stores
      const storeNames = ['userStats', 'wrongAnswers', 'userPreferences', 'exerciseProgress'];
      
      for (const storeName of storeNames) {
        await this.indexedDBManager.clearStore(storeName);
      }
      
      // Remove migration flag
      localStorage.removeItem('indexeddb_migration_completed');
      
      console.log('✅ Migration rollback completed');
    } catch (error) {
      console.error('❌ Rollback failed:', error);
    }
  }

  /**
   * Clean up localStorage after successful migration
   */
  async cleanupLocalStorage() {
    try {
      console.log('🧹 Cleaning up localStorage...');
      
      // Keep essential items, remove migrated data
      const keysToRemove = [
        'japaneseAppStats',
        'wrongAnswers'
        // Keep theme and other preferences for now
      ];
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
      
      console.log('✅ localStorage cleanup completed');
    } catch (error) {
      console.error('❌ localStorage cleanup failed:', error);
    }
  }

  /**
   * Get migration status
   */
  getMigrationStatus() {
    return { ...this.migrationStatus };
  }

  /**
   * Force migration (for testing)
   */
  async forceMigration() {
    localStorage.removeItem('indexeddb_migration_completed');
    return this.migrateFromLocalStorage();
  }

  /**
   * Export current data for backup
   */
  async exportData() {
    if (!this.indexedDBManager) {
      throw new Error('IndexedDB Manager not initialized');
    }
    
    return this.indexedDBManager.exportData();
  }

  /**
   * Import data from backup
   */
  async importData(backupData) {
    if (!this.indexedDBManager) {
      throw new Error('IndexedDB Manager not initialized');
    }
    
    return this.indexedDBManager.importData(backupData);
  }
}
