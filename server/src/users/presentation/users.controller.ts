import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { IUserRepository } from '../domain/repositories/users.repository.interface';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { DeleteUserUseCase } from '../application/use-cases/delete-user.use-case';
import { UpdateUserUseCase } from '../application/use-cases/update-user.use-case';
import { CreateUserDTO } from '../application/dtos/request/create-user.dto';
import { UserRequest } from 'src/shared/dtos/UserRequest.dto';
import { RolesMajor } from 'src/common/decorators/major-roles.decorator';
import { RolesMinor } from 'src/common/decorators/minor-role.decorator';
import { MajorRole, MinorRole } from '@prisma/client';
import { UserFilterDTO } from '../application/dtos/request/user-filter.dto';
import { UpdateUserDTO } from '../application/dtos/request/update-user.dto';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}

  @Post()
  @RolesMinor(MinorRole.HR)
  create(@Body() dto: CreateUserDTO) {
    return this.createUserUseCase.execute(dto);
  }

  @Get()
  findAll(@Query() filters: UserFilterDTO) {
    return this.userRepo.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userRepo.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDTO,
    @Req() req: Request & { user: UserRequest },
  ) {
    return this.updateUserUseCase.execute(id, dto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request & { user: UserRequest }) {
    return this.deleteUserUseCase.execute(id, req.user.id);
  }
}
