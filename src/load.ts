import ZBarInstance from './ZBarInstance';
import instantiate from './zbar';

export const loadWasmInstance = async (
  importObj: any
): Promise<ZBarInstance | null> => {
  return await instantiate(importObj);
};
