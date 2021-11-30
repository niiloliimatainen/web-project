import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeInputComponent } from './take-input.component';

describe('AddCommentComponent', () => {
  let component: TakeInputComponent;
  let fixture: ComponentFixture<TakeInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TakeInputComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TakeInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
