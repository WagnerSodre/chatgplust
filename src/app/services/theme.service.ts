import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'dark' | 'light';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    theme = signal<Theme>('dark');

    constructor() {
        // Check local storage or system preference
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            const savedTheme = localStorage.getItem('theme') as Theme;
            if (savedTheme === 'light' || savedTheme === 'dark') {
                this.theme.set(savedTheme);
            } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
                this.theme.set('light');
            }
            this.applyTheme(this.theme());
        }
    }

    private applyTheme(currentTheme: Theme) {
        if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('data-theme', currentTheme);
        }
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('theme', currentTheme);
        }
    }

    toggleTheme() {
        this.theme.update(t => t === 'dark' ? 'light' : 'dark');
        this.applyTheme(this.theme());
    }
}
