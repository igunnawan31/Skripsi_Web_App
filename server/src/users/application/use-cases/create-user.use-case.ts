import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/users/domain/repositories/users.repository.interface';
import { InternalCreateUserDTO } from '../dtos/request/create-user.dto';
import { CreateUserResponseDTO } from '../dtos/response/create-response.dto';
import * as bcrypt from 'bcryptjs';
import { UserValidationService } from 'src/users/domain/services/user-validation.service';
import { deleteFile } from 'src/common/utils/fileHelper';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(IUserRepository) private readonly userRepo: IUserRepository,
    private readonly validationService: UserValidationService,
  ) { }

  async execute(dto: InternalCreateUserDTO): Promise<CreateUserResponseDTO> {
    const exists = await this.userRepo.findByEmail(dto.email);
    if (exists) {
      if (dto.photo) {
        await deleteFile(dto.photo.path);
      }
      throw new BadRequestException('Email sudah terdaftar');
    }

    const passwordValidation = this.validationService.validatePasswordStrength(
      dto.password,
    );
    if (!passwordValidation.valid) {
      if (dto.photo) {
        await deleteFile(dto.photo.path);
      }
      throw new BadRequestException(passwordValidation.message);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepo.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      majorRole: dto.majorRole,
      minorRole: dto.minorRole,
      photo: dto.photo,
    });

    // this.eventEmitter.emit(
    //   'user.created',
    //   new UserCreatedEvent(user.id, user.email, user.name, createdBy),
    // );

    return user;
  }
}
