import { Type } from 'class-transformer';
import { IsInt, IsNumber, Max, Min } from 'class-validator';
import { ValidateWhenPresent } from '../../common/validators/validate-when-present.decorator';

export class UpdateLocationDto {
  @ValidateWhenPresent()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  vehicleId?: number;

  @ValidateWhenPresent()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 6 })
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ValidateWhenPresent()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 6 })
  @Min(-180)
  @Max(180)
  longitude?: number;
}
