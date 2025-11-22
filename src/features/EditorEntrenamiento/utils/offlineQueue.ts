import { Day } from '../types/training';

export interface OfflineOperation {
  id: string;
  type: 'save_program'; // Extendable for 'update_day', 'delete_exercise', etc.
  data: Day[];
  timestamp: number;
  label?: string;
}

class OfflineQueueManager {
  private queue: OfflineOperation[] = [];
  private readonly STORAGE_KEY = 'offline_sync_queue';
  private listeners: ((queue: OfflineOperation[]) => void)[] = [];

  constructor() {
    this.loadQueue();
  }

  private loadQueue() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.queue = JSON.parse(saved);
      } catch (e) {
        console.error('Error loading offline queue', e);
        this.queue = [];
      }
    }
  }

  private saveQueue() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.queue));
    this.notifyListeners();
  }

  public addOperation(op: Omit<OfflineOperation, 'id' | 'timestamp'>) {
    const operation: OfflineOperation = {
      ...op,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36),
      timestamp: Date.now(),
    };
    
    // Optimization: For full program saves, we only need the latest state.
    // Remove any pending save_program operations to avoid redundant processing.
    if (op.type === 'save_program') {
        this.queue = this.queue.filter(o => o.type !== 'save_program');
    }

    this.queue.push(operation);
    this.saveQueue();
    console.log('Operation added to offline queue:', operation);
  }

  public getQueue(): OfflineOperation[] {
    return [...this.queue];
  }

  public removeOperation(id: string) {
    this.queue = this.queue.filter(op => op.id !== id);
    this.saveQueue();
  }

  public clearQueue() {
    this.queue = [];
    this.saveQueue();
  }

  public subscribe(listener: (queue: OfflineOperation[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(l => l(this.getQueue()));
  }
}

export const offlineQueue = new OfflineQueueManager();
