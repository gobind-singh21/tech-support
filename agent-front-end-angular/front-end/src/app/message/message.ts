// src/app/message/message.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, MarkdownModule],
  templateUrl: './message.html',
  styleUrl: './message.css', // <-- Updated from .scss
})
export class MessageComponent {
  @Input() message!: ChatMessage;
}
