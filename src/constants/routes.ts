import { CustomRouteConfig } from '@tager/admin-layout';

import ImportList from '../views/ImportList';
import ImportForm from '../views/ImportForm';

import { IMPORT_ROUTE_PATHS } from './paths';

export const IMPORT_LIST_ROUTE: CustomRouteConfig = {
  path: IMPORT_ROUTE_PATHS.IMPORT_LIST,
  component: ImportList,
  name: 'Import List',
  meta: {
    getBreadcrumbs: (route, t) => [
      { url: '/', text: t('import:home') },
      { url: route.path, text: t('import:importList') },
    ],
  },
};

export const IMPORT_FORM_ROUTE: CustomRouteConfig = {
  path: IMPORT_ROUTE_PATHS.IMPORT_FORM,
  component: ImportForm,
  name: 'Import Form',
  meta: {
    getBreadcrumbs: (route, t) => [
      { url: '/', text: t('import:home') },
      { url: IMPORT_LIST_ROUTE.path, text: t('import:importList') },
      { url: route.path, text: t('import:importForm') },
    ],
  },
};
