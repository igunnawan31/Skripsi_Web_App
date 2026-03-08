import { Expose } from "class-transformer";
import { NotificationBaseDTO } from "../base.dto";
import { UserBaseDTO } from "src/modules/users/application/dtos/base.dto";

export class RetrieveNotificationResponseDTO extends NotificationBaseDTO {
  @Expose()
  user: UserBaseDTO[];
}

export class RetrieveAllNotificationResponseDTO {

}
