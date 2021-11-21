import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoteComponent } from './components/vote/vote.component';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [VoteComponent],
  imports: [CommonModule, MaterialModule],
  exports: [VoteComponent],
})
export class SharedModule {}
