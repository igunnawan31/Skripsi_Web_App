import { UserRequest } from 'src/common/types/UserRequest.dto';
import { InternalCreateReimburseDTO } from 'src/reimburse/application/dtos/request/create.dto';
import { InternalReimburseFilterDTO } from 'src/reimburse/application/dtos/request/filter.dto';
import { InternalUpdateReimburseDTO } from 'src/reimburse/application/dtos/request/update.dto';
import { CreateReimburseResponseDTO } from 'src/reimburse/application/dtos/response/create.dto';
import {
  RetrieveAllReimburseResponseDTO,
  RetrieveReimburseResponseDTO,
} from 'src/reimburse/application/dtos/response/read.dto';
import { UpdateReimburseResponseDTO } from 'src/reimburse/application/dtos/response/update.dto';

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
