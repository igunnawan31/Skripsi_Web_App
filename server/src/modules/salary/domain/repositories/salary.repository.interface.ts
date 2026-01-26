import { UserRequest } from "src/common/types/UserRequest.dto";
import { CreateSalaryDTO } from "../../application/dtos/request/create-salary.dto";
import { SalaryFilterDTO } from "../../application/dtos/request/salary-filter.dto";
import { InternalUpdateSalaryDTO } from "../../application/dtos/request/update-salary.dto";
import { CreateSalaryResponseDTO } from "../../application/dtos/response/create-response.dto";
import { RetrieveAllSalaryResponseDTO, RetrieveSalaryResponseDTO } from "../../application/dtos/response/read-response.dto";
import { UpdateSalaryResponseDTO } from "../../application/dtos/response/update-response.dto";

export abstract class ISalaryRepository {
  abstract findAll(filters: SalaryFilterDTO, user: UserRequest): Promise<RetrieveAllSalaryResponseDTO | null>;
  abstract findById(id: string): Promise<RetrieveSalaryResponseDTO | null>;
  abstract findByUserId(
    id: string,
    filters: SalaryFilterDTO,
  ): Promise<RetrieveAllSalaryResponseDTO | null>;
  abstract findByKontrakId(
    kontrakId: string,
  ): Promise<RetrieveSalaryResponseDTO[] | null>;
  abstract findByKontrakIdAndPeriode(
    kontrakId: string,
    periode: string,
  ): Promise<RetrieveSalaryResponseDTO | null>;
  abstract create(data: CreateSalaryDTO): Promise<CreateSalaryResponseDTO>;
  abstract update(
    id: string,
    data: InternalUpdateSalaryDTO,
  ): Promise<UpdateSalaryResponseDTO>;
  abstract paySalary(id: string): Promise<UpdateSalaryResponseDTO>;
  abstract remove(id: string): Promise<void>;
}
