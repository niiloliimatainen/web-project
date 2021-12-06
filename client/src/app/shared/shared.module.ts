import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoteComponent } from './components/vote/vote.component';
import { MaterialModule } from '../material/material.module';
import { ToolMenuComponent } from './components/tool-menu/tool-menu.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

// Module that can be shared among multiple different modules. Add components here that are used in multiple places
@NgModule({
  declarations: [VoteComponent, ToolMenuComponent, ConfirmDialogComponent],
  imports: [CommonModule, MaterialModule],
  exports: [VoteComponent, ToolMenuComponent, ConfirmDialogComponent],
})
export class SharedModule {}
