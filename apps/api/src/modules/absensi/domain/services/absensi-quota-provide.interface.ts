export interface IAbsensiQuotaProvider {
  getMonthlyAbsensiQuota(userId: string): Promise<number>;
}
