import { RoomType } from "../../database/entities/room.js";

export interface RoomIdRequest {
  id: number;
}

export interface CreateRoomRequest {
  name: string;
  description?: string | null;
  image_url?: string | null;
  type: RoomType;
  capacity: number;
  has_disabled_access?: boolean;
  is_maintenance?: boolean;
}

export interface UpdateRoomRequest {
  id: number;
  name?: string;
  description?: string | null;
  image_url?: string | null;
  type?: RoomType;
  capacity?: number;
  has_disabled_access?: boolean;
  is_maintenance?: boolean;
}

export interface ListRoomRequest {
  page?: number;
  size?: number;
  capacityMax?: number;
  isMaintenance?: boolean;
}
