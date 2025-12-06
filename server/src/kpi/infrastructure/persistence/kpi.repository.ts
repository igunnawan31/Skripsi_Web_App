import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { IKPIRepository } from 'src/kpi/domain/repositories/kpi.repository.interface';

@Injectable()
export class KPIRepository implements IKPIRepository {
  constructor(private readonly prisma: PrismaService) { }
}
