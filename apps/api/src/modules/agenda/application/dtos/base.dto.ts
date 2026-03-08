import { AgendaFreq, AgendaStatus } from "@prisma/client";
import { Expose } from "class-transformer"

export class AgendaBaseDTO {
  @Expose()
  id: string;          

  @Expose()
  title: string;
  
  @Expose()
  eventDate: string;
  
  @Expose()
  projectId: string;
  
  @Expose()
  status: AgendaStatus;
  
  @Expose()
  frequency: AgendaFreq;

  @Expose()
  timezone: string;
  
  @Expose()
  createdAt: string;
  
  @Expose()
  updatedAt: string;
}

export class AgendaOccurrencesBaseDTO {
  @Expose()
  id: string;

  @Expose()
  agendaId: string;

  @Expose()
  date: string;

  @Expose()
  isCancelled: boolean;
}
