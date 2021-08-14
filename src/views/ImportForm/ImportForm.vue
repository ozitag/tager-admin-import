<template>
  <page
    :title="$t('import:importCreation')"
    :is-content-loading="isContentLoading"
  >
    <form novalidate @submit.prevent>
      <template>
        <form-field-select
          v-model="values.strategy"
          :options="strategyOptionList"
          :error="errors.strategy"
          name="importType"
          :label="$t('import:importType')"
        />

        <form-field-file-input
          v-model="values.file"
          :error="errors.file"
          :label="$t('import:file')"
          name="file"
          :scenario="strategyFileScenario"
        />
      </template>

      <DynamicField
        v-for="field of templateValues"
        :key="field.config.name"
        :field="field"
      />
    </form>

    <template v-slot:footer>
      <FormFooter
        :back-href="getImportListUrl()"
        :on-submit="submitForm"
        :is-submitting="isSubmitting"
        :is-creation="true"
      />
    </template>
  </page>
</template>

<script lang="ts">
import { defineComponent, watch } from '@vue/composition-api';
import { computed, onMounted, ref } from '@vue/composition-api';

import { convertRequestErrorToMap, useResource } from '@tager/admin-services';
import {
  OptionType,
  TagerFormSubmitEvent,
  FormFooter,
  useTranslation,
} from '@tager/admin-ui';
import {
  DynamicField,
  FieldConfigUnion,
  FieldUnion,
  universalFieldUtils,
} from '@tager/admin-dynamic-field';

import { createImport, getModuleInfo } from '../../services/requests';
import { getImportListUrl } from '../../utils/paths';

import {
  convertImportFormValuesToCreationPayload,
  convertStrategiesToStrategyOptionList,
  FormValues,
} from './ImportForm.helpers';

export default defineComponent({
  name: 'ImportForm',
  components: { DynamicField, FormFooter },
  setup(props, context) {
    const { t } = useTranslation(context);

    /** Strategies */

    const [
      fetchModuleInfo,
      { data: moduleInfo, loading: isModuleInfoLoading },
    ] = useResource({
      fetchResource: getModuleInfo,
      initialValue: {
        fileScenario: '',
        strategies: [],
      },
      context,
      resourceName: 'Module info',
    });

    const strategyFileScenario = computed<string>(
      () => moduleInfo.value.fileScenario
    );

    const strategyOptionList = computed<Array<OptionType>>(() =>
      convertStrategiesToStrategyOptionList(moduleInfo.value.strategies)
    );

    onMounted(() => {
      fetchModuleInfo();
    });

    /** Form state */

    const errors = ref<Record<string, string>>({});
    const values = ref<FormValues>({ strategy: null, file: null });
    const isSubmitting = ref<boolean>(false);
    const templateValues = ref<Array<FieldUnion>>([]);

    function updateTemplateValues() {
      const selectedStrategy = moduleInfo.value.strategies.find(
        (strategy) => strategy.id === values.value.strategy?.value
      );

      const fieldTemplateList: Array<FieldConfigUnion> =
        selectedStrategy?.fields ?? [];

      templateValues.value = fieldTemplateList.map((fieldConfig) =>
        universalFieldUtils.createFormField(fieldConfig)
      );
    }

    watch(
      () => values.value.strategy,
      () => {
        updateTemplateValues();
      }
    );

    onMounted(() => {
      updateTemplateValues();
    });

    function submitForm(event: TagerFormSubmitEvent) {
      isSubmitting.value = true;

      const creationPayload = convertImportFormValuesToCreationPayload(
        values.value,
        templateValues.value
      );

      createImport(creationPayload)
        .then(() => {
          errors.value = {};

          if (
            event.type === 'create' ||
            event.type === 'save' ||
            event.type === 'create_exit' ||
            event.type === 'save_exit'
          ) {
            context.root.$router.push(getImportListUrl());
          }

          context.root.$toast({
            variant: 'success',
            title: t('import:success'),
            body: t('import:createdSuccessMessage'),
          });
        })
        .catch((error) => {
          console.error(error);
          errors.value = convertRequestErrorToMap(error);
          context.root.$toast({
            variant: 'danger',
            title: t('import:error'),
            body: t('import:createdErrorMessage'),
          });
        })
        .finally(() => {
          isSubmitting.value = false;
        });
    }

    /** Is content loading **/

    const isContentLoading = computed<boolean>(() => isModuleInfoLoading.value);

    return {
      values,
      errors,
      isSubmitting,
      submitForm,
      getImportListUrl,
      strategyOptionList,
      strategyFileScenario,
      isContentLoading,
      templateValues,
    };
  },
});
</script>

<style lang="scss" scoped></style>
