import { Event } from '@/types';
import { generateRepeatEvents } from '@/utils/repeatEventUtils';

/**
 * 반복 일정을 생성하는 훅
 * @returns {Object} 반복 일정 생성 함수
 */
export function useRepeatEvents() {
  const createRepeatEvents = (baseEvent: Event): Event[] => {
    if (baseEvent.repeat.type === 'none' || !baseEvent.repeat.endDate) {
      return [baseEvent];
    }

    return generateRepeatEvents(baseEvent);
  };

  return { createRepeatEvents };
}
