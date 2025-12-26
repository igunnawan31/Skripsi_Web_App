import { InternalCreateUserDTO } from 'src/users/application/dtos/request/create-user.dto';
import { InternalUpdateUserDTO } from 'src/users/application/dtos/request/update-user.dto';
import { UserFilterDTO } from 'src/users/application/dtos/request/user-filter.dto';
import { CreateUserResponseDTO } from 'src/users/application/dtos/response/create-response.dto';
import { DeleteUserResponseDTO } from 'src/users/application/dtos/response/delete-response.dto';
import {
  RetrieveAllUserResponseDTO,
  RetrieveUserResponseDTO,
} from 'src/users/application/dtos/response/read-response.dto';
import { UpdateUserResponseDTO } from 'src/users/application/dtos/response/update-response.dto';

export abstract class IUserRepository {
  abstract findAll(filters: UserFilterDTO): Promise<RetrieveAllUserResponseDTO>;
  abstract findById(id: string): Promise<RetrieveUserResponseDTO>;
  abstract create(data: InternalCreateUserDTO): Promise<CreateUserResponseDTO>;
  abstract update(
    id: string,
    data: InternalUpdateUserDTO,
  ): Promise<UpdateUserResponseDTO>;
  abstract remove(id: string): Promise<DeleteUserResponseDTO>;
  abstract findByEmail(email: string): Promise<RetrieveUserResponseDTO>;
}
