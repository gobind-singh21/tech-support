// src/app/app.component.ts
import { Component } from '@angular/core';
import { ChatWidgetComponent } from './chat-widget/chat-widget';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChatWidgetComponent],
  templateUrl: './app.html',
  styleUrl: './app.css', // <-- Updated from .scss
})
export class App {
  title = 'sbi-chat-agent';
}
