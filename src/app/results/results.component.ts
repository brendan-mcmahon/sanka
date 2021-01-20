import { Component, OnInit } from '@angular/core';
import { SocketService } from '../socket.service';
import { Room } from '../room.model';
import { Kaizen } from '../kaizen';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  room: Room;
  results: Kaizen[];

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.socketService.room$.subscribe(r => {
      if (r) {
        this.room = r;
        this.results = this.room.kaizens.sort((a, b) => {
          if (a.votes > b.votes) return -1;
          if (a.votes === b.votes) return 0;
          if (a.votes < b.votes) return 1;
        });
      }
    })
  }

}
