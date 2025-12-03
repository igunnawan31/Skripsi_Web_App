import { CreateGajiDTO } from 'src/gaji/application/dtos/request/create-gaji.dto';
import { GajiFilterDTO } from 'src/gaji/application/dtos/request/gaji-filter.dto';
import { UpdateGajiDTO } from 'src/gaji/application/dtos/request/update-gaji.dto';
import { CreateGajiResponseDTO } from 'src/gaji/application/dtos/response/create-response.dto';
import { DeleteGajiResponseDTO } from 'src/gaji/application/dtos/response/delete-response.dto';
import {
  RetrieveAllGajiResponseDTO,
  RetrieveGajiResponseDTO,
} from 'src/gaji/application/dtos/response/read-response.dto';
import { UpdateGajiResponseDTO } from 'src/gaji/application/dtos/response/update-response.dto';

export abstract class IGajiRepository {
  abstract findAll(filters: GajiFilterDTO): Promise<RetrieveAllGajiResponseDTO>;
  abstract findById(id: string): Promise<RetrieveGajiResponseDTO>;
  abstract findByUserId(
    id: string,
    filters: GajiFilterDTO,
  ): Promise<RetrieveAllGajiResponseDTO>;
  abstract findByKontrakId(
    kontrakId: string,
  ): Promise<RetrieveGajiResponseDTO[]>;
  abstract findByKontrakIdAndPeriode(
    kontrakId: string,
    periode: string,
  ): Promise<RetrieveGajiResponseDTO | null>;
  abstract create(data: CreateGajiDTO): Promise<CreateGajiResponseDTO>;
  abstract update(
    id: string,
    data: UpdateGajiDTO,
  ): Promise<UpdateGajiResponseDTO>;
  abstract paySalary(id: string): Promise<UpdateGajiResponseDTO>;
  abstract remove(id: string): Promise<DeleteGajiResponseDTO>;
}
