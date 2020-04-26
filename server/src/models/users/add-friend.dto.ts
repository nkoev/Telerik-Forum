import { IsNotEmpty, IsUUID } from 'class-validator';

export class AddFriendDTO {
  @IsNotEmpty()
  @IsUUID()
  public id: string;
}
