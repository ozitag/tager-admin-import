import type { RouteRecordRaw } from 'vue-router';

import ImportList from '../views/ImportList';
import ImportForm from '../views/ImportForm';

import { IMPORT_ROUTE_PATHS } from './paths';

export const IMPORT_LIST_ROUTE: RouteRecordRaw = {
  path: IMPORT_ROUTE_PATHS.IMPORT_LIST,
  component: ImportList,
  name: 'Import List',
  meta: {
    getBreadcrumbs: (route, i18n) => [
      { url: '/', text: i18n.t('import:home') },
      { url: route.path, text: i18n.t('import:importList') },
    ],
  },
};

export const IMPORT_FORM_ROUTE: RouteRecordRaw = {
  path: IMPORT_ROUTE_PATHS.IMPORT_FORM,
  component: ImportForm,
  name: 'Import Form',
  meta: {
    getBreadcrumbs: (route, i18n) => [
      { url: '/', text: i18n.t('import:home') },
      { url: IMPORT_LIST_ROUTE.path, text: i18n.t('import:importList') },
      { url: route.path, text: i18n.t('import:importForm') },
    ],
  },
};
