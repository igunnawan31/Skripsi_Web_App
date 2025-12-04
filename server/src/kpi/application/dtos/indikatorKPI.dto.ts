import { StatusIndikatorKPI } from "@prisma/client";
import { Expose } from "class-transformer";

export class IndikatorKPIBaseDTO {
  @Expose()
  id: string;

  @Expose()
  name:string;

  @Expose()
  description: string;

  @Expose()
  category: string;

  @Expose()
  startDate: string;

  @Expose()
  endDate: string;

  @Expose()
  statusPublic: boolean;

  @Expose()
  status: StatusIndikatorKPI;

  @Expose()
  createdById: string;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}

export class IndikatorKPIPivotBaseDTO { // dto untuk pivot table indikator kpi penilai dan dinilai, strukturnya sama jadi pakai dto yang sama
  @Expose()
  indikatorId: string;

  @Expose()
  userId: string;

  @Expose()
  createdAt: string;
}
