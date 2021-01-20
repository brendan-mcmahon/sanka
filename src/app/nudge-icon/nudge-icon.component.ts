import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-nudge-icon',
  templateUrl: './nudge-icon.component.html',
  styleUrls: ['./nudge-icon.component.scss']
})
export class NudgeIconComponent implements OnInit {

  @Input() hide: boolean;
  @Input() color: string;

  constructor() { }

  ngOnInit(): void {
  }

}
