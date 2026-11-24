import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  Max,
  Min,
} from 'class-validator';

export class CreateLocationDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  vehicleId: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 6 })
  @Min(-90)
  @Max(90)
  latitude: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 6 })
  @Min(-180)
  @Max(180)
  longitude: number;
}
