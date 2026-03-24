import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ChatService } from './chat.service';

describe('ChatService', () => {
    let service: ChatService;

    beforeEach(() => {
        vi.useFakeTimers();
        TestBed.configureTestingModule({});
        service = TestBed.inject(ChatService);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should have initial chat data', () => {
        const chats = service.chats();
        expect(chats.length).toBe(1);
        expect(chats[0].messages.length).toBe(2);
    });

    it('should create a new chat', () => {
        service.createNewChat();
        const chats = service.chats();
        expect(chats.length).toBe(2);
        expect(chats[0].title).toBe('New Chat');
        expect(service.activeChatId()).toBe(chats[0].id);
    });

    it('should select a chat', () => {
        service.createNewChat();
        const newChatId = service.chats()[0].id;
        const oldChatId = service.chats()[1].id;

        // Switch to old
        service.selectChat(oldChatId);
        expect(service.activeChatId()).toBe(oldChatId);
    });

    it('should delete a chat', () => {
        const existingId = service.chats()[0].id;
        service.deleteChat(existingId);
        expect(service.chats().length).toBe(0);
        expect(service.activeChatId()).toBeNull();
    });

    it('should send a user message and trigger typing', () => {
        service.sendMessage('Hello, world!');
        const activeChat = service.activeChat();

        expect(activeChat).toBeTruthy();
        expect(activeChat!.messages.length).toBe(4);
        const userMsg = activeChat!.messages[2];
        expect(userMsg.role).toBe('user');
        expect(userMsg.content).toBe('Hello, world!');

        // AI starts typing
        expect(service.isTyping()).toBe(true);
        const aiMsg = activeChat!.messages[3];
        expect(aiMsg.role).toBe('assistant');

        // Simulate time passing to finish typing
        vi.advanceTimersByTime(5000); // 5 seconds should be enough for the simulated typing
        expect(service.isTyping()).toBe(false);
    });

    it('should ignore empty messages', () => {
        const originalLength = service.activeChat()?.messages.length;
        service.sendMessage('   ');
        expect(service.activeChat()?.messages.length).toBe(originalLength);
    });
});
