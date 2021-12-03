import ZBar from './ZBar';

const instantiate = require('./zbar')

export const loadWasmInstance = async (
  importObj: any
): Promise<ZBar | null> => {
  return await instantiate(importObj);
};
