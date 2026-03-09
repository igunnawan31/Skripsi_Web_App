import { MajorRole, MinorRole } from 'src/generated/prisma/enums';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { FilterDTO } from 'src/common/types/Filter.dto';

export class UserFilterDTO extends FilterDTO {
  @IsOptional()
  @IsEnum(MajorRole)
  majorRole?: MajorRole;

  @IsOptional()
  @IsEnum(MinorRole)
  minorRole?: MinorRole;
}
