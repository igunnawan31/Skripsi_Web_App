import { Expose } from 'class-transformer';
import { UserBaseDTO } from 'src/users/application/dtos/base.dto';
import { KontrakBaseDTO } from 'src/kontrak/application/dtos/base.dto';
import { GajiBaseDTO } from 'src/gaji/application/dtos/base.dto';
import { meta } from 'src/common/types/QueryMeta.dto';

export class RetrieveGajiResponseDTO extends GajiBaseDTO {
    @Expose()
    user: UserBaseDTO;

    @Expose()
    kontrak: KontrakBaseDTO;
}

export class RetrieveAllGajiResponseDTO {
    @Expose()
    data: RetrieveGajiResponseDTO[];

    @Expose()
    meta: meta;
}

export class RetrieveGajiUserResponseDTO {
    @Expose()
    user: UserBaseDTO;
    
    @Expose()
    gaji: RetrieveGajiResponseDTO[];

    @Expose()
    meta: meta;
}