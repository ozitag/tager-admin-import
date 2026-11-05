import { request, type ResponseBody } from '@tager/admin-services';

import {
  type ModuleInfoType,
  type ImportCreatePayload,
  type ImportType,
} from '../typings/model';

export function getImportList(params?: {
  pageNumber?: number;
  pageSize?: number;
}): Promise<ResponseBody<Array<ImportType>>> {
  return request.get({ path: '/admin/tager/import', params });
}

export function getModuleInfo(): Promise<ResponseBody<ModuleInfoType>> {
  return request.get({ path: '/admin/tager/import/info' });
}

export function createImport(
  payload: ImportCreatePayload
): Promise<ResponseBody<ImportType>> {
  return request.post({ path: '/admin/tager/import', body: payload });
}
