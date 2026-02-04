import { Injectable } from "@nestjs/common";
import { IIndikatorRepository } from "../../domain/repositories/indikator.repository.interface";
import { PrismaService } from "src/modules/database/prisma/prisma.service";

// @Injectable()
// export class IndikatorRepository implements IIndikatorRepository {
//   constructor(private readonly prisma: PrismaService) { }
// }
