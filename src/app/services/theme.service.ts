import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkModeSubject.asObservable();

  constructor() { 
    // Initialize from localStorage or OS preference
    this.initTheme();
  }

  private initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    this.darkModeSubject.next(isDark);
    
    // Listen for OS theme preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem('theme')) {
        this.setDarkMode(e.matches);
      }
    });
  }

  setDarkMode(isDark: boolean) {
    this.darkModeSubject.next(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Dispatch custom event for Three.js components
    document.dispatchEvent(
      new CustomEvent('themeChanged', { detail: { isDarkMode: isDark } })
    );
  }

  toggleDarkMode() {
    this.setDarkMode(!this.darkModeSubject.value);
  }
}
