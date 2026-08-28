import { Component, inject } from '@angular/core';
import { ThemeService, ThemeMode } from '../../services/theme.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class FooterComponent {
  protected readonly themeService = inject(ThemeService);
  protected readonly currentYear: number = 2026;

  protected setMode(mode: ThemeMode): void {
    this.themeService.setThemeMode(mode);
  }
}
