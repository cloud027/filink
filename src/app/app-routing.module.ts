import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {RoleDeactivateGuardService} from './core-module/guard-service/role-deactivate-guard.service';
import {NotfoundComponent} from './business-module/notfound/notfound.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: '/login'},
  {path: 'notfound', component: NotfoundComponent},
  {path: 'login', loadChildren: './business-module/login/login.module#LoginModule'},
  {path: 'business', loadChildren: './business-module/business.module#BusinessModule', canActivateChild: [RoleDeactivateGuardService]},
  {path: '**', redirectTo: '/notfound'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
