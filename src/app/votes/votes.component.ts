import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../user.model';
import { Room } from '../room.model';
import { Kaizen } from '../kaizen';
import { faCheckCircle, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { SocketService } from '../socket.service';
import { trigger, style, transition, animate } from '@angular/animations';
import { Howl } from 'howler';

@Component({
  selector: 'app-votes',
  templateUrl: './votes.component.html',
  styleUrls: ['./votes.component.scss'],
  animations : [
    trigger('ahem', [
      transition(
        ':leave',
        [
          style({ opacity: 1 }),
          animate('.5s ease-in',
                  style({ opacity: 0 }))
        ]
      )
    ])
  ]
})
export class VotesComponent implements OnInit {

  @Input() me: User;
  @Input() room: Room;
  @Output() doneVotingEvent = new EventEmitter<any>();
  votes = 3;
  doneVoting = false;
  sure = true;
  checkMark = faCheckCircle;
  thumbsUp = faThumbsUp;
  thumbsDown = faThumbsDown;
  nudgeCount = 0;
  ahemVisible = false;
  ahemSound = new Howl({
    src: ['../../assets/sounds/ahem.mp3']
  });

  public nudges = ['ahem...', 'You there?', 'HEY, WAKE UP!'];

  constructor(private socketService: SocketService) {
    this.socketService.nudge$.subscribe(() => {
      if (this.nudgeCount < 3) this.nudgeCount++;
      else this.done();
      this.ahemVisible = true;
      this.ahemSound.play();
      setTimeout(() => this.ahemVisible = false, 250);
    });
  }

  ngOnInit(): void {  }

  upVote(kaizen: Kaizen) {
    if (this.canVoteUp(kaizen)) {
      if (kaizen.votes < 0) this.votes++;
      else this.votes--;
      kaizen.votes++;
    }
  }

  downVote(kaizen: Kaizen) {
    if (this.canVoteDown(kaizen)) {
      if (kaizen.votes > 0) this.votes++;
      else this.votes--;
      kaizen.votes--;
    }
  }

  canVoteUp(kaizen: Kaizen) {
    return kaizen.votes < 3 || (kaizen.votes <= 0 && this.votes === 0);
  }

  canVoteDown(kaizen: Kaizen) {
    return kaizen.votes > -3 || (kaizen.votes >= 0 && this.votes === 0);
  }

  nudge(userId: string) {
    this.socketService.nudge(userId);
  }

  done() {
    this.doneVoting = true;
    const voteMap = []
    this.room.kaizens.forEach(kaizen => {
      voteMap.push({ id: kaizen.id, votes: kaizen.votes});
    });
    this.doneVotingEvent.emit(voteMap);
  }

}
