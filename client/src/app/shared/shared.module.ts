import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoteComponent } from './components/vote/vote.component';
import { MaterialModule } from '../material/material.module';
import { ToolMenuComponent } from './components/tool-menu/tool-menu.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [VoteComponent, ToolMenuComponent, ConfirmDialogComponent],
  imports: [CommonModule, MaterialModule],
  exports: [VoteComponent, ToolMenuComponent, ConfirmDialogComponent],
})
export class SharedModule {}
