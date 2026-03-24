import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ThemeService } from './services/theme.service';
import { ChatService } from './services/chat.service';
import { signal } from '@angular/core';
import { vi } from 'vitest';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockThemeService: any;
  let mockChatService: any;

  beforeEach(async () => {
    mockThemeService = {
      theme: signal('dark'),
      toggleTheme: vi.fn()
    };

    mockChatService = {
      // Mock any necessary ChatService methods/signals utilized by child components
      chats: signal([]),
      activeChatId: signal(null),
      currentMessages: signal([]),
      isTyping: signal(false)
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: ThemeService, useValue: mockThemeService },
        { provide: ChatService, useValue: mockChatService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial sidebar closed', () => {
    expect(component.isSidebarOpen).toBe(false);
  });

  it('should toggle sidebar', () => {
    component.toggleSidebar();
    expect(component.isSidebarOpen).toBe(true);
  });

  it('should toggle theme on button click', () => {
    const btn = fixture.nativeElement.querySelector('.theme-toggle-btn');
    btn.click();
    expect(mockThemeService.toggleTheme).toHaveBeenCalled();
  });

  it('should close sidebar when mobile overlay is clicked', () => {
    component.isSidebarOpen = true;
    fixture.detectChanges();

    const overlay = fixture.nativeElement.querySelector('.mobile-overlay');
    expect(overlay).toBeTruthy();

    overlay.click();
    expect(component.isSidebarOpen).toBe(false);
  });
});
