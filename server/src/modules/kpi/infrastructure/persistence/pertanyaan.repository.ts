import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/database/prisma/prisma.service';
import { IPertanyaanRepository } from '../../domain/repositories/pertanyaan.repository.interface';

// @Injectable()
// export class PertanyaanRepository implements IPertanyaanRepository {
//   constructor(private readonly prisma: PrismaService) { }
// }
