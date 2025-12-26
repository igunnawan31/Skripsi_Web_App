import {
  Injectable,
  Inject,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { IUserRepository } from 'src/users/domain/repositories/users.repository.interface';
import { UserValidationService } from 'src/users/domain/services/user-validation.service';
import { InternalUpdateUserDTO } from '../dtos/request/update-user.dto';
import { UpdateUserResponseDTO } from '../dtos/response/update-response.dto';
import * as bcrypt from 'bcryptjs';
import { UserRequest } from 'src/common/types/UserRequest.dto';
import { deleteFile } from 'src/common/utils/fileHelper';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepo: IUserRepository,
    private readonly validationService: UserValidationService,
  ) { }

  async execute(
    userId: string,
    dto: InternalUpdateUserDTO,
    currentUser: UserRequest,
  ): Promise<UpdateUserResponseDTO> {
    const targetUser = await this.userRepo.findById(userId);
    if (!targetUser) {
      if (dto.photo) {
        await deleteFile(dto.photo.path);
      }
      throw new NotFoundException('User tidak ditemukan');
    }

    if (dto.majorRole || dto.minorRole) {
      const canUpdate = this.validationService.canUpdateRole(
        currentUser,
        targetUser,
      );
      if (!canUpdate) {
        if (dto.photo) {
          await deleteFile(dto.photo.path);
        }
        throw new ForbiddenException(
          'Anda tidak memiliki akses untuk mengubah role user ini',
        );
      }
    }

    if (dto.password) {
      const passwordValidation =
        this.validationService.validatePasswordStrength(dto.password);
      if (!passwordValidation.valid) {
        if (dto.photo) {
          await deleteFile(dto.photo.path);
        }
        throw new BadRequestException(passwordValidation.message);
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);
      dto.password = hashedPassword;
    }

    if (dto.photo && targetUser.photo) {
      console.log("Invoked");
      await deleteFile(targetUser.photo.path);
    }
    console.log(dto.photo);
    const updatedUser = await this.userRepo.update(userId, {
      ...dto,
      photo: dto.photo,
    });

    // const updatedFields = Object.keys(dto);
    // this.eventEmitter.emit(
    //   'user.updated',
    //   new UserUpdatedEvent(userId, updatedFields, currentUser.id),
    // );

    return updatedUser;
  }
}
