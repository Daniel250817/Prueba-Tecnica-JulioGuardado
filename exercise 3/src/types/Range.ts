export interface DateRange {
  id: string;
  start: Date;
  end: Date;
  isReplaced: boolean;
  replacedBy?: string;
}
