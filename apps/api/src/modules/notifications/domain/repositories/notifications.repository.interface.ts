import { CreateNotificationDTO } from "../../application/dtos/request/create-notifications.dto";
import { CreateNotificationResponseDTO } from "../../application/dtos/response/create-response.dto";
import { RetrieveNotificationResponseDTO } from "../../application/dtos/response/read-response.dto";

export abstract class INotificationRepository {
  abstract findAll(userId: string): Promise< RetrieveNotificationResponseDTO[] | null>;
  abstract findById(id: string): Promise<RetrieveNotificationResponseDTO | null>
  abstract create(data: CreateNotificationDTO): Promise<CreateNotificationResponseDTO>;
  abstract remove(id: string): Promise<void>;
}
