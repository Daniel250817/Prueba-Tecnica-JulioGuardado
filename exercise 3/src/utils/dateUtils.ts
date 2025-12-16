export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}/${month}/${year}`;
}

export function parseDate(dateString: string): Date {
  const parts = dateString.split('/');
  if (parts.length !== 3) {
    throw new Error('Formato de fecha inválido. Use día/mes/año');
  }

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    throw new Error('Fecha inválida');
  }

  const date = new Date(year, month, day);
  
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    throw new Error('Fecha inválida');
  }

  return date;
}

export function dateToInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function inputValueToDate(inputValue: string): Date {
  const parts = inputValue.split('-');
  if (parts.length !== 3) {
    throw new Error('Formato de fecha inválido');
  }
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  return new Date(year, month, day);
}

export function daysBetween(start: Date, end: Date): number {
  const timeDiff = end.getTime() - start.getTime();
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
}

export function isValidDateRange(start: Date, end: Date): boolean {
  return start.getTime() <= end.getTime();
}
