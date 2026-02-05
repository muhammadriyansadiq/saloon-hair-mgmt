export type AmPm = 'AM' | 'PM';

export type DayOfWeek =
    | 'Monday'
    | 'Tuesday'
    | 'Wednesday'
    | 'Thursday'
    | 'Friday'
    | 'Saturday'
    | 'Sunday';

export interface Shift {
    id: string;
    _id?: string;
    day: DayOfWeek;
    title: string;
    startTime: string;
    startTimeAmPm: AmPm;
    endTime: string;
    endTimeAmPm: AmPm;
    createdAt?: string;
    updatedAt?: string;
}

export interface ShiftPayload {
    day: DayOfWeek;
    title: string;
    startTime: string;
    startTimeAmPm: AmPm;
    endTime: string;
    endTimeAmPm: AmPm;
}

export interface ShiftFilters {
    search?: string;
    day?: DayOfWeek;
    page?: number;
    limit?: number;
}

export interface ShiftListResponse {
    data: Shift[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ShiftResponse {
    data: Shift;
    message: string;
}
