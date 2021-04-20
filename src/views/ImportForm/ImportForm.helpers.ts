import { OptionType, SingleFileInputValueType } from '@tager/admin-ui';

import { ImportCreatePayload } from '../../typings/model';

export type FormValues = {
  strategy: OptionType | null;
  file: SingleFileInputValueType | null;
};

export function convertImportFormValuesToCreationPayload(
  values: FormValues
): ImportCreatePayload {
  return {
    strategy: values.strategy?.value ?? '',
    file: values.file?.file.id ?? '',
  };
}
