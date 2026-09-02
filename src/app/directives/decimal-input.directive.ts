import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[appDecimalComma]',
  standalone: true
})
export class DecimalInputDirective {
  constructor(private readonly el: ElementRef<HTMLInputElement>) {}

  /**
   * Intercepts keydown to convert dot '.' key press to comma ','
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === '.') {
      event.preventDefault();
      const input = this.el.nativeElement;
      const start = input.selectionStart ?? input.value.length;
      const end = input.selectionEnd ?? input.value.length;

      // Avoid duplicate commas
      if (!input.value.includes(',')) {
        const newValue = input.value.substring(0, start) + ',' + input.value.substring(end);
        input.value = newValue;
        input.setSelectionRange(start + 1, start + 1);
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  }

  /**
   * Replaces any pasted or typed dot with comma
   */
  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = this.el.nativeElement;
    if (input.value.includes('.')) {
      const start = input.selectionStart;
      input.value = input.value.replace(/\./g, ',');
      if (start !== null) {
        input.setSelectionRange(start, start);
      }
    }
  }
}

/**
 * Utility helper to safely parse numbers supporting comma ',' or dot '.'
 */
export function parseDecimalInput(value: any): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  if (typeof value === 'number') {
    return isNaN(value) ? null : value;
  }
  const strVal = String(value).trim().replace(',', '.');
  const num = parseFloat(strVal);
  return isNaN(num) ? null : num;
}
