import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterTestingModule } from '@angular/router/testing';

import { ViewEntityComponent } from './view-entity.component';

describe('ViewEntityComponent', () => {
  let component: ViewEntityComponent;
  let fixture: ComponentFixture<ViewEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewEntityComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatIconModule,
        MatDividerModule,
        MatButtonModule,
        MatProgressSpinnerModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
