import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/DB/Models/user.model';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly _UserRepo: Repository<User>,
  ) {}

  async getUserProfileService(authUser) {
    const user = await this._UserRepo.findOne({ where: { id: authUser.id } });

    return user;
  }
}
