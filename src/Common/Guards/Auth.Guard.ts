import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from '../Services/token.service';
import { Repository } from 'typeorm';
import { User } from 'src/DB/Models/user.model';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly _TokenService: TokenService,
    @InjectRepository(User) private readonly _UserRepository: Repository<User>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();

      const { authorization } = request.headers;

      if (!authorization)
        throw new UnauthorizedException('Authorization header missing');

      const decoded = this._TokenService.verifyToken(authorization, {
        secret: process.env.JWT_SECRET_KEY,
      });

      const user = await this._UserRepository.findOne({
        where: { id: decoded.id },
      });

      if (!user) throw new NotFoundException('User Not Found');

      request.authUser = user;

      return true;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
