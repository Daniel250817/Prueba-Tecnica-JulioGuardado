import type { DateRange } from '../types/Range';
import { daysBetween } from '../utils/dateUtils';

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
      const now = this.normalizeDate(new Date());
      return { min: now, max: now };
    }

    let min = this.normalizeDate(ranges[0].start);
    let max = this.normalizeDate(ranges[0].end);

    for (const range of ranges) {
      const normalizedStart = this.normalizeDate(range.start);
      const normalizedEnd = this.normalizeDate(range.end);
      
      if (normalizedStart.getTime() < min.getTime()) {
        min = normalizedStart;
      }
      if (normalizedEnd.getTime() > max.getTime()) {
        max = normalizedEnd;
      }
    }

    return { min, max };
  }

  private normalizeDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  public calculatePosition(
    date: Date,
    minDate: Date,
    maxDate: Date,
    width: number
  ): number {
    const normalizedDate = this.normalizeDate(date);
    const normalizedMin = this.normalizeDate(minDate);
    const normalizedMax = this.normalizeDate(maxDate);
    
    const totalDays = daysBetween(normalizedMin, normalizedMax) || 1;
    const daysFromStart = daysBetween(normalizedMin, normalizedDate);
    
    return (daysFromStart / totalDays) * width;
  }

  public calculateBarWidth(
    range: DateRange,
    minDate: Date,
    maxDate: Date,
    width: number
  ): number {
    const normalizedStart = this.normalizeDate(range.start);
    const normalizedEnd = this.normalizeDate(range.end);
    const normalizedMin = this.normalizeDate(minDate);
    const normalizedMax = this.normalizeDate(maxDate);
    
    const rangeDays = daysBetween(normalizedStart, normalizedEnd) + 1;
    const totalDays = daysBetween(normalizedMin, normalizedMax) || 1;
    
    const dayWidth = width / totalDays;
    const barWidth = rangeDays * dayWidth;
    
    return Math.max(4, barWidth);
  }

  public getYLevel(index: number, rowHeight: number): number {
    return index * rowHeight;
  }
}

export default GanttService;
