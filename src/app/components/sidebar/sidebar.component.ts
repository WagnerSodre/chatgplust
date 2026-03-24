import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chat.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="sidebar-container">
      <div class="sidebar-header">
        <button class="new-chat-btn" (click)="chatService.createNewChat()">
          <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span class="truncate">New chat</span>
        </button>
      </div>

      <div class="sidebar-body">
        <div class="history-section">
          <span class="section-title">Recent Chats</span>
          
          @for (chat of chatService.chats(); track chat.id) {
            <button 
              class="chat-item" 
              [class.active]="chat.id === chatService.activeChatId()"
              (click)="chatService.selectChat(chat.id)">
              <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <div class="chat-title">{{ chat.title }}</div>
              
              <div class="delete-btn" (click)="deleteChat($event, chat.id)" title="Delete chat">
                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                   <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </div>
            </button>
          } @empty {
            <div class="empty-history">No chats yet</div>
          }
        </div>
      </div>

      <div class="sidebar-footer border-t">
        <button class="user-profile">
          <div class="avatar">W</div>
          <span class="user-name">Wagner</span>
        </button>
      </div>
    </div>
  `,
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
    chatService = inject(ChatService);

    deleteChat(event: Event, id: string) {
        event.stopPropagation();
        this.chatService.deleteChat(id);
    }
}
