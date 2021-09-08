import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UpdatePasswordComponent} from './top-menu/update-password/update-password.component';
import {SharedModule} from '../../shared-module/shared-module.module';
import {ThreeMenuComponent} from './left-menu/three-menu/three-menu.component';
import {MenuComponent} from './left-menu/menu/menu.component';
import {ForceChangePasswordComponent} from './top-menu/force-change-password/force-change-password.component';
import { TenantListComponent } from './top-menu/tenant-list/tenant-list.component';

@NgModule({
  declarations: [UpdatePasswordComponent, ThreeMenuComponent, MenuComponent, ForceChangePasswordComponent, TenantListComponent],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [UpdatePasswordComponent, ThreeMenuComponent, MenuComponent, ForceChangePasswordComponent, TenantListComponent]
})
export class MenuModule {
}
