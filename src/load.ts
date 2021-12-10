import ZBar from './ZBar';
import instantiate from './zbar';

export const loadWasmInstance = async (
  importObj: any
): Promise<ZBar | null> => {
  return await instantiate(importObj);
};
