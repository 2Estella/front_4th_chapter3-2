import { http, HttpResponse } from 'msw';

import { server } from '../setupTests';
import { Event } from '../types';

// ! Hard 여기 제공 안함
export const setupMockHandlerCreation = (initEvents = [] as Event[]) => {
  const mockEvents: Event[] = [...initEvents];

  server.use(
    // 일정 목록 조회
    http.get('/api/events', () => HttpResponse.json({ events: mockEvents })),

    // 단일 일정 생성
    http.post('/api/events', async ({ request }) => {
      const newEvent = (await request.json()) as Event;
      newEvent.id = String(mockEvents.length + 1);
      mockEvents.push(newEvent);
      return HttpResponse.json(newEvent, { status: 201 });
    }),

    // 반복 일정 생성
    http.post('/api/events-list', async ({ request }) => {
      const { events } = (await request.json()) as { events: Event[] };
      const newEvents = events.map((event: Event, index: number) => ({
        ...event,
        id: String(mockEvents.length + index + 1),
      }));

      mockEvents.push(...newEvents);
      return HttpResponse.json(newEvents, { status: 201 });
    })
  );
};

export const setupMockHandlerUpdating = () => {
  const mockEvents: Event[] = [
    {
      id: '1',
      title: '기존 회의',
      date: '2024-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
  ];

  server.use(
    // 일정 목록 조회
    http.get('/api/events', () => HttpResponse.json({ events: mockEvents })),

    // 단일 일정 수정
    http.put('/api/events/:id', async ({ params, request }) => {
      const { id } = params;
      const updatedEvent = (await request.json()) as Event;
      const index = mockEvents.findIndex((event) => event.id === id);

      if (index === -1) {
        return new HttpResponse(null, { status: 404 });
      }

      mockEvents[index] = { ...mockEvents[index], ...updatedEvent };
      return HttpResponse.json(mockEvents[index]);
    }),

    // 반복 일정 수정
    http.put('/api/events-list', async ({ request }) => {
      const eventsList = (await request.json()) as Event[];
      let isUpdated = false;

      eventsList.forEach((event: Event) => {
        const index = mockEvents.findIndex((e) => e.id === event.id);
        if (index !== -1) {
          isUpdated = true;
          mockEvents[index] = { ...mockEvents[index], ...event };
        }
      });

      if (!isUpdated) {
        return new HttpResponse(null, { status: 404 });
      }

      return HttpResponse.json(mockEvents);
    })
  );
};

export const setupMockHandlerDeletion = (shouldFail = false) => {
  const mockEvents: Event[] = [
    {
      id: '1',
      title: '삭제할 이벤트',
      date: '2024-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '삭제할 이벤트입니다',
      location: '어딘가',
      category: '기타',
      repeat: {
        id: 'repeat-1',
        type: 'weekly',
        interval: 1,
      },
      notificationTime: 10,
    },
  ];

  server.use(
    // 일정 목록 조회
    http.get('/api/events', () => HttpResponse.json({ events: mockEvents })),

    // 단일 일정 삭제
    http.delete('/api/events/:id', ({ params }) => {
      if (shouldFail) {
        return new HttpResponse(null, { status: 500 });
      }

      const { id } = params;
      const index = mockEvents.findIndex((event) => event.id === id);

      if (index !== -1) {
        mockEvents.splice(index, 1);
      }

      return new HttpResponse(null, { status: 204 });
    }),

    // 반복 일정 삭제
    http.delete('/api/events-list', async ({ request }) => {
      const { eventIds } = (await request.json()) as { eventIds: string[] };
      const filteredEvents = mockEvents.filter((event) => !eventIds.includes(event.id));
      mockEvents.length = 0;
      mockEvents.push(...filteredEvents);

      return new HttpResponse(null, { status: 204 });
    })
  );
};
