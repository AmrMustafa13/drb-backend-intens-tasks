import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RtStrategy } from './strategies/refreshToken.strategy';

@Module({
  imports: [JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get('JWT_ACCESS_SECRET'),
        signOptions: { expiresIn: cfg.get('JWT_ACCESS_EXPIRATION') || '15m' },
      }),
    }),],
  providers: [AuthService, JwtStrategy, RtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
