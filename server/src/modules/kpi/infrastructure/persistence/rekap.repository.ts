import { Injectable } from "@nestjs/common";
import { IRekapRepository } from "../../domain/repositories/rekap.repository.interface";
import { PrismaService } from "src/modules/database/prisma/prisma.service";
import { LoggerService } from "src/modules/logger/logger.service";

@Injectable()
export class RekapRepository implements IRekapRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) { }
}
