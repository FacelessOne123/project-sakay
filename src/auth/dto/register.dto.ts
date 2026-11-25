import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../users/dto/create-user.dto';

// Public sign-up cannot choose a role; the server assigns Commuter.
export class RegisterDto extends OmitType(CreateUserDto, ['role'] as const) {}
