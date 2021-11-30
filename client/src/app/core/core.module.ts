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
import { LoginRegistrationComponent } from './components/login-registration/login-registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EntityComponent } from './components/entity/entity.component';
import { ViewEntityComponent } from './components/view-entity/view-entity.component';
import { RouterModule } from '@angular/router';
import { HighlightModule } from 'ngx-highlightjs';
import { CommentComponent } from './components/comment/comment.component';
import { SharedModule } from '../shared/shared.module';
import { CreateEntityComponent } from './components/create-entity/create-entity.component';
import { TakeInputComponent } from './components/take-input/take-input.component';
import { ViewUserComponent } from './components/view-user/view-user.component';

@NgModule({
  declarations: [
    NavigationComponent,
    DashboardComponent,
    LoginRegistrationComponent,
    EntityComponent,
    ViewEntityComponent,
    CommentComponent,
    CreateEntityComponent,
    TakeInputComponent,
    ViewUserComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HighlightModule,
    SharedModule,
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
