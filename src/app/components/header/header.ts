import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';

interface NavOption {
  title: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, SidebarModule, ButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  private readonly router = inject(Router);

  protected readonly isHomePage = signal<boolean>(true);
  protected readonly isMobileMenuOpen = signal<boolean>(false);

  protected readonly navOptions: NavOption[] = [
    {
      title: 'Compresibilidad Roca',
      path: '/rock-compressibility',
      icon: 'pi pi-database'
    },
    {
      title: 'PVT Petróleo',
      path: '/oil-pvt',
      icon: 'pi pi-filter'
    },
    {
      title: 'PVT Agua (Osif)',
      path: '/water-pvt',
      icon: 'pi pi-sun'
    },
    {
      title: 'Completación y Workover',
      path: '/completion-workover',
      icon: 'pi pi-cog'
    }
  ];

  constructor() {
    // Listen to route changes to toggle secondary navbar visibility
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isHomePage.set(event.urlAfterRedirects === '/' || event.urlAfterRedirects === '');
        this.isMobileMenuOpen.set(false);
      });
  }

  protected toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((open) => !open);
  }
}
