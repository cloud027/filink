import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { SharedModule } from '../../shared-module/shared-module.module';
import { RouterModule } from '@angular/router';
import { ROUTER_CONFIG } from './user.routes';
import { UserListComponent } from './user-manage/user-list/user-list.component';
import { UnitListComponent } from './user-manage/unit-list/unit-list.component';
import { AddUserComponent } from './user-manage/add-user/add-user.component';
import { ModifyUserComponent } from './user-manage/modify-user/modify-user.component';
import { OnlineListComponent } from './user-manage/online-list/online-list.component';
import { UnitDetailComponent } from './user-manage/unit-detail/unit-detail.component';
import { RoleListComponent } from './user-manage/role-list/role-list.component';
import { RoleDetailComponent } from './user-manage/role-detail/role-detail.component';
import { UserUtilService } from './share/service/user-util.service';
import { DeptLevelPipe } from './share/pipe/dept-level.pipe';
import { DeptStylePipe } from './share/pipe/dept-style.pipe';
import {UserService} from './share/service/user.service';

@NgModule({
  declarations: [
    UserComponent,
    UserListComponent,
    AddUserComponent,
    ModifyUserComponent,
    UnitListComponent,
    OnlineListComponent,
    UnitDetailComponent,
    RoleListComponent,
    RoleDetailComponent,
    DeptLevelPipe,
    DeptStylePipe],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(ROUTER_CONFIG)

  ],
  providers: [UserUtilService, UserService]
})
export class UserModule {
}
