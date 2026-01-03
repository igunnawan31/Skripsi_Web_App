import { Injectable } from '@nestjs/common';
import { IKPIRepository } from '../../domain/repositories/kpi.repository.interface';
import { PrismaService } from 'src/modules/database/prisma/prisma.service';

@Injectable()
export class KPIRepository implements IKPIRepository {
  constructor(private readonly prisma: PrismaService) { }
}
