export interface ScreeningIdRequest {
  id: number;
}

export interface CreateScreeningRequest {
  movie_id: number;
  room_id: number;
  start_time: Date;
}

export interface UpdateScreeningRequest {
  id: number;
  movie_id?: number;
  room_id?: number;
  start_time?: Date;
  end_time?: Date;
}

export interface ListScreeningRequest {
  page?: number;
  size?: number;
  movieId?: number;
  roomId?: number;
  from?: Date;
  to?: Date;
}
