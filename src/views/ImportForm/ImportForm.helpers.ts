import { OptionType, SingleFileInputValueType } from '@tager/admin-ui';
import { FieldUnion, universalFieldUtils } from '@tager/admin-dynamic-field';

import { ImportCreatePayload, StrategyType } from '../../typings/model';

export type FormValues = {
  strategy: OptionType | null;
  file: SingleFileInputValueType | null;
};

export function convertImportFormValuesToCreationPayload(
  values: FormValues,
  templateValues: Array<FieldUnion>
): ImportCreatePayload {
  return {
    strategy: values.strategy?.value ?? '',
    file: values.file?.file.id ?? '',
    params: templateValues.map((field) => ({
      name: field.config.name,
      value: universalFieldUtils.getOutgoingValue(field),
    })),
  };
}

export function convertStrategiesToStrategyOptionList(
  strategies: Array<StrategyType>
): Array<OptionType> {
  return strategies.map((strategy) => ({
    value: strategy.id,
    label: strategy.name,
  }));
}
