import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatInputComponent } from './chat-input.component';
import { ChatService } from '../../services/chat.service';
import { signal } from '@angular/core';
import { vi } from 'vitest';

describe('ChatInputComponent', () => {
    let component: ChatInputComponent;
    let fixture: ComponentFixture<ChatInputComponent>;
    let mockChatService: any;

    beforeEach(async () => {
        vi.useFakeTimers();
        mockChatService = {
            isTyping: signal(false),
            sendMessage: vi.fn()
        };

        await TestBed.configureTestingModule({
            imports: [ChatInputComponent],
            providers: [
                { provide: ChatService, useValue: mockChatService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ChatInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call sendMessage if text is entered and enter is pressed without shift', () => {
        component.messageText = 'Hello';
        const mockEvent = new KeyboardEvent('keydown', { key: 'Enter', shiftKey: false });
        vi.spyOn(mockEvent, 'preventDefault');

        component.handleEnter(mockEvent);

        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(mockChatService.sendMessage).toHaveBeenCalledWith('Hello');
    });

    it('should not call sendMessage on shift+enter', () => {
        component.messageText = 'Hello';
        const mockEvent = new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true });

        component.handleEnter(mockEvent);

        expect(mockChatService.sendMessage).not.toHaveBeenCalled();
    });

    it('should disable send button when isTyping is true', () => {
        mockChatService.isTyping.set(true);
        fixture.detectChanges();
        const btn = fixture.nativeElement.querySelector('.send-btn');
        expect(btn.disabled).toBe(true);
    });

    it('should clear input text after sending', () => {
        component.messageText = 'Test message';
        component.sendMessage();
        expect(mockChatService.sendMessage).toHaveBeenCalledWith('Test message');
        expect(component.messageText).toBe('');
        vi.advanceTimersByTime(0); // wait for setTimeout
        expect(component.inputElement.nativeElement.style.height).toBe('auto');
    });
});
