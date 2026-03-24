import { Component, ElementRef, ViewChild, ViewChildren, QueryList, AfterViewChecked, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chat.service';
import { ChatInputComponent } from '../chat-input/chat-input.component';

@Component({
    selector: 'app-chat-window',
    standalone: true,
    imports: [CommonModule, ChatInputComponent],
    template: `
    <div class="chat-window-container">
      <div class="chat-scroll-area" #scrollArea>
        @if (chatService.currentMessages().length === 0) {
          <div class="empty-state">
            <div class="logo-wrapper">
              <svg viewBox="0 0 24 24" class="logo-icon" fill="currentColor">
                <path d="M22.28 11.23a2.38 2.38 0 0 0 .54-1.57 2.38 2.38 0 0 0-1.55-2.22l-.24-.1-1.63-.6..."></path>
                <!-- Simplified logo for layout -->
                <circle cx="12" cy="12" r="8"></circle>
              </svg>
            </div>
            <h1>How can I help you today?</h1>
          </div>
        } @else {
          <div class="messages-container">
            @for (msg of chatService.currentMessages(); track msg.id) {
              <div class="message-row" [class.user]="msg.role === 'user'" [class.assistant]="msg.role === 'assistant'" #messageElements>
                <div class="message-content-wrapper">
                  <div class="avatar" [class.user-avatar]="msg.role === 'user'" [class.ai-avatar]="msg.role === 'assistant'">
                    {{ msg.role === 'user' ? 'W' : 'AI' }}
                  </div>
                  <div class="message-bubble">
                    <div class="message-text">
                      <!-- Basic markdown support simulation -->
                      {{ msg.content }}
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
      
      <div class="input-area">
        <app-chat-input></app-chat-input>
      </div>
    </div>
  `,
    styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements AfterViewChecked {
    chatService = inject(ChatService);

    @ViewChild('scrollArea') private scrollContainer!: ElementRef;
    @ViewChildren('messageElements') private messageElements!: QueryList<any>;

    private autoScroll = true;

    ngAfterViewChecked() {
        if (this.autoScroll) {
            this.scrollToBottom();
        }
    }

    private scrollToBottom(): void {
        try {
            this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }
}
