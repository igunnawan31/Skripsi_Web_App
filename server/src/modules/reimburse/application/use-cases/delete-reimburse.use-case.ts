import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IReimburseRepository } from "../../domain/repositories/reimburse.repository.interface";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { deleteFileArray } from "src/common/utils/fileHelper";

@Injectable()
export class DeleteReimburseUseCase {
  constructor(
    @Inject(IReimburseRepository)
    private readonly reimburseRepo: IReimburseRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async execute(reimburseId: string) {
    const reimburse = await this.reimburseRepo.findById(reimburseId);

    if (!reimburse) {
      throw new NotFoundException('Data reimburse tidak ditemukan');
    }

    await deleteFileArray(reimburse.documents, 'Dokumen Reimburse')

    return this.reimburseRepo.remove(reimburseId);
  }
}
