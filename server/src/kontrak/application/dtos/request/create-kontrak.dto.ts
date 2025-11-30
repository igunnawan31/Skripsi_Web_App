import { KontrakKerjaStatus, MetodePembayaran } from "@prisma/client";
import { IsDateString, IsEnum, IsNotEmptyObject, IsNumber, IsOptional, IsString } from "class-validator";
import { CreateProjectDTO } from "src/project/application/dtos/request/create-project.dto";
import { CreateUserDTO } from "src/users/application/dtos/request/create-user.dto";

class ExtendedUser extends CreateUserDTO {
  @IsOptional()
  @IsString()
  id?: string; // in case bikin user dulu baru bikin kontrak
}

class ExtendedProject extends CreateProjectDTO {
  @IsOptional()
  @IsString()
  id?: string; // in case bikin project dulu baru bikin kontrak
}

export class CreateKontrakDTO {
  @IsNotEmptyObject()
  userData: ExtendedUser;

  @IsNotEmptyObject()
  projectData: ExtendedProject;

  @IsEnum(MetodePembayaran)
  metodePembayaran: MetodePembayaran;
  
  @IsNumber()
  @IsOptional()
  dpPercentage?: number;

  @IsNumber()
  @IsOptional()
  finalPercentage?: number;

  @IsNumber()
  totalBayaran: number;

  @IsNumber()
  absensiBulanan: number;

  @IsNumber()
  cutiBulanan: number;

  @IsEnum(KontrakKerjaStatus)
  status: KontrakKerjaStatus;

  @IsString()
  @IsOptional()
  catatan?: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate: string;
}
