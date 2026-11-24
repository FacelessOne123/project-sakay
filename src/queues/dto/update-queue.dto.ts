import { Type } from 'class-transformer';
import { IsInt, IsString, Length, Min } from 'class-validator';
import { ValidateWhenPresent } from '../../common/validators/validate-when-present.decorator';

export class UpdateQueueDto {
  @ValidateWhenPresent()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  userId?: number;

  @ValidateWhenPresent()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  routeId?: number;

  @ValidateWhenPresent()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  queueNumber?: number;

  @ValidateWhenPresent()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  estimatedWaitTime?: number;

  @ValidateWhenPresent()
  @IsString()
  @Length(1, 20)
  status?: string;
}
