import { Day } from '../types/training';

// Simulates a remote API service
export const MockApiService = {
  saveProgram: async (data: Day[], label?: string): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve, reject) => {
        // Simulate network latency
      setTimeout(() => {
        // Check navigator.onLine strictly for simulation
        if (!navigator.onLine) {
            console.warn('MockAPI: Request failed - Offline');
            reject(new Error('Network Error: Offline'));
            return;
        }

        // Simulate random server glitch (optional, kept low for stability in demo)
        // if (Math.random() < 0.05) {
        //     reject(new Error('500 Internal Server Error'));
        //     return;
        // }

        console.log('MockAPI: Data saved to "remote" server', { label, dataSummary: data.length + ' days' });
        resolve({ success: true, message: 'Saved successfully to remote' });
      }, 1000);
    });
  }
};
