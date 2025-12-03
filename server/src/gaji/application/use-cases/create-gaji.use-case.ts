// import { Inject, Injectable } from '@nestjs/common';
// import { IGajiRepository } from 'src/gaji/domain/repositories/gaji.repository.interface';
// import { IKontrakRepository } from 'src/kontrak/domain/repositories/kontrak.repository.interface';
// import { IUserRepository } from 'src/users/domain/repositories/users.repository.interface';
// import { CreateGajiDTO } from '../dtos/request/create-gaji.dto';
// import { CreateGajiResponseDTO } from '../dtos/response/create-response.dto';
// import { EventEmitter2 } from '@nestjs/event-emitter';
// import { GajiValidationService } from 'src/gaji/domain/services/gaji-validation.service';
// import { plainToClass } from 'class-transformer';
// import { GajiStatus } from '@prisma/client';
// import { GajiCreatedEvent } from '../events/gaji.events';
// import { UserBaseDTO } from 'src/users/application/dtos/base.dto';
// import { KontrakBaseDTO } from 'src/kontrak/application/dtos/base.dto';
//
// @Injectable()
// export class CreateGajiUseCase {
//   constructor(
//     @Inject(IGajiRepository)
//     private readonly gajiRepo: IGajiRepository,
//     @Inject(IKontrakRepository)
//     private readonly kontrakRepo: IKontrakRepository,
//     @Inject(IUserRepository)
//     private readonly userRepo: IUserRepository,
//     private readonly validationService: GajiValidationService,
//     private readonly eventEmitter: EventEmitter2,
//   ) { }
//
//   async execute(
//     dto: CreateGajiDTO,
//     createdBy: string,
//   ): Promise<CreateGajiResponseDTO> {
//     const dateValidation = this.validationService.validateDates(
//       new Date(dto.periode),
//       new Date(dto.dueDate),
//     );
//
//     let user: UserBaseDTO;
//     if (dto.userData.id) {
//       user = await this.userRepo.findById(dto.userData.id);
//     }
//
//     let kontrak: KontrakBaseDTO;
//     if (dto.kontrakData.id) {
//       kontrak = await this.kontrakRepo.findById(dto.kontrakData.id);
//     }
//
//     const gajiData: CreateGajiDTO = plainToClass(CreateGajiDTO, {
//       userData: dto.userData,
//       kontrakData: dto.kontrakData,
//       periode: dto.periode,
//       dueDate: dto.dueDate,
//       status: GajiStatus.BELUM_DIBAYAR,
//       amount: dto.amount,
//       paymentDate: dto.paymentDate,
//     });
//
//     const gaji = await this.gajiRepo.create(gajiData);
//
//     this.eventEmitter.emit(
//       'gaji.created',
//       new GajiCreatedEvent(
//         gaji.id,
//         gaji.userId,
//         gaji.kontrakId,
//         dto.periode,
//         dto.dueDate,
//         dto.amount,
//       ),
//     );
//
//     return gaji;
//   }
// }
