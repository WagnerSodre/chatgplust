import { Injectable, signal, computed } from '@angular/core';
import { Chat, Message } from '../models/chat.model';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    // All chats history
    chats = signal<Chat[]>([
        {
            id: '1',
            title: 'Explain Quantum Computing',
            updatedAt: new Date(Date.now() - 1000 * 60 * 60),
            messages: [
                { id: 'm1', role: 'user', content: 'Explain quantum computing in simple terms.', timestamp: new Date(Date.now() - 1000 * 60 * 60) },
                { id: 'm2', role: 'assistant', content: 'Quantum computing is a rapidly-emerging technology that harnesses the laws of quantum mechanics to solve problems too complex for classical computers. Would you like to know more?', timestamp: new Date(Date.now() - 1000 * 60 * 59) }
            ]
        }
    ]);

    // ID of the currently active chat
    activeChatId = signal<string | null>('1');

    // Computed signal for the active chat object
    activeChat = computed(() => {
        const id = this.activeChatId();
        return this.chats().find(c => c.id === id) || null;
    });

    // Computed signal for messages in the active chat
    currentMessages = computed(() => {
        const chat = this.activeChat();
        return chat ? chat.messages : [];
    });

    // State for streaming assistant response
    isTyping = signal<boolean>(false);

    constructor() { }

    createNewChat() {
        const newChat: Chat = {
            id: Date.now().toString(),
            title: 'New Chat',
            messages: [],
            updatedAt: new Date()
        };
        this.chats.update(chats => [newChat, ...chats]);
        this.activeChatId.set(newChat.id);
    }

    selectChat(id: string) {
        this.activeChatId.set(id);
    }

    deleteChat(id: string) {
        this.chats.update(chats => chats.filter(c => c.id !== id));
        if (this.activeChatId() === id) {
            this.activeChatId.set(null);
            // Auto select the first chat if available
            const remaining = this.chats();
            if (remaining.length > 0) {
                this.activeChatId.set(remaining[0].id);
            }
        }
    }

    async sendMessage(content: string) {
        if (!content.trim()) return;

        let activeId = this.activeChatId();
        if (!activeId) {
            this.createNewChat();
            activeId = this.activeChatId();
        }

        const currentChat = this.chats().find(c => c.id === activeId);
        if (!currentChat) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: content.trim(),
            timestamp: new Date()
        };

        // Update title if it's the first message
        let newTitle = currentChat.title;
        if (currentChat.messages.length === 0) {
            newTitle = content.length > 30 ? content.substring(0, 30) + '...' : content;
        }

        // Add user message
        this.chats.update(chats => chats.map(c => {
            if (c.id === activeId) {
                return {
                    ...c,
                    title: newTitle,
                    updatedAt: new Date(),
                    messages: [...c.messages, userMessage]
                };
            }
            return c;
        }));

        // Simulate AI response
        this.simulateTypingResponse(activeId!);
    }

    private simulateTypingResponse(chatId: string) {
        this.isTyping.set(true);

        // Add empty assistant message skeleton
        const assistantMessageId = Date.now().toString() + '-ai';
        const assistantMessage: Message = {
            id: assistantMessageId,
            role: 'assistant',
            content: '', // Start empty
            timestamp: new Date()
        };

        this.chats.update(chats => chats.map(c => {
            if (c.id === chatId) {
                return { ...c, messages: [...c.messages, assistantMessage] };
            }
            return c;
        }));

        // Generate response piece by piece
        const cannedResponses = [
            "That's an excellent question! When exploring complex topics like this, breaking down the fundamental principles is the key to understanding how everything connects.",
            "I can certainly help you with that. Think of it like mapping out a vast universe of possibilities and finding the most optimal path to the solution.",
            "As an AI language model, I analyze your query and simulate a streamed response based on vast amounts of training data. How can I assist you further today?"
        ];

        const fullText = cannedResponses[Math.floor(Math.random() * cannedResponses.length)];
        let currentText = '';
        let i = 0;

        const intervalId = setInterval(() => {
            if (i < fullText.length) {
                // Add random chunk size to look natural
                const chunkSize = Math.floor(Math.random() * 3) + 1;
                currentText += fullText.slice(i, i + chunkSize);
                i += chunkSize;

                // Update the message in the state
                this.updateAssistantMessage(chatId, assistantMessageId, currentText);
            } else {
                clearInterval(intervalId);
                this.isTyping.set(false);
            }
        }, 20); // Fast typing
    }

    private updateAssistantMessage(chatId: string, messageId: string, newContent: string) {
        this.chats.update(chats => chats.map(c => {
            if (c.id === chatId) {
                const msgs = c.messages.map(m => m.id === messageId ? { ...m, content: newContent } : m);
                return { ...c, messages: msgs };
            }
            return c;
        }));
    }
}
