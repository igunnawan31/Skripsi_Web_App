import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { plainToInstance } from "class-transformer";
import { handlePrismaError } from "src/common/errors/prisma-exception";
import { PrismaService } from "src/database/prisma/prisma.service";
import { CreateGajiDTO } from "src/gaji/application/dtos/request/create-gaji.dto";
import { GajiFilterDTO } from "src/gaji/application/dtos/request/gaji-filter.dto";
import { UpdateGajiDTO } from "src/gaji/application/dtos/request/update-gaji.dto";
import { CreateGajiResponseDTO } from "src/gaji/application/dtos/response/create-response.dto";
import { DeleteGajiResponseDTO } from "src/gaji/application/dtos/response/delete-response.dto";
import { RetrieveAllGajiResponseDTO, RetrieveGajiResponseDTO, RetrieveGajiUserResponseDTO } from "src/gaji/application/dtos/response/read-response.dto";
import { UpdateGajiResponseDTO } from "src/gaji/application/dtos/response/update-response.dto";
import { IGajiRepository } from "src/gaji/domain/repositories/gaji.repository.interface";
import { KontrakBaseDTO } from "src/kontrak/application/dtos/base.dto";
import { UserBaseDTO } from 'src/users/application/dtos/base.dto';


@Injectable()
export class GajiRepository implements IGajiRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateGajiDTO): Promise<CreateGajiResponseDTO> {
        try {
            const query = await this.prisma.gaji.create({
                data: {
                    userId: dto.userData.id,
                    kontrakId: dto.kontrakData.id,
                    ...dto,
                },
                include: {
                    user: true,
                    kontrak: true,
                },
            });
            return plainToInstance(CreateGajiResponseDTO, query);
        } catch (err) {
            handlePrismaError(err, 'Gaji');
        }
    }

    async findAll(filters: GajiFilterDTO): Promise<RetrieveAllGajiResponseDTO> {
        try {
            const {

            } = filters;

            const where: Prisma.
        }
    }

    async findById(id: string): Promise<RetrieveGajiResponseDTO> {
        try {
            const gaji = this.prisma.gaji.findUnique({
                where: { id },
                include: {
                    user: true,
                    kontrak: true,
                },
            });

            if (!gaji) throw new NotFoundException('Gaji data not found');
            return plainToInstance(RetrieveGajiResponseDTO, {
                ...gaji,
                user: plainToInstance(UserBaseDTO, gaji.user),
                kontrak: plainToInstance(KontrakBaseDTO, gaji.kontrak),
            });
        } catch (err) {
            handlePrismaError(err, 'Gaji', id);
        }
    }

    async findByUserId(userId: string, filters: GajiFilterDTO) : Promise<RetrieveGajiUserResponseDTO> {
        try {
            const user = await this.prisma.user.findUnique({
                where: {id: userId}
            });

            if (!user) throw new NotFoundException('User data not found');
            const where: any = { userId };

            if (filters.status) {
                where.status = filters.status;
            }
        }
    }

    async update(id: string, dto: UpdateGajiDTO): Promise<UpdateGajiResponseDTO> {
        try {
            const target = this.findById(id);
            if (!target) throw new NotFoundException('Gaji data not found');

            const query = await this.prisma.gaji.update({
                where: {id},
                data: dto,
            });

            return plainToInstance(UpdateGajiResponseDTO, query);
        } catch (err) {
            handlePrismaError(err, 'Gaji', id);
        }
    }

    async updatePayment(id: string): Promise<UpdateGajiResponseDTO> {
        try {
            const target = this.findById(id);
            if (!target) throw new NotFoundException('Gaji data not found');

            const query = await this.prisma.gaji.update({
                where: {id},
                data: {
                    paymentDate: new Date(),
                },
            });

            return plainToInstance(UpdateGajiResponseDTO, query);
        } catch (err) {
            handlePrismaError(err, 'Gaji', id);
        }
    }

    async remove(id: string): Promise<DeleteGajiResponseDTO> {
        try {
            const target = this.findById(id);
            if (!target) throw new NotFoundException('Gaji Data not found');

            const query = await this.prisma.gaji.delete({
                where: {id},
            });
            
            return plainToInstance(DeleteGajiResponseDTO, query);
        } catch (err) {
            handlePrismaError(err, 'Gaji', id);
        }
    }
}