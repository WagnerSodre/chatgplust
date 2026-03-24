import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';

@Component({
    selector: 'app-chat-input',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="input-container">
      <div class="input-wrapper glass-panel">
        <textarea
          #messageInput
          [(ngModel)]="messageText"
          (keydown.enter)="handleEnter($event)"
          (input)="adjustHeight()"
          placeholder="Message ChatGPlusT..."
          rows="1"
          class="chat-input"
          [disabled]="chatService.isTyping()"
        ></textarea>
        <button 
          class="send-btn" 
          [class.active]="messageText.trim().length > 0"
          [disabled]="messageText.trim().length === 0 || chatService.isTyping()"
          (click)="sendMessage()">
          <svg *ngIf="!chatService.isTyping()" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
          <div *ngIf="chatService.isTyping()" class="typing-indicator">
            <span></span><span></span><span></span>
          </div>
        </button>
      </div>
      <div class="footer-text">
        ChatGPlusT can make mistakes. Consider verifying important information.
      </div>
    </div>
  `,
    styleUrls: ['./chat-input.component.scss']
})
export class ChatInputComponent {
    messageText = '';
    chatService = inject(ChatService);

    @ViewChild('messageInput') inputElement!: ElementRef<HTMLTextAreaElement>;

    handleEnter(event: Event) {
        const keyboardEvent = event as KeyboardEvent;
        if (!keyboardEvent.shiftKey) {
            event.preventDefault();
            this.sendMessage();
        }
    }

    sendMessage() {
        if (this.messageText.trim() && !this.chatService.isTyping()) {
            this.chatService.sendMessage(this.messageText);
            this.messageText = '';

            // Reset height
            setTimeout(() => {
                if (this.inputElement) {
                    this.inputElement.nativeElement.style.height = 'auto';
                }
            }, 0);
        }
    }

    adjustHeight() {
        const el = this.inputElement.nativeElement;
        el.style.height = 'auto';
        el.style.height = Math.min(el.scrollHeight, 200) + 'px';
    }
}
