import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Room } from './room.model';
import { Kaizen } from './kaizen';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  SOCKET_ENDPOINT = environment.SOCKET_ENDPOINT;
  roomCode: string;
  name: string;
  room$ = new BehaviorSubject<Room>(null);
  joined$: BehaviorSubject<boolean>;
  private socket: any;
  userId: string;
  phase = 'submit';
  nudge$ = new Subject<any>();

  constructor(private router: Router) {
    this.setupSocketConnection();
  }

  setupSocketConnection() {
    this.socket = io(this.SOCKET_ENDPOINT);
    this.joined$ = new BehaviorSubject<boolean>(!!this.name);

    this.socket.on('room-update', (room: Room) => {
      console.log(JSON.stringify(room));
      this.room$.next(room);
    });

    this.socket.on('join-success', socketId => {
      this.userId = socketId;
      this.joined$.next(true);
      this.room$.next(this.room$.value);
    });

    this.socket.on('ready-to-vote', () => {
      this.phase = 'vote';
    });

    this.socket.on('voting-finished', () => {
      console.log('voting finished, redirecting to results');
      this.router.navigate([`/results/${this.roomCode}`]);
    });

    this.socket.on('users-update', users => {
      if (users) {
        const currentRoom = this.room$.value;
        currentRoom.users = users;
        this.room$.next(currentRoom);
      }
    });

    this.socket.on('nudge', () => {
      this.nudge$.next();
    })

    this.socket.on('error', error => {
      console.log(`error: ${JSON.stringify(error)}`);
      if (error.type === 'RoomNotFound') {
        this.router.navigate(['/home']);
      }
    });
  }

  createRoom(name: string, roomCode: string) {
    this.name = name;
    this.joined$.next(true);
    this.roomCode = roomCode;

    this.socket.emit('create', { name, roomCode: this.roomCode });
  }

  joinRoom(name: string, roomCode: string): void {
    this.roomCode = roomCode;
    this.name = name;
    console.log(`name: ${this.name}`);
    this.socket.emit('join', { name: this.name, roomCode: this.roomCode });
  }

  addKaizen(kaizen: Kaizen) {
    this.socket.emit('new-kaizen', { roomCode: this.roomCode, kaizen } );
  }

  doneSubmitting() {
    this.socket.emit('done-submitting', { roomCode: this.roomCode, done: true } );
  }

  notDoneSubmitting() {
    this.socket.emit('done-submitting', { roomCode: this.roomCode, done: false } );
  }

  upVote(kaizenId: string) {
    this.socket.emit('vote', { roomCode: this.roomCode, kaizenId, direction: 'up' } );
  }

  downVote(kaizenId: string) {
    this.socket.emit('vote', { roomCode: this.roomCode, kaizenId, direction: 'down' } );
  }

  doneVoting(maps: {id: string, votes: number}) {
    this.socket.emit('done-voting', { roomCode: this.roomCode, maps } );
  }

  nudge(userId: string): void {
    this.socket.emit('nudge', { roomCode: this.roomCode, userId })
  }
}

