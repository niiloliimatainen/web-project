import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateEntityComponent } from './core/components/create-entity/create-entity.component';
import { DashboardComponent } from './core/components/dashboard/dashboard.component';
import { NavigationComponent } from './core/components/navigation/navigation.component';
import { ViewEntityComponent } from './core/components/view-entity/view-entity.component';

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
