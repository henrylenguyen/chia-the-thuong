/**
 * IndexedDB Manager - Modern database operations for Japanese Learning App
 * Provides async, high-performance data storage with advanced querying
 */

import { DB_SCHEMA } from '../utils/db-schema.js';

export class IndexedDBManager {
  constructor() {
    this.db = null;
    this.dbName = DB_SCHEMA.name;
    this.dbVersion = DB_SCHEMA.version;
    this.isInitialized = false;
  }

  /**
   * Initialize IndexedDB connection
   */
  async init() {
    try {
      console.log('🗄️ Initializing IndexedDB...');
      
      if (!window.indexedDB) {
        throw new Error('IndexedDB not supported in this browser');
      }

      this.db = await this.openDatabase();
      this.isInitialized = true;
      
      console.log('✅ IndexedDB initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize IndexedDB:', error);
      throw error;
    }
  }

  /**
   * Open database with version management
   */
  openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        reject(new Error(`Failed to open database: ${request.error}`));
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        console.log('🔄 Upgrading database schema...');
        this.upgradeDatabase(event.target.result, event.oldVersion);
      };
    });
  }

  /**
   * Upgrade database schema
   */
  upgradeDatabase(db, oldVersion) {
    console.log(`📈 Upgrading from version ${oldVersion} to ${this.dbVersion}`);

    // Create object stores based on schema
    Object.entries(DB_SCHEMA.stores).forEach(([storeName, config]) => {
      if (!db.objectStoreNames.contains(storeName)) {
        console.log(`📦 Creating store: ${storeName}`);
        
        const store = db.createObjectStore(storeName, {
          keyPath: config.keyPath,
          autoIncrement: config.autoIncrement || false
        });

        // Create indexes
        if (config.indexes) {
          Object.entries(config.indexes).forEach(([indexName, keyPath]) => {
            store.createIndex(indexName, keyPath, { unique: false });
            console.log(`🔍 Created index: ${indexName} on ${keyPath}`);
          });
        }
      }
    });
  }

  /**
   * Create/Insert data into store
   */
  async create(storeName, data) {
    this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error(`Failed to create in ${storeName}: ${request.error}`));
    });
  }

  /**
   * Read data from store
   */
  async read(storeName, key) {
    this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error(`Failed to read from ${storeName}: ${request.error}`));
    });
  }

  /**
   * Update data in store
   */
  async update(storeName, data) {
    this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error(`Failed to update in ${storeName}: ${request.error}`));
    });
  }

  /**
   * Delete data from store
   */
  async delete(storeName, key) {
    this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(new Error(`Failed to delete from ${storeName}: ${request.error}`));
    });
  }

  /**
   * Get all data from store
   */
  async getAll(storeName, indexName = null, query = null) {
    this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      
      let source = store;
      if (indexName) {
        source = store.index(indexName);
      }
      
      const request = query ? source.getAll(query) : source.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error(`Failed to get all from ${storeName}: ${request.error}`));
    });
  }

  /**
   * Query data with range
   */
  async query(storeName, indexName, range) {
    this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(range);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error(`Failed to query ${storeName}: ${request.error}`));
    });
  }

  /**
   * Count records in store
   */
  async count(storeName, indexName = null, query = null) {
    this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      
      let source = store;
      if (indexName) {
        source = store.index(indexName);
      }
      
      const request = query ? source.count(query) : source.count();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error(`Failed to count in ${storeName}: ${request.error}`));
    });
  }

  /**
   * Search data (simple text search)
   */
  async search(storeName, searchTerm, searchField = 'question') {
    const allData = await this.getAll(storeName);
    const searchLower = searchTerm.toLowerCase();
    
    return allData.filter(item => {
      const fieldValue = item[searchField];
      return fieldValue && fieldValue.toLowerCase().includes(searchLower);
    });
  }

  /**
   * Execute multiple operations in a transaction
   */
  async transaction(storeNames, mode, operations) {
    this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeNames, mode);
      const results = [];

      transaction.oncomplete = () => resolve(results);
      transaction.onerror = () => reject(new Error(`Transaction failed: ${transaction.error}`));

      operations.forEach((operation, index) => {
        const store = transaction.objectStore(operation.store);
        let request;

        switch (operation.type) {
          case 'create':
            request = store.add(operation.data);
            break;
          case 'read':
            request = store.get(operation.key);
            break;
          case 'update':
            request = store.put(operation.data);
            break;
          case 'delete':
            request = store.delete(operation.key);
            break;
          default:
            throw new Error(`Unknown operation type: ${operation.type}`);
        }

        request.onsuccess = () => {
          results[index] = request.result;
        };
      });
    });
  }

  /**
   * Batch operations for better performance
   */
  async batch(operations) {
    const storeNames = [...new Set(operations.map(op => op.store))];
    return this.transaction(storeNames, 'readwrite', operations);
  }

  /**
   * Clear all data from a store
   */
  async clearStore(storeName) {
    this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(new Error(`Failed to clear ${storeName}: ${request.error}`));
    });
  }

  /**
   * Export all data for backup
   */
  async exportData() {
    const exportData = {};
    
    for (const storeName of Object.keys(DB_SCHEMA.stores)) {
      exportData[storeName] = await this.getAll(storeName);
    }
    
    return {
      version: this.dbVersion,
      timestamp: new Date().toISOString(),
      data: exportData
    };
  }

  /**
   * Import data from backup
   */
  async importData(backupData) {
    if (backupData.version !== this.dbVersion) {
      console.warn(`Version mismatch: backup ${backupData.version}, current ${this.dbVersion}`);
    }

    const operations = [];
    
    Object.entries(backupData.data).forEach(([storeName, records]) => {
      records.forEach(record => {
        operations.push({
          type: 'create',
          store: storeName,
          data: record
        });
      });
    });

    return this.batch(operations);
  }

  /**
   * Get database info
   */
  getInfo() {
    return {
      name: this.dbName,
      version: this.dbVersion,
      isInitialized: this.isInitialized,
      stores: Object.keys(DB_SCHEMA.stores)
    };
  }

  /**
   * Close database connection
   */
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.isInitialized = false;
      console.log('🔒 IndexedDB connection closed');
    }
  }

  /**
   * Ensure database is initialized
   */
  ensureInitialized() {
    if (!this.isInitialized || !this.db) {
      throw new Error('IndexedDB not initialized. Call init() first.');
    }
  }
}
