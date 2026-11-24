import { QueryFailedError } from 'typeorm';

interface DriverError {
  code?: string;
  errno?: number;
}

function getDriverError(error: unknown): DriverError | undefined {
  if (!(error instanceof QueryFailedError)) {
    return undefined;
  }

  return (error as QueryFailedError & { driverError?: DriverError }).driverError;
}

/** Duplicate value for a unique column/index (MySQL error 1062). */
export function isDuplicateEntry(error: unknown): boolean {
  const driverError = getDriverError(error);
  return driverError?.code === 'ER_DUP_ENTRY' || driverError?.errno === 1062;
}

/** Delete rejected because other rows still reference the row (MySQL error 1451). */
export function isRowReferencedError(error: unknown): boolean {
  const driverError = getDriverError(error);
  return (
    driverError?.code === 'ER_ROW_IS_REFERENCED_2' ||
    driverError?.errno === 1451
  );
}

/** Insert/update references a row that does not exist (MySQL error 1452). */
export function isMissingReferencedRowError(error: unknown): boolean {
  const driverError = getDriverError(error);
  return (
    driverError?.code === 'ER_NO_REFERENCED_ROW_2' ||
    driverError?.errno === 1452
  );
}
