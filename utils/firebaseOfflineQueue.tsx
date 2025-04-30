import * as Network from 'expo-network';

type FirestoreTask = () => Promise<void>;

const taskQueue: FirestoreTask[] = [];
let isProcessing = false;

export const addTaskToQueue = (task: FirestoreTask) => {
  taskQueue.push(task);
  processQueue(); // Try immediately if back online
};

async function processQueue() {
  if (isProcessing) return;

  const networkState = await Network.getNetworkStateAsync();
  if (!networkState.isConnected) return;

  isProcessing = true;

  while (taskQueue.length > 0) {
    const task = taskQueue.shift();
    if (!task) break;

    try {
      await task();
    } catch (e) {
      console.error("🔥 Failed task even after reconnect:", e);
      // Optional: push it back into queue if you want repeated retries
    }
  }

  isProcessing = false;
}

// Optional: expose a manual way to force retry
export const retryOfflineTasks = processQueue;
