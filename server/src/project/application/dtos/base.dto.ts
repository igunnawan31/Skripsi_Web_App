import { ProjectRole, ProjectStatus } from "@prisma/client";
import { Expose } from "class-transformer";

export class ProjectBaseDTO {
  @Expose()
  id: string;
  
  @Expose()
  name: string;
  
  @Expose()
  description?: string;
  
  @Expose()
  startDate?: string;
  
  @Expose()
  endDate?:string;
  
  @Expose()
  status:ProjectStatus;
  
  @Expose()
  createdAt: string;
  
  @Expose()
  updatedAt: string;
}

export class ProjectTeamBaseDTO {
  @Expose()
  projectId: string;
  
  @Expose()
  userId: string;
  
  @Expose()
  role: ProjectRole;
}
