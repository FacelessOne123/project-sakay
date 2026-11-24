import { Type } from 'class-transformer';
import { IsInt, IsString, Length, Min } from 'class-validator';
import { ValidateWhenPresent } from '../../common/validators/validate-when-present.decorator';

export class UpdateDispatchDto {
  @ValidateWhenPresent()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  queueId?: number;

  @ValidateWhenPresent()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  vehicleId?: number;

  @ValidateWhenPresent()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  dispatcherId?: number;

  @ValidateWhenPresent()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  passengerCount?: number;

  @ValidateWhenPresent()
  @IsString()
  @Length(1, 20)
  status?: string;
}
