import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatWindowComponent } from './chat-window.component';
import { ChatService } from '../../services/chat.service';
import { signal } from '@angular/core';

describe('ChatWindowComponent', () => {
    let component: ChatWindowComponent;
    let fixture: ComponentFixture<ChatWindowComponent>;
    let mockChatService: any;

    beforeEach(async () => {
        mockChatService = {
            currentMessages: signal([]),
            isTyping: signal(false)
        };

        await TestBed.configureTestingModule({
            imports: [ChatWindowComponent],
            providers: [
                { provide: ChatService, useValue: mockChatService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ChatWindowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display empty state when no messages', () => {
        mockChatService.currentMessages.set([]);
        fixture.detectChanges();
        const emptyState = fixture.nativeElement.querySelector('.empty-state');
        expect(emptyState).toBeTruthy();
        expect(emptyState.textContent).toContain('How can I help you today?');
    });

    it('should display messages when available', () => {
        mockChatService.currentMessages.set([
            { id: '1', role: 'user', content: 'Hello there' },
            { id: '2', role: 'assistant', content: 'Hi! How can I help?' }
        ]);
        fixture.detectChanges();

        const messagesContainer = fixture.nativeElement.querySelector('.messages-container');
        expect(messagesContainer).toBeTruthy();

        const messages = fixture.nativeElement.querySelectorAll('.message-row');
        expect(messages.length).toBe(2);
        expect(messages[0].classList.contains('user')).toBe(true);
        expect(messages[1].classList.contains('assistant')).toBe(true);
    });
});
