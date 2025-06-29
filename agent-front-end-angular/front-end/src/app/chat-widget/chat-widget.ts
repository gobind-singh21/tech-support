// src/app/chat-widget/chat-widget.component.ts
import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { MessageComponent, ChatMessage } from '../message/message';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule, MessageComponent],
  templateUrl: './chat-widget.html',
  styleUrl: './chat-widget.css', // <-- Updated from .scss
})
export class ChatWidgetComponent implements AfterViewChecked {
  // ... (The rest of the TypeScript code is exactly the same) ...
  // --- CONFIGURATION ---
  private readonly APP_NAME = 'it_support_agent';
  private readonly BASE_URL = 'http://localhost:8000';

  // --- COMPONENT STATE ---
  isOpen = false;
  isMaximized = false;
  isLoading = false;
  isTyping = false;
  error: string | null = null;
  messages: ChatMessage[] = [];
  inputValue = '';

  // --- SESSION STATE ---
  private userId = '';
  private sessionId = '';
  private isInitialized = false;

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor(private http: HttpClient) {}

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  handleOpenChat(): void {
    this.isOpen = true;
    if (!this.isInitialized) {
      this.initializeSession();
    }
  }

  toggleMaximize(): void {
    this.isMaximized = !this.isMaximized;
  }

  isFormDisabled(): boolean {
    return this.isLoading || this.isTyping || !!this.error;
  }

  private initializeSession(): void {
    this.isLoading = true;
    this.error = null;

    this.userId = crypto.randomUUID();
    this.sessionId = crypto.randomUUID();
    const url = `${this.BASE_URL}/apps/${this.APP_NAME}/users/${this.userId}/sessions/${this.sessionId}`;

    this.http.post(url, {})
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          this.isInitialized = true;
          this.messages = [{ sender: 'bot', text: 'Hello! How can I assist you today?' }];
        },
        error: (err) => {
          console.error('Initialization Error:', err);
          this.error = 'Could not connect. Please try again later.';
        },
      });
  }

  handleSendMessage(): void {
    const userMessageText = this.inputValue.trim();
    if (!userMessageText || this.isFormDisabled()) return;

    this.messages.push({ sender: 'user', text: userMessageText });
    this.inputValue = '';
    this.isTyping = true;

    const payload = {
      appName: this.APP_NAME,
      userId: this.userId,
      sessionId: this.sessionId,
      newMessage: { role: 'user', parts: [{ text: userMessageText }] },
    };

    this.http.post<any[]>(`${this.BASE_URL}/run`, payload)
      .pipe(finalize(() => this.isTyping = false))
      .subscribe({
        next: (responseData) => {
          const botReplyText = responseData
            .flatMap(item => item.content?.parts || [])
            .filter(part => part.text)
            .map(part => part.text)
            .join('');

          if (botReplyText) {
            this.messages.push({ sender: 'bot', text: botReplyText.trim() });
          } else {
            console.warn('Response contained no displayable text:', responseData);
          }
        },
        error: (err) => {
          console.error('Send Message Error:', err);
          this.messages.push({ sender: 'bot', text: `Sorry, an error occurred: ${err.message}` });
        },
      });
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
