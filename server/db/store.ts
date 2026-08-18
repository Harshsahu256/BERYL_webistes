import fs from 'fs';
import path from 'path';
import { INITIAL_CATEGORIES, INITIAL_SUBCATEGORIES, INITIAL_PDFS } from '../../src/data/companyData';
import { Category, Subcategory, PdfDocument } from '../../src/types';

// Local storage file path (Persistent on server disk)
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'local_db.json');

// Ensure storage directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.warn('Could not create storage directory:', err);
  }
}

interface DatabaseState {
  categories: Category[];
  subcategories: Subcategory[];
  pdfs: PdfDocument[];
}

// Load persisted state from disk, fallback to initial default company data
function loadPersistedState(): DatabaseState {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.categories) && Array.isArray(parsed.pdfs)) {
        return {
          categories: parsed.categories,
          subcategories: parsed.subcategories || INITIAL_SUBCATEGORIES,
          pdfs: parsed.pdfs,
        };
      }
    }
  } catch (err) {
    console.warn('Notice: Reading local storage file error, using default company data:', err);
  }

  // Initial seed save
  const initialState: DatabaseState = {
    categories: INITIAL_CATEGORIES,
    subcategories: INITIAL_SUBCATEGORIES,
    pdfs: INITIAL_PDFS,
  };
  savePersistedState(initialState);
  return initialState;
}

// Write state atomically to local disk file
function savePersistedState(state: DatabaseState) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving local database state to disk:', err);
  }
}

const currentState = loadPersistedState();

// ============================================================================
// LOCAL PERSISTENT DOCUMENT COLLECTION ENGINE (AUTOSAVES TO DISK)
// ============================================================================
export class LocalMongoCollection<T extends { id: string }> {
  private documents: Map<string, T> = new Map();
  private collectionKey: keyof DatabaseState;

  constructor(collectionKey: keyof DatabaseState, initialData: T[] = []) {
    this.collectionKey = collectionKey;
    initialData.forEach((item) => this.documents.set(item.id, { ...item }));
  }

  private persist() {
    const list = Array.from(this.documents.values());
    (currentState as any)[this.collectionKey] = list;
    savePersistedState(currentState);
  }

  async find(filter?: Partial<T>): Promise<T[]> {
    const list = Array.from(this.documents.values());
    if (!filter || Object.keys(filter).length === 0) {
      return list;
    }
    return list.filter((item) => {
      for (const [key, value] of Object.entries(filter)) {
        if ((item as any)[key] !== value) return false;
      }
      return true;
    });
  }

  async findOne(filter: Partial<T>): Promise<T | null> {
    const results = await this.find(filter);
    return results[0] || null;
  }

  async insertOne(doc: T): Promise<T> {
    this.documents.set(doc.id, { ...doc });
    this.persist();
    return doc;
  }

  async updateOne(id: string, updates: Partial<T>): Promise<T | null> {
    const existing = this.documents.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    this.documents.set(id, updated);
    this.persist();
    return updated;
  }

  async deleteOne(id: string): Promise<boolean> {
    const deleted = this.documents.delete(id);
    if (deleted) {
      this.persist();
    }
    return deleted;
  }

  async deleteMany(filter: Partial<T>): Promise<number> {
    const items = await this.find(filter);
    let deletedCount = 0;
    for (const item of items) {
      if (this.documents.delete(item.id)) {
        deletedCount++;
      }
    }
    if (deletedCount > 0) {
      this.persist();
    }
    return deletedCount;
  }

  async count(filter?: Partial<T>): Promise<number> {
    const items = await this.find(filter);
    return items.length;
  }
}

// ----------------------------------------------------
// Export Persistent Local Collections
// ----------------------------------------------------
export const CategoriesCollection = new LocalMongoCollection<Category>('categories', currentState.categories);
export const SubcategoriesCollection = new LocalMongoCollection<Subcategory>('subcategories', currentState.subcategories);
export const PdfsCollection = new LocalMongoCollection<PdfDocument>('pdfs', currentState.pdfs);
