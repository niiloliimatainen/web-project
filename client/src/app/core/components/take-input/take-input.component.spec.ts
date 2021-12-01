import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { RouterTestingModule } from '@angular/router/testing';

import { TakeInputComponent } from './take-input.component';

describe('TakeInputComponent', () => {
  let component: TakeInputComponent;
  let fixture: ComponentFixture<TakeInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TakeInputComponent],
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatButtonModule,
        RouterTestingModule,
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {},
        },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
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
