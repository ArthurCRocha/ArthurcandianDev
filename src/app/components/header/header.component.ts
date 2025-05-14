import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() isDarkMode = false;
  @Output() toggleTheme = new EventEmitter<void>();
  @Output() toggleLanguage = new EventEmitter<void>();
  
  constructor(public languageService: LanguageService) {}
}
