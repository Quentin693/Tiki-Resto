export declare class TimeSlotDto {
    time: string;
    available: boolean;
    remainingCapacity: number;
}
export declare class TimeSlotsResponseDto {
    lunch: TimeSlotDto[];
    dinner: TimeSlotDto[];
}
