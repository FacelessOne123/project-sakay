import { Type } from 'class-transformer';
import { IsInt, IsString, Length, Min } from 'class-validator';
import { ValidateWhenPresent } from '../../common/validators/validate-when-present.decorator';

export class UpdateVehicleDto {
  @ValidateWhenPresent()
  @IsString()
  @Length(1, 20)
  plateNumber?: string;

  @ValidateWhenPresent()
  @IsString()
  @Length(1, 50)
  vehicleType?: string;

  @ValidateWhenPresent()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  capacity?: number;

  @ValidateWhenPresent()
  @IsString()
  @Length(1, 20)
  status?: string;

  @ValidateWhenPresent()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  routeId?: number;
}
