import { Module } from '@nestjs/common';
import { UsersController } from './presentation/users.controller';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { UserValidationService } from './domain/services/user-validation.service';
import { IUserRepository } from './domain/repositories/users.repository.interface';
import { UserRepository } from './infrastructure/persistence/users.repository';

@Module({
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    UserValidationService,
    { provide: IUserRepository, useClass: UserRepository },
  ],
  exports: [IUserRepository],
})
export class UsersModule {}
