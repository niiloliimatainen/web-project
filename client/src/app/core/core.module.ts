import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './components/navigation/navigation.component';
import { MaterialModule } from '../material/material.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EntityComponent } from './components/entity/entity.component';
import { ViewEntityComponent } from './components/view-entity/view-entity.component';
import { RouterModule } from '@angular/router';
import { HighlightModule } from 'ngx-highlightjs';
import { CommentComponent } from './components/comment/comment.component';

@NgModule({
  declarations: [
    NavigationComponent,
    DashboardComponent,
    LoginComponent,
    EntityComponent,
    ViewEntityComponent,
    CommentComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HighlightModule,
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only.'
      );
    }
  }

  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [],
    };
  }
}
