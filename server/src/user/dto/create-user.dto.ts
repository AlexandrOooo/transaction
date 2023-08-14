import { IsEmail } from 'class-validator';
import { arrayBuffer } from 'stream/consumers';

export class CreateUserDto {
  @IsEmail()
  email: string;

  password: string;
}
