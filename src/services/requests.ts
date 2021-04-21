import { request, ResponseBody } from '@tager/admin-services';

import {
  StrategyType,
  ImportCreatePayload,
  ImportType,
} from '../typings/model';

export function getImportList(params?: {
  pageNumber?: number;
  pageSize?: number;
}): Promise<ResponseBody<Array<ImportType>>> {
  return request.get({ path: '/admin/tager/import', params });
}

export function getStrategyList(): Promise<ResponseBody<StrategyType>> {
  return request.get({ path: '/admin/tager/import/info' });
}

export function createImport(
  payload: ImportCreatePayload
): Promise<ResponseBody<ImportType>> {
  return request.post({ path: '/admin/tager/import', body: payload });
}
