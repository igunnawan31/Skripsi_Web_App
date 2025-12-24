import { Injectable, NotFoundException } from '@nestjs/common';
import { existsSync, promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
  private readonly uploadsRoot = path.join(process.cwd(), 'uploads');

  async getFileByPath(dbPath: string): Promise<string | null> {
    // Normalize the requested path
    const resolvedPath = path.resolve(
      this.uploadsRoot,
      dbPath.replace(/^uploads[\\/]/, ''),
    );

    // Ensure it stays inside uploads/
    if (!resolvedPath.startsWith(this.uploadsRoot)) {
      return null;
    }

    try {
      await fs.access(resolvedPath);
      return resolvedPath;
    } catch {
      return null;
    }
  }
}

