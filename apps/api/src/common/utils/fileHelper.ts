import * as fs from 'fs/promises';
import * as path from 'path';
import { FileMetaData } from '../types/FileMetaData.dto';

export const deleteFile = async (filePath: string): Promise<void> => {
  const finalPath = path.join(process.cwd(), filePath);

  try {
    await fs.unlink(finalPath);
  } catch (err: any) {
    console.warn(`Failed to delete file ${finalPath}:`, err);
  }
};

// Helper function to delete file arrays
export const deleteFileArray = async (
  fileArray: FileMetaData[],
  fileType: string,
): Promise<void> => {
  if (!fileArray || !Array.isArray(fileArray)) {
    return;
  }

  for (const file of fileArray) {
    if (file && typeof file.path === 'string' && file.path.trim()) {
      await deleteFile(file.path);
    } else {
      console.warn(`Invalid file path found in ${fileType}:`, file);
    }
  }
};

export const deleteFileArrayString = async (
  fileArray: string[],
  fileType: string,
): Promise<void> => {
  if (!fileArray || !Array.isArray(fileArray)) {
    return;
  }

  for (const file of fileArray) {
    if (file && file.trim()) {
      await deleteFile(file);
    } else {
      console.warn(`Invalid file path found in ${fileType}:`, file);
    }
  }
};
