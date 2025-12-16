import { useState, useCallback } from 'react';
import type { DateRange } from '../types/Range';
import RangeService from '../services/RangeService';
import GanttService from '../services/GanttService';

interface UseRangesReturn {
  ranges: DateRange[];
  addRange: (start: Date, end: Date) => void;
  removeRange: (id: string) => void;
  clearRanges: () => void;
  sortedRanges: DateRange[];
  dateRange: { min: Date; max: Date };
}

export const useRanges = (): UseRangesReturn => {
  const [ranges, setRanges] = useState<DateRange[]>([]);

  const rangeService = RangeService.getInstance();
  const ganttService = GanttService.getInstance();

  const addRange = useCallback(
    (start: Date, end: Date) => {
      const newRange: DateRange = {
        id: `${Date.now()}-${Math.random()}`,
        start,
        end,
        isReplaced: false,
      };

      try {
        const updatedRanges = rangeService.addRange(ranges, newRange);
        setRanges(updatedRanges);
      } catch (error) {
        throw error;
      }
    },
    [ranges, rangeService]
  );

  const removeRange = useCallback(
    (id: string) => {
      setRanges((prevRanges) => prevRanges.filter((range) => range.id !== id));
    },
    []
  );

  const clearRanges = useCallback(() => {
    setRanges([]);
  }, []);

  const sortedRanges = rangeService.sortRangesByStart(ranges);
  const dateRange = ganttService.getDateRange(ranges);

  return {
    ranges,
    addRange,
    removeRange,
    clearRanges,
    sortedRanges,
    dateRange,
  };
};
