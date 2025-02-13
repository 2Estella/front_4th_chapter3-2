import { renderHook } from '@testing-library/react';

import { useRepeatEvents } from '@/hooks/useRepeatEvents';
import { Event, RepeatType } from '@/types';

describe('useRepeatEvents', () => {
  const baseEvent: Event = {
    id: 'test-1',
    title: '테스트 일정',
    date: '2024-10-15',
    startTime: '10:00',
    endTime: '11:00',
    description: '테스트 설명',
    location: '테스트 장소',
    category: '업무',
    notificationTime: 10,
    repeat: {
      type: 'none' as RepeatType,
      interval: 1,
      id: undefined,
    },
  };

  it('반복이 아닌 일정은 그대로 반환한다', () => {
    const { result } = renderHook(() => useRepeatEvents());
    const events = result.current.createRepeatEvents(baseEvent);

    expect(events).toHaveLength(1);
    expect(events[0]).toEqual(baseEvent);
  });

  it('종료일이 없는 반복 일정은 단일 일정으로 반환한다', () => {
    const { result } = renderHook(() => useRepeatEvents());
    const repeatEvent = {
      ...baseEvent,
      repeat: {
        type: 'daily' as RepeatType,
        interval: 1,
        id: 'repeat-1',
      },
    };

    const events = result.current.createRepeatEvents(repeatEvent);

    expect(events).toHaveLength(1);
    expect(events[0]).toEqual(repeatEvent);
  });

  it('매일 반복되는 일정을 생성한다', () => {
    const { result } = renderHook(() => useRepeatEvents());
    const dailyEvent = {
      ...baseEvent,
      repeat: {
        type: 'daily' as RepeatType,
        interval: 1,
        endDate: '2024-10-17',
        id: 'repeat-1',
      },
    };

    const events = result.current.createRepeatEvents(dailyEvent);

    expect(events).toHaveLength(3);
    expect(events[0].date).toBe('2024-10-15');
    expect(events[1].date).toBe('2024-10-16');
    expect(events[2].date).toBe('2024-10-17');
  });

  it('매주 반복되는 일정을 생성한다', () => {
    const { result } = renderHook(() => useRepeatEvents());
    const weeklyEvent = {
      ...baseEvent,
      repeat: {
        type: 'weekly' as RepeatType,
        interval: 1,
        endDate: '2024-10-29',
        id: 'repeat-1',
      },
    };

    const events = result.current.createRepeatEvents(weeklyEvent);

    expect(events).toHaveLength(3);
    expect(events[0].date).toBe('2024-10-15');
    expect(events[1].date).toBe('2024-10-22');
    expect(events[2].date).toBe('2024-10-29');
  });

  it('매월 반복되는 일정을 생성한다', () => {
    const { result } = renderHook(() => useRepeatEvents());
    const monthlyEvent = {
      ...baseEvent,
      repeat: {
        type: 'monthly' as RepeatType,
        interval: 1,
        endDate: '2024-12-15',
        id: 'repeat-1',
      },
    };

    const events = result.current.createRepeatEvents(monthlyEvent);

    expect(events).toHaveLength(3);
    expect(events[0].date).toBe('2024-10-15');
    expect(events[1].date).toBe('2024-11-15');
    expect(events[2].date).toBe('2024-12-15');
  });

  it('매년 반복되는 일정을 생성한다', () => {
    const { result } = renderHook(() => useRepeatEvents());
    const yearlyEvent = {
      ...baseEvent,
      repeat: {
        type: 'yearly' as RepeatType,
        interval: 1,
        endDate: '2026-10-15',
        id: 'repeat-1',
      },
    };

    const events = result.current.createRepeatEvents(yearlyEvent);

    expect(events).toHaveLength(3);
    expect(events[0].date).toBe('2024-10-15');
    expect(events[1].date).toBe('2025-10-15');
    expect(events[2].date).toBe('2026-10-15');
  });

  it('반복 간격이 2 이상인 경우도 처리한다', () => {
    const { result } = renderHook(() => useRepeatEvents());
    const biWeeklyEvent = {
      ...baseEvent,
      repeat: {
        type: 'weekly' as RepeatType,
        interval: 2,
        endDate: '2024-11-12',
        id: 'repeat-1',
      },
    };

    const events = result.current.createRepeatEvents(biWeeklyEvent);

    expect(events).toHaveLength(3);
    expect(events[0].date).toBe('2024-10-15');
    expect(events[1].date).toBe('2024-10-29');
    expect(events[2].date).toBe('2024-11-12');
  });
});
