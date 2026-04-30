import { QueryFailedError, Repository } from "typeorm";
import { Room, RoomType } from "../../database/entities/room.js";
import { ResourceConflictError } from "../../utils/errors.js";

interface CreateRoomData {
  name: string;
  description?: string | null;
  image_url?: string | null;
  type: RoomType;
  capacity: number;
  has_disabled_access?: boolean;
  is_maintenance?: boolean;
}

interface UpdateRoomData {
  id: number;
  name?: string;
  description?: string | null;
  image_url?: string | null;
  type?: RoomType;
  capacity?: number;
  has_disabled_access?: boolean;
  is_maintenance?: boolean;
}

export interface ListResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ListRoomFilter {
  page: number;
  size: number;
  capacityMax?: number | undefined;
  isMaintenance?: boolean | undefined;
}

export class RoomUsecase {
  constructor(private roomRepository: Repository<Room>) {}

  async createRoom(roomData: CreateRoomData) {
    const existing = await this.roomRepository.findOneBy({
      name: roomData.name,
    });

    if (existing) return null;

    try {
      const room = this.roomRepository.create({
        name: roomData.name,
        description: roomData.description || null,
        image_url: roomData.image_url || null,
        type: roomData.type,
        capacity: roomData.capacity,
        has_disabled_access: roomData.has_disabled_access || false,
        is_maintenance: roomData.is_maintenance || false,
      });
      return this.roomRepository.save(room);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const code = (error.driverError as { code: string }).code;

        if (code === "23505") {
          throw new ResourceConflictError("room name is already taken");
        }
      }
      throw error;
    }
  }

  async getRoom(id: number) {
    return this.roomRepository.findOneBy({ id });
  }

  async getRoomByName(name: string) {
    return this.roomRepository.findOneBy({ name });
  }

  async deleteRoom(id: number) {
    const room = await this.getRoom(id);
    if (!room) {
      return null;
    }
    await this.roomRepository.remove(room);
  }

  async updateRoom(roomData: UpdateRoomData): Promise<Room | null> {
    const room = await this.getRoom(roomData.id);
    if (!room) {
      return null;
    }
    try {
      this.roomRepository.merge(room, roomData);
      return await this.roomRepository.save(room);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const code = (error.driverError as { code: string }).code;

        if (code === "23505") {
          throw new ResourceConflictError("room name is already taken");
        }
      }
      throw error;
    }
  }

  async listRooms({
    page,
    size,
    capacityMax,
    isMaintenance,
  }: ListRoomFilter): Promise<ListResponse<Room>> {
    const query = this.roomRepository.createQueryBuilder("room");

    if (capacityMax !== undefined) {
      query.andWhere("room.capacity <= :capacityMax", { capacityMax });
    }

    if (isMaintenance !== undefined) {
      query.andWhere("room.is_maintenance = :isMaintenance", { isMaintenance });
    }

    query.skip((page - 1) * size);
    query.take(size);

    const [rooms, totalCount] = await query.getManyAndCount();

    return {
      data: rooms,
      pageSize: size,
      page,
      totalCount,
      totalPages: Math.ceil(totalCount / size),
    };
  }
}
