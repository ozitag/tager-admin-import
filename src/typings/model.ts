import { FileType } from '@tager/admin-services';

interface HistoryType {
  readonly datetime: string;
  readonly status: string;
}

export interface ImportType {
  readonly id: number;
  readonly strategy: string;
  readonly status: string;
  readonly message: string | null;
  readonly history: Array<HistoryType>;
  readonly file: FileType | null;
}

export interface StrategyItemType {
  readonly id: string;
  readonly name: string;
}

export interface StrategyType {
  readonly fileScenario: string;
  readonly strategies: Array<StrategyItemType>;
}

export interface ImportCreatePayload {
  strategy: string;
  file: string;
}
