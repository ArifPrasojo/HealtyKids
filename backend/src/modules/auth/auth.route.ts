import { Hono } from 'hono';
import * as controller from '@/modules/auth/auth.controller';

const authRoute = new Hono();
authRoute.post('/login', controller.login);
export { authRoute };
