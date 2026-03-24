import { TestBed } from '@angular/core/testing';
import { ThemeService, Theme } from './theme.service';

describe('ThemeService', () => {
    let service: ThemeService;

    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        // Reset data-theme attribute
        document.documentElement.removeAttribute('data-theme');

        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        service = TestBed.inject(ThemeService);
        expect(service).toBeTruthy();
    });

    it('should initialize with dark theme by default if no preference is set', () => {
        // Mocking window.matchMedia if needed but default is dark anyway in the constructor
        service = TestBed.inject(ThemeService);
        expect(service.theme()).toBe('dark');
    });

    it('should initialize with theme from localStorage if available', () => {
        localStorage.setItem('theme', 'light');
        service = TestBed.inject(ThemeService);
        expect(service.theme()).toBe('light');
    });

    it('should toggle theme from dark to light', () => {
        service = TestBed.inject(ThemeService);
        expect(service.theme()).toBe('dark');
        service.toggleTheme();
        expect(service.theme()).toBe('light');
    });

    it('should update DOM and localStorage when theme changes', () => {
        service = TestBed.inject(ThemeService);
        // Trigger effect flush
        TestBed.flushEffects();

        service.toggleTheme();
        TestBed.flushEffects();

        expect(localStorage.getItem('theme')).toBe('light');
        expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
});
