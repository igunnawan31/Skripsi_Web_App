import { UserRequest } from 'src/common/types/UserRequest.dto';
import { InternalReimburseFilterDTO } from '../../application/dtos/request/filter.dto';
import { RetrieveAllReimburseResponseDTO, RetrieveReimburseResponseDTO } from '../../application/dtos/response/read.dto';
import { CreateReimburseResponseDTO } from '../../application/dtos/response/create.dto';
import { InternalCreateReimburseDTO } from '../../application/dtos/request/create.dto';
import { UpdateReimburseResponseDTO } from '../../application/dtos/response/update.dto';
import { InternalUpdateReimburseDTO } from '../../application/dtos/request/update.dto';

export abstract class IReimburseRepository {
  abstract findAll(
    filters: InternalReimburseFilterDTO,
    user: UserRequest,
  ): Promise<RetrieveAllReimburseResponseDTO | null>;
  abstract findById(id: string): Promise<RetrieveReimburseResponseDTO | null>;
  abstract create(
    dto: InternalCreateReimburseDTO,
  ): Promise<CreateReimburseResponseDTO>;
  abstract update(
    id: string,
    dto: InternalUpdateReimburseDTO,
  ): Promise<UpdateReimburseResponseDTO>;
  abstract remove(id: string): Promise<void>;
}
