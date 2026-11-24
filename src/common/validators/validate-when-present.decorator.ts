import { ValidateIf } from 'class-validator';

/**
 * Skip validation only when a property is absent. Unlike `@IsOptional`, an
 * explicit `null` still reaches the other validators and is rejected.
 */
export function ValidateWhenPresent(): PropertyDecorator {
  return ValidateIf((_object: object, value: unknown) => value !== undefined);
}
