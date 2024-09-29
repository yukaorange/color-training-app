import { proxy } from 'valtio';

export const waitingStore = proxy({
  isWaiting: false,
});

export const waitingActions = {
  setIsWaiting: (value: boolean) => {
    waitingStore.isWaiting = value;
  },
};
