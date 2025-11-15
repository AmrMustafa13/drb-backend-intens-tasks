import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../Interfaces/JwtPayload';
import { Request } from 'express';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor(private config: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
			ignoreExpiration: false,
			secretOrKey: config.get<string>('JWT_REFRESH_SECRET')!,
			passReqToCallback: true,
		});
	}

	validate(req: Request, payload: JwtPayload) {
		const refreshToken = req.body.refreshToken as string;
		return {
			sub: payload.sub,
			email: payload.email,
			role: payload.role,
			refreshToken,
		};
	}
}
