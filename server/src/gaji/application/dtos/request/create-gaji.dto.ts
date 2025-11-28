import { GajiStatus } from "@prisma/client";
import { IsDateString, IsEnum, IsNotEmptyObject, IsNumber, IsOptional, IsString } from "class-validator";
import { CreateKontrakDTO } from "src/kontrak/application/dtos/request/create-kontrak.dto";
import { CreateUserDTO } from "src/users/application/dtos/request/create-user.dto";

class ExtendedUser extends CreateUserDTO {
  @IsOptional()
  @IsString()
  id?: string;
}

class ExtendedKontrak extends CreateKontrakDTO {
  @IsOptional()
  @IsString()
  id?: string;
}

export class CreateGajiDTO {
    @IsNotEmptyObject()
    userData: ExtendedUser;

    @IsNotEmptyObject()
    kontrakData: ExtendedKontrak;

    @IsDateString()
    periode: string;

    @IsDateString()
    dueDate: string;

    @IsEnum(GajiStatus)
    status: GajiStatus;

    @IsNumber()
    amount: number;

    @IsOptional()
    @IsDateString()
    paymentDate?: string;
}