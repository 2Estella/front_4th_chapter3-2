import { Event } from '../types';

// 윤년 여부를 확인하는 함수
const isLeapYear = (year: number): boolean =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

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
    // 현재 달의 마지막 날짜 계산
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();

    // 원래 날짜가 현재 달의 마지막 날짜보다 크면 마지막 날짜로 조정
    const adjustedDay = Math.min(startDate.getDate(), lastDayOfMonth);
    let adjustedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), adjustedDay);

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
        const month = startDate.getMonth();
        const day = startDate.getDate();
        let nextYear = currentDate.getFullYear() + Number(baseEvent.repeat.interval);

        // 윤년 처리: 2월 29일을 포함한 일정에서, 윤년이 아니면 2월 28일로 변경
        if (month === 1 && day === 29 && !isLeapYear(nextYear)) {
          currentDate = new Date(nextYear, month, 28);
        } else {
          currentDate = new Date(nextYear, month, day);
        }
        break;
    }

    index++;
  }

  return events;
}
