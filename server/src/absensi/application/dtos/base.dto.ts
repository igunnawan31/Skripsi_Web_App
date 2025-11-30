import { WorkStatus } from "@prisma/client";
import { Expose } from "class-transformer";

export class AbsensiBaseDTO {
  @Expose()
  userId: string;

  @Expose()
  date: string;

  @Expose()
  workStatus: WorkStatus;
  
  @Expose()
  checkIn: string;
  
  @Expose()
  checkOut: string;
  
  @Expose()
  notes?: string;
  
  @Expose()
  address?: string;
  
  @Expose()
  latitude?: string;
  
  @Expose()
  longitude?: string;
  
  @Expose()
  createdAt: string;
  
  @Expose()
  updatedAt: string;
}
