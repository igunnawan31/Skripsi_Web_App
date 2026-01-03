import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { deleteFile } from 'src/common/utils/fileHelper';
import { IUserRepository } from '../../domain/repositories/users.repository.interface';
import { UserValidationService } from '../../domain/services/user-validation.service';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepo: IUserRepository,
    private readonly validationService: UserValidationService,
  ) { }

  async execute(userId: string, deletedBy: string): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    const canDelete = this.validationService.canDeleteUser(user);
    if (!canDelete) {
      throw new BadRequestException(
        'User dengan role OWNER tidak dapat dihapus',
      );
    }
    if (user.photo) {
      await deleteFile(user.photo.path);
    }
    const deletedUser = await this.userRepo.remove(userId);
    // this.eventEmitter.emit(
    //   'user.deleted',
    //   new UserDeletedEvent(userId, user.email, deletedBy),
    // );
    // return deletedUser;
  }
}
