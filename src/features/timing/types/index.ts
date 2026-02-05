export type AmPm = 'AM' | 'PM';

export type DayOfWeek =
    | 'Monday'
    | 'Tuesday'
    | 'Wednesday'
    | 'Thursday'
    | 'Friday'
    | 'Saturday'
    | 'Sunday';

export interface Timing {
    id: string;
    _id?: string; // fallback
    day: DayOfWeek;
    title: string;
    startTime: string; // e.g., "10:00"
    startTimeAmPm: AmPm;
    endTime: string; // e.g., "05:00"
    endTimeAmPm: AmPm;
    breakStartTime: string;
    breakStartTimeAmPm: AmPm;
    breakEndTime: string;
    breakEndTimeAmPm: AmPm;
    createdAt?: string;
    updatedAt?: string;
}

export interface TimingPayload {
    day: DayOfWeek;
    title: string;
    startTime: string;
    startTimeAmPm: AmPm;
    endTime: string;
    endTimeAmPm: AmPm;
    breakStartTime: string;
    breakStartTimeAmPm: AmPm;
    breakEndTime: string;
    breakEndTimeAmPm: AmPm;
}

export interface TimingFilters {
    search?: string;
    day?: DayOfWeek;
    page?: number;
    limit?: number;
}

export interface TimingListResponse {
    data: Timing[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface TimingResponse {
    data: Timing;
    message: string;
}
