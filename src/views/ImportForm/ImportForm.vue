<template>
  <Page
      :title="$i18n.t('import:importCreation')"
      :is-content-loading="isContentLoading"
  >
    <form novalidate @submit.prevent>
      <FormFieldSelect
          v-model:value="values.strategy"
          :options="strategyOptionList"
          :error="errors.strategy"
          name="importType"
          :label="$i18n.t('import:importType')"
      />

      <FormFieldFileInput
          v-model:value="values.file"
          :error="errors.file"
          :label="$i18n.t('import:file')"
          name="file"
          :scenario="strategyFileScenario"
      />

      <DynamicField
          v-for="field of templateValues"
          :key="field.config.name"
          :field="field"
      />
    </form>

    <template #footer>
      <FormFooter
          :back-href="getImportListUrl()"
          @submit="submitForm"
          :is-submitting="isSubmitting"
          :is-creation="true"
      />
    </template>
  </Page>
</template>

<script lang="ts">
import {defineComponent, watch, computed, onMounted, ref} from 'vue';

import {convertRequestErrorToMap, navigateBack, useI18n, useResource, useToast} from '@tager/admin-services';
import {
  OptionType,
  TagerFormSubmitEvent,
  FormFooter,
  FormFieldFileInput, FormFieldSelect
} from '@tager/admin-ui';
import {
  DynamicField,
  FieldConfigUnion,
  FieldUnion,
  universalFieldUtils,
} from '@tager/admin-dynamic-field';

import {createImport, getModuleInfo} from '../../services/requests';
import {getImportListUrl} from '../../utils/paths';

import {
  convertImportFormValuesToCreationPayload,
  convertStrategiesToStrategyOptionList,
  FormValues,
} from './ImportForm.helpers';
import {useRouter} from "vue-router";
import {Page} from "@tager/admin-layout";

export default defineComponent({
  name: 'ImportForm',
  components: {Page, FormFieldFileInput, DynamicField, FormFooter, FormFieldSelect},
  setup() {
    const {t} = useI18n();

    const toast = useToast();
    const router = useRouter();

    /** Strategies */

    const [
      fetchModuleInfo,
      {data: moduleInfo, loading: isModuleInfoLoading},
    ] = useResource({
      fetchResource: getModuleInfo,
      initialValue: {
        fileScenario: '',
        strategies: [],
      },
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
    const values = ref<FormValues>({strategy: null, file: null});
    const isSubmitting = ref<boolean>(false);
    const templateValues = ref<Array<FieldUnion>>([]);

    function updateTemplateValues() {
      const selectedStrategy = moduleInfo.value.strategies.find(
          (strategy) => strategy.id === values.value.strategy?.value
      );

      const fieldTemplateList: Array<FieldConfigUnion> =
          selectedStrategy?.fields ?? [];

      templateValues.value = fieldTemplateList.map((fieldConfig) =>
          universalFieldUtils.createFormField(fieldConfig, null)
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
              navigateBack(router, getImportListUrl());
            }

            toast.show({
              variant: 'success',
              title: t('import:success'),
              body: t('import:createdSuccessMessage'),
            });
          })
          .catch((error) => {
            console.error(error);
            errors.value = convertRequestErrorToMap(error);
            toast.show({
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
