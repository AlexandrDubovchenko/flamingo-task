import { JwtPayload } from 'src/auth/auth.types';

export type RequestWithUser = Request & { user: JwtPayload };
