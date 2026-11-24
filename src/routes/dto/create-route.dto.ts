import { Type } from 'class-transformer';
import { IsInt, IsString, Length, Min } from 'class-validator';

export class CreateRouteDto {
  @IsString()
  @Length(1, 100)
  routeName: string;

  @IsString()
  @Length(1, 150)
  origin: string;

  @IsString()
  @Length(1, 150)
  destination: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  estimatedTravelTime: number;
}
