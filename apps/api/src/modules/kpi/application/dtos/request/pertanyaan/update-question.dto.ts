import { PartialType } from "@nestjs/mapped-types";
import { CreatePertanyaanDTO } from "./create-question.dto";

export class UpdatePertanyaanDTO extends PartialType(CreatePertanyaanDTO) {
}
