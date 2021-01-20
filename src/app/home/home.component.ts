import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  name: string;
  roomCode: string;
  showCreateDialog = false;
  showJoinDialog = false;
  nameError: string;
  codeError: string;

  constructor(private router: Router, private socketService: SocketService ) { }

  ngOnInit(): void {
  }

  create() {
    const alphabet = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

    this.roomCode = [...Array(4)]
    .map(i => alphabet[Math.random()*26|0])
    .join('');

    this.socketService.createRoom(this.name, this.roomCode);

    this.socketService.phase = 'submit';
    this.router.navigate([`room/${this.roomCode}`]);
  }

  join() {

  }

}
