import { Optional } from "@nestjs/common";

export class EditDetailDto {
    @Optional()
    name: string
    @Optional()
    dateOfBirth: string
}