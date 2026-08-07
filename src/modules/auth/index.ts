import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { UserRepository } from '../../database/repository/user.repository';
import { OtpRepository } from '../../database/repository/otp.repository';
import { EmailService } from '../mail/email.service';
import { AuthSessionService } from '../auth-sessions/auth-session.service';
import { AuthSessionRepository } from '../../database/repository/auth-session.repository';

const userRepository = new UserRepository();
const otpRepository = new OtpRepository();
const emailService = new EmailService();
const authSessionService = new AuthSessionService(new AuthSessionRepository());

const authService = new AuthService(
  userRepository,
  otpRepository,
  emailService,
  authSessionService,
);

export const authController = new AuthController(authService);
