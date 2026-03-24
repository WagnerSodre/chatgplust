import { Component, inject } from '@angular/core';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ChatWindowComponent } from './components/chat-window/chat-window.component';
import { ThemeService } from './services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, SidebarComponent, ChatWindowComponent],
    template: `
    <div class="app-layout">
      <!-- Mobile Overlay -->
      <div 
        class="mobile-overlay" 
        *ngIf="isSidebarOpen" 
        (click)="toggleSidebar()">
      </div>

      <!-- Sidebar -->
      <div class="sidebar-wrapper" [class.open]="isSidebarOpen">
        <app-sidebar></app-sidebar>
      </div>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Top bar for mobile toggle & theme toggle -->
        <div class="top-bar">
          <button class="menu-btn" (click)="toggleSidebar()">
            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          
          <div class="top-center">
            <span class="logo-text">ChatGPlusT</span>
          </div>

          <button class="theme-toggle-btn" (click)="themeService.toggleTheme()" title="Toggle Theme">
            @if (themeService.theme() === 'dark') {
              <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            } @else {
              <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            }
          </button>
        </div>

        <app-chat-window></app-chat-window>
      </main>
    </div>
  `,
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    themeService = inject(ThemeService);
    isSidebarOpen = false;

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }
}
