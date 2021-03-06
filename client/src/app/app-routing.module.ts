import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateEntityComponent } from './core/components/create-entity/create-entity.component';
import { DashboardComponent } from './core/components/dashboard/dashboard.component';
import { NavigationComponent } from './core/components/navigation/navigation.component';
import { ViewEntityComponent } from './core/components/view-entity/view-entity.component';
import { ViewUserComponent } from './core/components/view-user/view-user.component';

// All the routes of the app. If route is children, it is rendered from the parent component's router-outlet, else it it is rendered from AppComponent's router-outlet.
const routes: Routes = [
  {
    path: '',
    component: NavigationComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'post/:id',
        component: ViewEntityComponent,
      },
      {
        path: 'create',
        component: CreateEntityComponent,
      },
      {
        path: 'edit',
        component: CreateEntityComponent,
      },
      {
        path: 'user/:id',
        component: ViewUserComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
