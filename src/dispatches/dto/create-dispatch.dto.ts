import { Type } from 'class-transformer';
import { IsInt, IsString, Length, Min } from 'class-validator';
import { ValidateWhenPresent } from '../../common/validators/validate-when-present.decorator';

export class CreateDispatchDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  queueId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  vehicleId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  dispatcherId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  passengerCount: number;

  @ValidateWhenPresent()
  @IsString()
  @Length(1, 20)
  status?: string;
}
