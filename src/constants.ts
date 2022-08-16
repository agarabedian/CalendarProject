import { availabiltyList } from './types';

/** Default availibilties */
export const DEFAULT_AVAILIBILTITY: availabiltyList = [
    { day: 'Monday', start: 9, end: 17 },
    { day: 'Tuesday', start: 9, end: 17 },
    { day: 'Wednesday', start: 9, end: 17 },
    { day: 'Thursday', start: 9, end: 17 },
    { day: 'Friday', start: 9, end: 17 },
];

/** Days of the week to select from. */
export const DAYS_OF_WEEK: string[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
];

/** Used for sorting days of the week by name. */
export const DAY_MAP: any = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7,
};

/** Format time from 24-hour clock to 12-hour. */
export const formatTime = (time: number): string => {
    if (time === 0) return '12 AM';
    else if (time === 12) {
        return '12 PM';
    } else return time > 12 ? `${time - 12} PM` : `${time} AM`;
};
