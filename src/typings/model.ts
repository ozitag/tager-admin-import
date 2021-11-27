import { FileType } from '@tager/admin-services';
import {
  FieldConfigUnion,
  FieldShortType,
  OutgoingValueUnion,
} from '@tager/admin-dynamic-field';

export interface HistoryType {
  readonly datetime: string;
  readonly status: string;
}

export interface ParamType {
  readonly label: string;
  readonly value: string;
}

export interface ImportType {
  readonly id: number;
  readonly strategy: string;
  readonly status: string;
  readonly message: string | null;
  readonly history: Array<HistoryType>;
  readonly params: Array<ParamType> | null;
  readonly file: FileType | null;
}

export interface StrategyType {
  readonly id: string;
  readonly name: string;
  readonly fields: Array<FieldConfigUnion>;
}

export interface ModuleInfoType {
  readonly fileScenario: string;
  readonly strategies: Array<StrategyType>;
}

export interface ImportCreatePayload {
  strategy: string;
  file: string;
  params: Array<FieldShortType<OutgoingValueUnion>>;
}
