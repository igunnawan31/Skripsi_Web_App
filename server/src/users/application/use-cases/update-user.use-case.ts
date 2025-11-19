import {
  Injectable,
  Inject,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { IUserRepository } from 'src/users/domain/repositories/users.repository.interface';
import { UserValidationService } from 'src/users/domain/services/user-validation.service';
import { UpdateUserDTO } from '../dtos/request/update-user.dto';
import { UserRequest } from 'src/shared/dtos/UserRequest.dto';
import { UpdateUserResponseDTO } from '../dtos/response/update-response.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepo: IUserRepository,
    private readonly validationService: UserValidationService,
  ) {}

  async execute(
    userId: string,
    dto: UpdateUserDTO,
    currentUser: UserRequest,
  ): Promise<UpdateUserResponseDTO> {
    // STEP 1: Load target user
    const targetUser = await this.userRepo.findById(userId);
    if (!targetUser) {
      throw new NotFoundException('User tidak ditemukan');
    }

    if (dto.majorRole || dto.minorRole) {
      const canUpdate = this.validationService.canUpdateRole(
        currentUser,
        targetUser,
      );
      if (!canUpdate) {
        throw new ForbiddenException(
          'Anda tidak memiliki akses untuk mengubah role user ini',
        );
      }
    }

    if (dto.password) {
      const passwordValidation =
        this.validationService.validatePasswordStrength(dto.password);
      if (!passwordValidation.valid) {
        throw new BadRequestException(passwordValidation.message);
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);
      dto.password = hashedPassword;
    }
    const updatedUser = await this.userRepo.update(userId, dto);

    // const updatedFields = Object.keys(dto);
    // this.eventEmitter.emit(
    //   'user.updated',
    //   new UserUpdatedEvent(userId, updatedFields, currentUser.id),
    // );

    return updatedUser;
  }
}
