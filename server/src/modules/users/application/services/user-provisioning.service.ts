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
      const passwordValidation =
        this.validationService.validatePasswordStrength(input.password);
      if (!passwordValidation.valid) {
        if (input.photo) {
          await deleteFile(input.photo.path);
        }
        throw new BadRequestException(
          `User data: ${passwordValidation.message}`,
        );
      }
      const hashedPassword = await bcrypt.hash(input.password, 10);
      const user = await this.repo.create({
        name: input.name,
        email: input.email,
        password: hashedPassword,
        majorRole: 'KARYAWAN',
        minorRole: input.minorRole,
        photo: input.photo,
      });
      rollback.register(() => this.repo.remove(user.id));
      return user;
    }
  }
}
