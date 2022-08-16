/** List of availability objects. */
export type availabiltyList = availabilty[];

/**
 * Day, start, and end values assigned by user to indicate their availability.
 */
export type availabilty = {
    /** Day of the week. */
    day: string;
    /** Start time (24hr). */
    start: number;
    /** End time (24hr). */
    end: number;
};
