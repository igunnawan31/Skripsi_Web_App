import { Inject, Injectable } from "@nestjs/common";
import { IAbsensiQuotaProvider } from "src/absensi/domain/services/absensi-quota-provide.interface";
import { IKontrakRepository } from "src/kontrak/domain/repositories/kontrak.repository.interface";

@Injectable()
export class KontrakBasedAbsensiQuotaAdapter implements IAbsensiQuotaProvider {
  constructor(
    @Inject(IKontrakRepository)
    private readonly kontrakRepo: IKontrakRepository,
  ) {}

  async getMonthlyAbsensiQuota(userId: string): Promise<number> {
    return this.kontrakRepo.getTotalAbsensiQuota(userId);
  }
}
