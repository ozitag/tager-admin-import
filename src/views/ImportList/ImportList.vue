<template>
  <page
    :title="t('import:import')"
    :header-buttons="[
      {
        text: t('import:newImport'),
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
        <ul v-if="row.history">
          <li v-for="(history, index) of row.history" :key="index">
            <span :style="{ width: '100px', display: 'inline-block' }">{{
              history.status
            }}</span>
            {{ dateTimeFormat(history.datetime) }}
          </li>
        </ul>
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

export default defineComponent({
  name: 'ImportList',
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
        style: { width: '15%' },
        headStyle: { width: '15%' },
      },
      {
        id: 3,
        name: t('import:status'),
        field: 'status',
        style: { width: '15%' },
        headStyle: { width: '15%' },
      },
      {
        id: 4,
        name: t('import:message'),
        field: 'message',
      },

      {
        id: 5,
        name: t('import:log'),
        field: 'history',
        style: { width: '25%' },
        headStyle: { width: '25%' },
      },
      {
        id: 6,
        name: t('import:file'),
        field: 'file',
        type: 'file',
        style: { width: '150px', textAlign: 'center' },
        headStyle: { width: '150px', textAlign: 'center' },
      },
    ];

    function dateTimeFormat(value: number | string | Date): string {
      const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      };
      const date = new Date(value);
      return new Intl.DateTimeFormat('ru-RU', options).format(date);
    }

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
      t,
      dateTimeFormat,
    };
  },
});
</script>
