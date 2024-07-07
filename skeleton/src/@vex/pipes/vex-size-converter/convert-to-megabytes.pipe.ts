import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertToMegabytes',
  standalone: true // Ensure this is set
})
export class ConvertToMegabytesPipe implements PipeTransform {
  transform(value: number, ...args: unknown[]): string {
    if (value === null || value === undefined) return '';
    return (value / (1024 * 1024)).toFixed(2) + ' MB';
  }
}