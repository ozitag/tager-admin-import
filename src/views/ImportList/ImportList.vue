<template>
  <Page
      :title="$i18n.t('import:import')"
      :header-buttons="[
      {
        text: $i18n.t('import:newImport'),
        href: getImportFormUrl({ importId: 'create' }),
      },
    ]"
  >
    <DataTable
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
      <template #cell(history)="{ row }">
        <CellHistory :history="row.history"/>
      </template>
    </DataTable>
  </Page>
</template>

<script lang="ts">
import {defineComponent, onMounted} from 'vue';

import {
  ColumnDefinition,
  useDataTable,
  DataTable
} from '@tager/admin-ui';

import {
  Page
} from '@tager/admin-layout';
import {useI18n} from "@tager/admin-services";

import {getImportList} from '../../services/requests';
import {ImportType} from '../../typings/model';
import {getImportFormUrl} from '../../utils/paths';

import {CellHistory} from './components/CellHistory';

export default defineComponent({
  name: 'ImportList',
  components: {CellHistory, DataTable, Page},
  setup() {
    const {t} = useI18n();

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
        style: {width: '50px', textAlign: 'center'},
        headStyle: {width: '50px', textAlign: 'center'},
      },
      {
        id: 2,
        name: t('import:type'),
        field: 'strategy',
        style: {width: '150px'},
        headStyle: {width: '150px'},
      },
      {
        id: 3,
        name: t('import:params'),
        field: 'params',
        type: 'key-value',
        format: ({row}) => row.params ? row.params.map((param) => {
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
        style: {width: '120px'},
        headStyle: {width: '120px'},
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
        style: {width: '270px', whiteSpace: 'nowrap'},
        headStyle: {width: '270px'},
      },
      {
        id: 7,
        name: t('import:file'),
        field: 'file',
        type: 'file',
        style: {width: '150px', textAlign: 'center'},
        headStyle: {width: '150px', textAlign: 'center'},
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
