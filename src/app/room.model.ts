import { User } from "./user.model";
import { Kaizen } from './kaizen';
export class Room {
  roomCode: string;
  users: User[];
  kaizens: Kaizen[];
}
