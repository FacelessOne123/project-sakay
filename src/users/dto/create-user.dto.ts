import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ValidateWhenPresent } from '../../common/validators/validate-when-present.decorator';

export const USER_ROLES = ['Admin', 'Dispatcher', 'Passenger'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export class CreateUserDto {
  @IsString()
  @Length(1, 100)
  fullName: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;

  @ValidateWhenPresent()
  @IsIn(USER_ROLES)
  role?: UserRole;

  @ValidateWhenPresent()
  @IsString()
  @Length(7, 20)
  @Matches(/^[+0-9()\-\s]+$/, {
    message: 'phoneNumber may only contain digits, spaces, +, -, and parentheses',
  })
  phoneNumber?: string;
}
