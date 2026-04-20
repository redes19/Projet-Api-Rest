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
  page?: number;
  size?: number;
  durationMax?: number;
  genre?: string;
}
