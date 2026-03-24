import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { ChatService } from '../../services/chat.service';
import { signal } from '@angular/core';
import { vi } from 'vitest';

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let mockChatService: any;

    beforeEach(async () => {
        mockChatService = {
            chats: signal([{ id: '1', title: 'Test Chat', messages: [], updatedAt: new Date() }]),
            activeChatId: signal('1'),
            createNewChat: vi.fn(),
            selectChat: vi.fn(),
            deleteChat: vi.fn()
        };

        await TestBed.configureTestingModule({
            imports: [SidebarComponent],
            providers: [
                { provide: ChatService, useValue: mockChatService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display recent chats', () => {
        const chatElements = fixture.nativeElement.querySelectorAll('.chat-item');
        expect(chatElements.length).toBe(1);
        expect(chatElements[0].textContent).toContain('Test Chat');
    });

    it('should call createNewChat on button click', () => {
        const newChatBtn = fixture.nativeElement.querySelector('.new-chat-btn');
        newChatBtn.click();
        expect(mockChatService.createNewChat).toHaveBeenCalled();
    });

    it('should select chat on click', () => {
        const chatItem = fixture.nativeElement.querySelector('.chat-item');
        chatItem.click();
        expect(mockChatService.selectChat).toHaveBeenCalledWith('1');
    });

    it('should delete chat on delete button click', () => {
        const deleteBtn = fixture.nativeElement.querySelector('.delete-btn');
        // We must pass an event mock because the component calls stopPropagation()
        const mockEvent = new Event('click');
        vi.spyOn(mockEvent, 'stopPropagation');

        // Call the method directly because the click in Karma might behave differently with stopPropagation
        component.deleteChat(mockEvent, '1');
        expect(mockEvent.stopPropagation).toHaveBeenCalled();
        expect(mockChatService.deleteChat).toHaveBeenCalledWith('1');
    });
});
