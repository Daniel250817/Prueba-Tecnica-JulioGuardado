import type { DateRange } from '../types/Range';

class GanttService {
  private static instance: GanttService;

  private constructor() {}

  public static getInstance(): GanttService {
    if (!GanttService.instance) {
      GanttService.instance = new GanttService();
    }
    return GanttService.instance;
  }

  public getDateRange(ranges: DateRange[]): { min: Date; max: Date } {
    if (ranges.length === 0) {
      const now = new Date();
      return { min: now, max: now };
    }

    let min = ranges[0].start;
    let max = ranges[0].end;

    for (const range of ranges) {
      if (range.start.getTime() < min.getTime()) {
        min = range.start;
      }
      if (range.end.getTime() > max.getTime()) {
        max = range.end;
      }
    }

    return { min, max };
  }

  public calculatePosition(
    date: Date,
    minDate: Date,
    maxDate: Date,
    width: number
  ): number {
    const totalTime = maxDate.getTime() - minDate.getTime();
    if (totalTime === 0) return 0;

    const dateTime = date.getTime() - minDate.getTime();
    return (dateTime / totalTime) * width;
  }

  public calculateBarWidth(
    range: DateRange,
    minDate: Date,
    maxDate: Date,
    width: number
  ): number {
    const totalTime = maxDate.getTime() - minDate.getTime();
    if (totalTime === 0) return 0;

    const rangeTime = range.end.getTime() - range.start.getTime();
    return (rangeTime / totalTime) * width;
  }

  public getYLevel(index: number, rowHeight: number): number {
    return index * rowHeight;
  }
}

export default GanttService;
