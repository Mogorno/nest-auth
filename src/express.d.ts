// src/types/express.d.ts
import { User } from '@prisma/__generated__';
import './types/express';

declare module 'express-serve-static-core' {
	interface Request {
		user?: User;
	}
}
