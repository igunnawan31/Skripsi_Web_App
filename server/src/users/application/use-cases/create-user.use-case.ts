import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/users/domain/repositories/users.repository.interface';
import { CreateUserDTO } from '../dtos/request/create-user.dto';
import { CreateUserResponseDTO } from '../dtos/response/create-response.dto';
import * as bcrypt from 'bcryptjs';
import { UserValidationService } from 'src/users/domain/services/user-validation.service';
import { EmployeeType } from '@prisma/client';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(IUserRepository) private readonly userRepo: IUserRepository,
    private readonly validationService: UserValidationService,
  ) {}

  async execute(dto: CreateUserDTO): Promise<CreateUserResponseDTO> {
    const exists = await this.userRepo.findByEmail(dto.email);
    if (exists) {
      throw new BadRequestException('Email sudah terdaftar');
    }

    const passwordValidation = this.validationService.validatePasswordStrength(
      dto.password,
    );
    if (!passwordValidation.valid) {
      throw new BadRequestException(passwordValidation.message);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userRepo.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      majorRole: dto.majorRole,
      minorRole: dto.minorRole,
      employeeType: dto.employeeType ?? EmployeeType.CONTRACT,
    });

    // this.eventEmitter.emit(
    //   'user.created',
    //   new UserCreatedEvent(user.id, user.email, user.name, createdBy),
    // );

    return user;
  }
}
