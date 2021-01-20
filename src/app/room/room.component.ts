import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from '../socket.service';
import { Room } from "../room.model";
import { User } from '../user.model';
import { Kaizen } from '../kaizen';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  roomCode: string;
  newKaizen: string;
  room: Room;
  kaizens = [];
  name: string;
  joined: boolean;
  me: User;

  constructor(private route: ActivatedRoute, private router: Router, public socketService: SocketService) { }

  ngOnInit(): void {
    this.roomCode = this.route.snapshot.paramMap.get('roomCode');
    if (!this.socketService.name) {
      this.joined = false;
    }

    this.socketService.joined$.subscribe(j => {console.log(j); this.joined = j; });

    this.socketService.room$.subscribe(r => {
      if (r) {
        this.room = r;
        this.me = r.users.find(u => u.id === this.socketService.userId);
      }
    });
  }

  addKaizen(newKaizen: string) {
    this.socketService.addKaizen(
      new Kaizen(newKaizen, this.socketService.userId, uuidv4())
    );
  }

  addNameAndJoin() {
    this.socketService.joinRoom(this.name, this.roomCode);
  }

  doneSubmitting(done: boolean) {
    if (done) this.socketService.doneSubmitting();
    else this.socketService.notDoneSubmitting();
  }

  doneVoting(maps: {id: string, votes: number}) {
    this.socketService.doneVoting(maps);
  }

  navigateHome() {
    this.router.navigate(['/home']);
  }

}
