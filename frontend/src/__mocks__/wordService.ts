export const wordService = {
  getPendingWords: jest.fn().mockResolvedValue([]),
  getAllWords: jest.fn().mockResolvedValue([]),
  createWord: jest.fn().mockResolvedValue({}),
  updateWord: jest.fn().mockResolvedValue({}),
  deleteWord: jest.fn().mockResolvedValue({}),
  getWordById: jest.fn().mockResolvedValue({}),
  approveWord: jest.fn().mockResolvedValue({}),
  rejectWord: jest.fn().mockResolvedValue({}),
};
