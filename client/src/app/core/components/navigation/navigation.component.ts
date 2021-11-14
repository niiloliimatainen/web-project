import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { BreakpointService } from '../../services/breakpoint.service';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  private breakpointSubscription: Subscription;
  private dialogRef: MatDialogRef<LoginComponent> | undefined;
  isHandset: boolean = false;

  constructor(
    private dialog: MatDialog,
    public authService: AuthService,
    private breakpointService: BreakpointService
  ) {
    this.breakpointSubscription = this.breakpointService.isHandset$.subscribe(
      (isHandsetPortrait) => {
        this.isHandset = isHandsetPortrait;
        this.dialogRef?.close();
      }
    );
  }

  openLogin() {
    if (this.isHandset) {
      this.dialogRef = this.dialog.open(LoginComponent, {
        width: '100%',
        height: '80%',
        maxWidth: '100%',
        maxHeight: '80%',
        panelClass: 'bottom-dialog',
        position: {
          bottom: '0',
          left: '0',
        },
      });
    } else {
      this.dialogRef = this.dialog.open(LoginComponent, {
        width: '35vw',
        minWidth: '300px',
        height: '60vh',
        minHeight: '600px',
      });
    }
  }

  ngOnDestroy(): void {
    this.breakpointSubscription.unsubscribe();
  }
}
