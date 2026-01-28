import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/DB/Models/user.model';
import { Repository } from 'typeorm';
import { CreateUserDTO, LoginUserDTO } from '../DTO/auth.dto';
import { TokenService } from 'src/Common/Services/token.service';
import { Compare, Hash } from 'src/Common/Security/hash.security';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly _UserRepo: Repository<User>,
    private readonly _TokenService: TokenService,
  ) {}

  async RegisterService(body: CreateUserDTO) {
    const { email, password, name, phone, address } = body;

    const user = await this._UserRepo.findOne({
      where: [{ email }, { phone }],
    });

    if (user) throw new ConflictException('Email or phone already exists');

    const hashedPassword = Hash(password, Number(process.env.SALT_ROUND));

    const newUser = this._UserRepo.create({
      email,
      password: hashedPassword,
      name,
      phone,
      address,
    });

    return await this._UserRepo.save(newUser);
  }

  async loginService(body: LoginUserDTO) {
    const { email, password } = body;

    const user = await this._UserRepo.findOne({ where: { email } });

    if (!user || !Compare(password, user.password))
      throw new NotFoundException('In-Valid email or password');

    return this._TokenService.generateToken(
      { email: user.email, id: user.id, role: user.role },
      {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: Number(process.env.TOKEN_EXPIRE_TIME) || '1d',
      },
    );
  }
}
