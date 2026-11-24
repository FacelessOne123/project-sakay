import { Type } from 'class-transformer';
import { IsInt, IsString, Length, Min } from 'class-validator';
import { ValidateWhenPresent } from '../../common/validators/validate-when-present.decorator';

export class UpdateRouteDto {
  @ValidateWhenPresent()
  @IsString()
  @Length(1, 100)
  routeName?: string;

  @ValidateWhenPresent()
  @IsString()
  @Length(1, 150)
  origin?: string;

  @ValidateWhenPresent()
  @IsString()
  @Length(1, 150)
  destination?: string;

  @ValidateWhenPresent()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  estimatedTravelTime?: number;
}
