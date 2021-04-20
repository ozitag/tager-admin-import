import { compile } from 'path-to-regexp';

import { IMPORT_ROUTE_PATHS } from '../constants/paths';

export function getImportListUrl(): string {
  return IMPORT_ROUTE_PATHS.IMPORT_LIST;
}

export function getImportFormUrl(params: {
  importId: string | number;
}): string {
  return compile(IMPORT_ROUTE_PATHS.IMPORT_FORM)(params);
}
