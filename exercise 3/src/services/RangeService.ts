import type { DateRange } from '../types/Range';
import { isValidDateRange } from '../utils/dateUtils';

class RangeService {
  private static instance: RangeService;

  private constructor() {}

  public static getInstance(): RangeService {
    if (!RangeService.instance) {
      RangeService.instance = new RangeService();
    }
    return RangeService.instance;
  }

  public validateRange(start: Date, end: Date): boolean {
    return isValidDateRange(start, end);
  }

  public isRangeContained(container: DateRange, contained: DateRange): boolean {
    return (
      container.start.getTime() <= contained.start.getTime() &&
      container.end.getTime() >= contained.end.getTime()
    );
  }

  public sortRangesByStart(ranges: DateRange[]): DateRange[] {
    return [...ranges].sort((a, b) => a.start.getTime() - b.start.getTime());
  }

  public calculateDuration(range: DateRange): number {
    return range.end.getTime() - range.start.getTime();
  }

  public addRange(ranges: DateRange[], newRange: DateRange): DateRange[] {
    if (!this.validateRange(newRange.start, newRange.end)) {
      throw new Error('La fecha de inicio debe ser menor o igual a la fecha de fin');
    }

    const updatedRanges = ranges.map((range) => {
      if (this.isRangeContained(newRange, range)) {
        return {
          ...range,
          isReplaced: true,
          replacedBy: newRange.id,
        };
      }
      return range;
    });

    updatedRanges.push(newRange);

    return this.sortRangesByStart(updatedRanges);
  }
}

export default RangeService;
