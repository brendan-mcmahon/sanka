import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Room } from '../room.model';
import { User } from '../user.model';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { SocketService } from '../socket.service';
import { trigger, style, transition, animate } from '@angular/animations';
import { Howl } from 'howler';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.scss'],
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
export class SubmissionsComponent implements OnInit {

  kaizen: string;
  @Input() me: User;
  @Input() room: Room;
  @Output() doneSubmittingEvent = new EventEmitter<boolean>();
  @Output() addKaizenEvent = new EventEmitter<string>();
  checkMark = faCheckCircle;
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

  ngOnInit(): void {
  }

  addKaizen() {
    this.addKaizenEvent.emit(this.kaizen);
    this.kaizen = null;
  }

  done() {
    this.doneSubmittingEvent.emit(true);
  }

  notDone() {
    this.doneSubmittingEvent.emit(false);
  }

  nudge(userId: string) {
    this.socketService.nudge(userId);
  }
}
