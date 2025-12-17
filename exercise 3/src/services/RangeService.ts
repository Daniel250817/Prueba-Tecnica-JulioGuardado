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

    // Verificar si el nuevo rango es completamente contenido por algún rango existente
    // Si es así, no se agrega (el existente ya lo cubre)
    const isNewRangeContained = ranges.some((range) => 
      this.isRangeContained(range, newRange)
    );

    if (isNewRangeContained) {
      // El nuevo rango es más pequeño y está contenido en uno existente
      // No se agrega, se mantienen los rangos originales
      return this.sortRangesByStart(ranges);
    }

    // Filtrar los rangos existentes que son completamente contenidos por el nuevo rango
    // Estos son "comidos" (eliminados) por el algoritmo Comelón
    const filteredRanges = ranges.filter((range) => 
      !this.isRangeContained(newRange, range)
    );

    // Agregar el nuevo rango
    filteredRanges.push(newRange);

    return this.sortRangesByStart(filteredRanges);
  }
}

export default RangeService;
