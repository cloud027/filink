import {Routes} from '@angular/router';
import {ScheduleComponent} from './schedule.component';
import {PersonInformationComponent} from './schedule-manage/person-information/person-information.component';
import {WorkforceManagementComponent} from './schedule-manage/workforce-management/workforce-management.component';
import {PersonDetailComponent} from './schedule-manage/person-information/person-detail/person-detail.component';
import {AssociateUserComponent} from './schedule-manage/person-information/associate-user/associate-user.component';
import {WorkShiftComponent} from './schedule-manage/work-shift/work-shift.component';
import {ShiftDetailComponent} from './schedule-manage/work-shift/shift-detail/shift-detail.component';
import {TeamManagementComponent} from './schedule-manage/team-management/team-management.component';
import {TeamManagementDetailComponent} from './schedule-manage/team-management/team-management-detail/team-management-detail.component';
import { WorkforceManagementDetailComponent } from './schedule-manage/workforce-management/workforce-management-detail/workforce-management-detail.component';
import { ViewSchedulingComponent } from './schedule-manage/workforce-management/view-scheduling/view-scheduling.component';
export const ROUTER_CONFIG: Routes = [
  {
    path: '',
    component: ScheduleComponent,
    children: [
      {
        // 人员信息
        path: 'person-information',
        component: PersonInformationComponent,
        data: {
          breadcrumb: [{label: 'scheduleManage'}, {label: 'personInformationManage'}]
        }
      },
      {
        // 新增或编辑人员
        path: 'person-detail/:type',
        component: PersonDetailComponent,
        data: {
          breadcrumb: [{label: 'scheduleManage'}, {label: 'personInformationManage', url: 'person-information'}, {label: 'person'}]
        }
      },
      {
        // 关联用户
        path: 'associate-user',
        component: AssociateUserComponent,
        data: {
          breadcrumb: [{label: 'scheduleManage'}, {label: 'personInformationManage', url: 'person-information'}, {label: 'associateUser'}]
        }
      },
      // 排班管理
      {
        path: 'workforce-management',
        component: WorkforceManagementComponent,
        data: {
          breadcrumb: [{label: 'scheduleManage'}, {label: 'shiftManagement'}, {label: 'workforceManagement'}]
        }
      },
      {
        // 新增或编辑排班
        path: 'workforce-management/:type',
        component: WorkforceManagementDetailComponent,
        data: {
          breadcrumb: [{label: 'scheduleManage'}, {label: 'shiftManagement'}, {label: 'workforceManagement', url: 'workforce-management'}, {label: 'workforce'}]
        }
      },
      {
        // 查看排班
        path: 'view-scheduling',
        component: ViewSchedulingComponent,
        data: {
          breadcrumb: [{label: 'scheduleManage'}, {label: 'shiftManagement'}, {label: 'workforceManagement', url: 'workforce-management'}, {label: 'viewScheduling'}]
        }
      },
      {
        // 班次管理
        path: 'work-shift',
        component: WorkShiftComponent,
        data: {
          breadcrumb: [{label: 'scheduleManage'}, {label: 'shiftManagement'}, {label: 'workShift'}]
        }
      },
      {
        // 新增或编辑班次
        path: 'work-shift/:type',
        component: ShiftDetailComponent,
        data: {
          breadcrumb: [{label: 'scheduleManage'}, {label: 'shiftManagement'}, {label: 'workShift', url: 'work-shift'}, {label: 'shift'}]
        }
      },
      {
        // 班组管理
        path: 'team-management',
        component: TeamManagementComponent,
        data: {
          breadcrumb: [{label: 'scheduleManage'}, {label: 'shiftManagement'}, {label: 'teamManagement'}]
        }
      },
      {
        // 新增或编辑班组
        path: 'team-management/:type',
        component: TeamManagementDetailComponent,
        data: {
          breadcrumb: [{label: 'scheduleManage'}, {label: 'shiftManagement'}, {label: 'teamManagement', url: 'team-management'}, {label: 'team'}]
        }
      },
    ]
  }
];
