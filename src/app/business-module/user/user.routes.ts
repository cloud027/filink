import { Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { UserListComponent } from './user-manage/user-list/user-list.component';
import { UnitListComponent } from './user-manage/unit-list/unit-list.component';
import { RoleListComponent } from './user-manage/role-list/role-list.component';
import { OnlineListComponent } from './user-manage/online-list/online-list.component';
import { AddUserComponent } from './user-manage/add-user/add-user.component';
import { ModifyUserComponent } from './user-manage/modify-user/modify-user.component';
import { UnitDetailComponent } from './user-manage/unit-detail/unit-detail.component';
import { RoleDetailComponent } from './user-manage/role-detail/role-detail.component';

export const ROUTER_CONFIG: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: 'user-list',
        component: UserListComponent,
        data: {
          breadcrumb: [{ label: 'users', url: 'user-list' }, { label: 'userList' }]
        }
      },
      {
        path: 'unit-list',
        component: UnitListComponent,
        data: {
          breadcrumb: [{ label: 'users', url: 'unit-list' }, { label: 'unitList' }]
        }
      },
      {
        path: 'role-list',
        component: RoleListComponent,
        data: {
          breadcrumb: [{ label: 'users', url: 'role-list' }, { label: 'roleList' }]
        }
      },
      {
        path: 'online-list',
        component: OnlineListComponent,
        data: {
          breadcrumb: [{ label: 'users', url: 'online-list' }, { label: 'onlineList' }]
        }
      },
      {
        path: 'add-user/:type',
        component: AddUserComponent,
        data: {
          breadcrumb: [{ label: 'users' }, { label: 'userList', url: 'user-list' }, { label: 'user' }]
        }
      },
      {
        path: 'modify-user/:type',
        component: ModifyUserComponent,
        data: {
          breadcrumb: [{ label: 'users' }, { label: 'userList', url: 'user-list' }, { label: 'user' }]
        }
      },
      {
        path: 'unit-detail/:type',
        component: UnitDetailComponent,
        data: {
          breadcrumb: [{ label: 'users' }, { label: 'unitList', url: 'unit-list' }, { label: 'unit' }]
        }
      },
      {
        path: 'role-detail/:type',
        component: RoleDetailComponent,
        data: {
          breadcrumb: [{ label: 'users' }, { label: 'roleList', url: 'role-list' }, { label: 'role' }]
        }
      }
    ]
  }
];
