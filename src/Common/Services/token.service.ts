import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  generateToken(payload, options?: JwtSignOptions): string {
    return this.jwtService.sign(payload, options);
  }

  verifyToken(token, options: JwtVerifyOptions) {
    return this.jwtService.verify(token, options);
  }
}
