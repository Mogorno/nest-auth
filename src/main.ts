import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { createClient } from 'redis';
import * as session from 'express-session';
import { parseBoolean, parseStrArray, timeToMs } from './shared/utils';
import { RedisStore } from 'connect-redis';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const config = app.get(ConfigService);
	const redis = createClient({
		url: config.getOrThrow<string>('REDIS_URI'),
	});
	redis.connect().catch(console.error);

	app.use(cookieParser(config.getOrThrow<string>('COOKIE_SECRET')));

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
		}),
	);

	app.use(
		session({
			secret: config.getOrThrow<string>('SESSION_SECRET'),
			name: config.getOrThrow<string>('SESSION_NAME'),
			resave: true,
			saveUninitialized: false,
			cookie: {
				domain: config.getOrThrow<string>('SESSION_DOMAIN'),
				maxAge: timeToMs(config.getOrThrow<string>('SESSION_MAX_AGE')),
				httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
				secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
				sameSite: 'lax',
			},
			store: new RedisStore({
				client: redis,
				prefix: config.getOrThrow<string>('SESSION_FOLDER'),
			}),
		}),
	);

	app.enableCors({
		origin: parseStrArray(config.getOrThrow<string>('ALLOWED_ORIGINS')),
		credentials: true,
		exposedHeaders: ['Set-Cookie'],
	});

	await app.listen(config.getOrThrow<number>('APPLICATION_PORT'));
}
void bootstrap();
