import { Type } from 'class-transformer';
import { IsInt, IsString, Length, Min } from 'class-validator';
import { ValidateWhenPresent } from '../../common/validators/validate-when-present.decorator';

export class CreateVehicleDto {
  @IsString()
  @Length(1, 20)
  plateNumber: string;

  @IsString()
  @Length(1, 50)
  vehicleType: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  capacity: number;

  @ValidateWhenPresent()
  @IsString()
  @Length(1, 20)
  status?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  routeId: number;
}
