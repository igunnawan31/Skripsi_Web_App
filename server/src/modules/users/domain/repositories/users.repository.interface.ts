import { InternalCreateUserDTO } from "../../application/dtos/request/create-user.dto";
import { InternalUpdateUserDTO } from "../../application/dtos/request/update-user.dto";
import { UserFilterDTO } from "../../application/dtos/request/user-filter.dto";
import { CreateUserResponseDTO } from "../../application/dtos/response/create-response.dto";
import { RetrieveAllUserResponseDTO, RetrieveUserResponseDTO } from "../../application/dtos/response/read-response.dto";
import { UpdateUserResponseDTO } from "../../application/dtos/response/update-response.dto";

export abstract class IUserRepository {
  abstract findAll(filters: UserFilterDTO): Promise<RetrieveAllUserResponseDTO | null>;
  abstract findById(id: string): Promise<RetrieveUserResponseDTO | null>;
  abstract create(data: InternalCreateUserDTO): Promise<CreateUserResponseDTO>;
  abstract update(
    id: string,
    data: InternalUpdateUserDTO,
  ): Promise<UpdateUserResponseDTO>;
  abstract remove(id: string): Promise<void>;
  abstract findByEmail(email: string): Promise<RetrieveUserResponseDTO | null>;
}
