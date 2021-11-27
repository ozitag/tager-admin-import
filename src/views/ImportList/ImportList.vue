<template>
  <page
    :title="$t('import:import')"
    :header-buttons="[
      {
        text: $t('import:newImport'),
        href: getImportFormUrl({ importId: 'create' }),
      },
    ]"
  >
    <data-table
      :column-defs="columnDefs"
      :row-data="rowData"
      :loading="isRowDataLoading"
      :error-message="errorMessage"
      :pagination="{
        pageSize,
        pageCount,
        pageNumber,
        disabled: isRowDataLoading,
      }"
      :use-search="false"
      @change="handleChange"
    >
      <template v-slot:cell(history)="{ row }">
        <CellHistory :history="row.history" />
      </template>
    </data-table>
  </page>
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@vue/composition-api';

import {
  ColumnDefinition,
  useDataTable,
  useTranslation,
} from '@tager/admin-ui';

import { getImportList } from '../../services/requests';
import { ImportType } from '../../typings/model';
import { getImportFormUrl } from '../../utils/paths';

import { CellHistory } from './components/CellHistory';

export default defineComponent({
  name: 'ImportList',
  components: { CellHistory },
  setup(props, context) {
    const { t } = useTranslation(context);

    const {
      fetchEntityList: fetchImportList,
      isLoading: isImportListLoading,
      rowData: importList,
      errorMessage,
      searchQuery,
      handleChange,
      pageSize,
      pageCount,
      pageNumber,
    } = useDataTable<ImportType>({
      fetchEntityList: (params) =>
        getImportList({
          pageNumber: params.pageNumber,
          pageSize: params.pageSize,
        }),
      initialValue: [],
      context,
      resourceName: 'Import list',
      pageSize: 100,
    });

    onMounted(() => {
      fetchImportList();
    });

    const columnDefs: Array<ColumnDefinition<ImportType>> = [
      {
        id: 1,
        name: 'ID',
        field: 'id',
        style: { width: '50px', textAlign: 'center' },
        headStyle: { width: '50px', textAlign: 'center' },
      },
      {
        id: 2,
        name: t('import:type'),
        field: 'strategy',
        style: { width: '150px' },
        headStyle: { width: '150px' },
      },
      {
        id: 3,
        name: t('import:params'),
        field: 'params',
        type: 'key-value',
        format: ({ row }) => row.params ? row.params.map((param) => {
          return {
            key: param.label,
            value: param.value
          };
        }) : null
      },
      {
        id: 4,
        name: t('import:status'),
        field: 'status',
        style: { width: '120px' },
        headStyle: { width: '120px' },
      },
      {
        id: 5,
        name: t('import:message'),
        field: 'message',
      },

      {
        id: 6,
        name: t('import:log'),
        field: 'history',
        style: { width: '250px' },
        headStyle: { width: '250px' },
      },
      {
        id: 7,
        name: t('import:file'),
        field: 'file',
        type: 'file',
        style: { width: '150px', textAlign: 'center' },
        headStyle: { width: '150px', textAlign: 'center' },
      },
    ];

    return {
      columnDefs,
      getImportFormUrl,
      rowData: importList,
      isRowDataLoading: isImportListLoading,
      errorMessage: errorMessage,
      searchQuery,
      handleChange,
      pageSize,
      pageCount,
      pageNumber,
    };
  },
});
</script>
