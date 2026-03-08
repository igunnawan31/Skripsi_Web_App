import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserProvisionInputDTO } from '../dtos/request/create-user.dto';
import { RollbackManager } from 'src/common/utils/rollbackManager';
import { deleteFile } from 'src/common/utils/fileHelper';
import { IUserRepository } from '../../domain/repositories/users.repository.interface';
import { UserValidationService } from '../../domain/services/user-validation.service';

@Injectable()
export class UserProvisionService {
  constructor(
    @Inject(IUserRepository)
    private readonly repo: IUserRepository,
    private readonly validationService: UserValidationService,
  ) {}

  async resolve(input: UserProvisionInputDTO, rollback: RollbackManager) {
    if (input.id) {
      // Existing User
      // Delete sent photo since existing user is used
      if (input.photo) {
        await deleteFile(input.photo.path);
      }
      const user = await this.repo.findById(input.id);
      if (!user) {
        throw new NotFoundException('User tidak ditemukan');
      }
      return user;
    } else {
      const rawPassword = this.generatePassword();

      const passwordValidation =
        this.validationService.validatePasswordStrength(rawPassword);
      if (!passwordValidation.valid) {
        if (input.photo) {
          await deleteFile(input.photo.path);
        }
        throw new BadRequestException(
          `User data: ${passwordValidation.message}`,
        );
      }
      const hashedPassword = await bcrypt.hash(rawPassword, 10);
      const user = await this.repo.create({
        name: input.name,
        email: input.email,
        password: hashedPassword,
        majorRole: 'KARYAWAN',
        minorRole: input.minorRole,
        photo: input.photo,
      });
      rollback.register(() => this.repo.remove(user.id));
      const result = {
        ...user,
        password: rawPassword,
      }
      return result;
    }
  }

  private generatePassword(): string {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const special = '!@#$%^&*';
    const all = upper + lower + digits + special;

    // Guarantee at least one of each required char type
    const required = [
      upper[Math.floor(Math.random() * upper.length)],
      lower[Math.floor(Math.random() * lower.length)],
      digits[Math.floor(Math.random() * digits.length)],
      special[Math.floor(Math.random() * special.length)],
    ];

    const rest = Array.from(
      { length: 8 },
      () => all[Math.floor(Math.random() * all.length)],
    );

    // Shuffle so required chars aren't always at the start
    return [...required, ...rest].sort(() => Math.random() - 0.5).join('');
  }
}
