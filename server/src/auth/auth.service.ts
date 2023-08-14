import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOne(email);
    const isPasswordVerify = await argon2.verify(user.password, password);
    if (user && isPasswordVerify) {
      return user;
    }
    throw new BadRequestException('incorrect password');
  }
  async login(user: any) {
    const { email, id } = user;
    return {
      email,
      id,
      token: this.jwtService.sign({ id, email }),
    };
  }
}
