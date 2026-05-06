export interface DailyAttendanceRequest {
  date?: Date | undefined;
  roomId?: number | undefined;
}

export interface PeriodAttendanceRequest {
  from: Date;
  to: Date;
  roomId?: number | undefined;
}
