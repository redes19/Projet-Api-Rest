export interface MovieIdRequest {
  id: number;
}

export interface CreateMovieRequest {
  title: string;
  description?: string | null;
  duration: number;
  genre?: string | null;
  poster_url?: string | null;
  release_date?: Date | null;
}

export interface UpdateMovieRequest {
  id: number;
  title?: string;
  description?: string | null;
  duration?: number;
  genre?: string | null;
  poster_url?: string | null;
  release_date?: Date | null;
}

export interface ListMovieRequest {
  page?: number | undefined;
  size?: number | undefined;
  durationMax?: number | undefined;
  genre?: string | undefined;
  title?: string | undefined;
  releasedAfter?: Date | undefined;
  releasedBefore?: Date | undefined;
}

export interface MovieScreeningsRequest {
  from?: Date | undefined;
  to?: Date | undefined;
}
