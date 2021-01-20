import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NudgeIconComponent } from './nudge-icon.component';

describe('NudgeIconComponent', () => {
  let component: NudgeIconComponent;
  let fixture: ComponentFixture<NudgeIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NudgeIconComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NudgeIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
