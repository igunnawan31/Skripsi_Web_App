import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IAbsensiRepository } from 'src/absensi/domain/repositories/absensi.repository.interface';
import { CheckOutResponseDTO } from '../dtos/response/update-response.dto';
import { AbsensiCheckedOutEvent } from '../events/absensi.events';
import { FileMetaData } from 'src/common/types/FileMetaData.dto';

@Injectable()
export class CheckOutUseCase {
  constructor(
    @Inject(IAbsensiRepository)
    private readonly absensiRepo: IAbsensiRepository,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async execute(
    userId: string,
    checkOutPhoto: FileMetaData,
  ): Promise<CheckOutResponseDTO> {
    const today = new Date();

    const absensi = await this.absensiRepo.findByUserAndDate(userId, today);
    if (!absensi) {
      throw new BadRequestException('Anda belum check-in hari ini');
    }
    if (absensi.checkOut) {
      throw new BadRequestException('Anda sudah check-out hari ini');
    }

    let photo = absensi.photo ?? [];
    if (checkOutPhoto) {
      // contains previous checkInPhoto, push the check out photo so there will be two photos inside attribute photo
      photo = [...photo, checkOutPhoto]
    }
    const now = new Date();
    const updatedAbsensi = await this.absensiRepo.checkOut({
      userId,
      date: today,
      photo,
    });

    const duration = Math.floor(
      (now.getTime() - new Date(absensi.checkIn).getTime()) / (1000 * 60),
    ); // in minutes

    this.eventEmitter.emit(
      'absensi.checkedOut',
      new AbsensiCheckedOutEvent(
        userId,
        today,
        new Date(absensi.checkIn),
        now,
        duration,
      ),
    );

    return updatedAbsensi;
  }
}
