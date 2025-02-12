import { Event } from '../types';

/**
 * 반복 일정을 생성하는 함수
 * @param baseEvent 기본 일정
 * @returns 반복 일정 배열
 */
export function generateRepeatEvents(baseEvent: Event): Event[] {
  const events: Event[] = [];
  const timestamp = Date.now().toString(36);
  const startDate = new Date(baseEvent.date);
  const endDate = new Date(baseEvent.repeat.endDate!);
  let currentDate = startDate;
  let index = 0;

  while (currentDate <= endDate) {
    events.push({
      ...baseEvent,
      id: `${timestamp}-${index}`,
      date: currentDate.toISOString().split('T')[0],
      repeat: {
        ...baseEvent.repeat,
        id: `repeatId-${timestamp}`,
      },
    });

    // 다음 반복 날짜 계산
    switch (baseEvent.repeat.type) {
      case 'daily':
        currentDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + Number(baseEvent.repeat.interval));
        break;
      case 'weekly':
        currentDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + 7 * Number(baseEvent.repeat.interval));
        break;
      case 'monthly':
        currentDate = new Date(currentDate);
        currentDate.setMonth(currentDate.getMonth() + Number(baseEvent.repeat.interval));
        break;
      case 'yearly':
        currentDate = new Date(currentDate);
        currentDate.setFullYear(currentDate.getFullYear() + Number(baseEvent.repeat.interval));
        break;
    }

    index++;
  }

  return events;
}
