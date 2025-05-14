import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Language = 'pt-BR' | 'en';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private languageSubject = new BehaviorSubject<Language>('pt-BR');
  language$ = this.languageSubject.asObservable();

  constructor() { 
    // Initialize from localStorage
    this.initLanguage();
  }

  private initLanguage() {
    const savedLang = localStorage.getItem('language') as Language || 'pt-BR';
    this.setLanguage(savedLang);
  }

  setLanguage(lang: Language) {
    this.languageSubject.next(lang);
    localStorage.setItem('language', lang);
    document.documentElement.setAttribute('lang', lang);
    
    // Update page title based on language
    document.title = lang === 'en' 
      ? "Arthur Candian Rocha - Portfolio" 
      : "Arthur Candian Rocha - Portfólio";
  }

  toggleLanguage() {
    const newLang = this.languageSubject.value === 'en' ? 'pt-BR' : 'en';
    this.setLanguage(newLang);
  }

  getCurrentLanguage(): Language {
    return this.languageSubject.value;
  }
}
