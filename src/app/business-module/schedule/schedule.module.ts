import { NgModule } from '@angular/core';
import {ROUTER_CONFIG} from './schedule.routes';
import {CoreModule} from '../../core-module/core-module.module';
import { RouterModule } from '@angular/router';
import {SharedModule} from '../../shared-module/shared-module.module';
import { PersonInformationComponent } from './schedule-manage/person-information/person-information.component';
import {ScheduleComponent} from './schedule.component';
import { ScheduleApiService } from './share/service/schedule-api.service';
import { WorkforceManagementComponent } from './schedule-manage/workforce-management/workforce-management.component';
import { ScheduleCalendarComponent } from './schedule-manage/workforce-management/schedule-calendar/schedule-calendar.component';
import { PersonDetailComponent } from './schedule-manage/person-information/person-detail/person-detail.component';
import { AssociateUserComponent } from './schedule-manage/person-information/associate-user/associate-user.component';
import { UserListSelectorComponent } from './schedule-manage/person-information/user-list-selector/user-list-selector.component';
import { WorkShiftComponent } from './schedule-manage/work-shift/work-shift.component';
import { ShiftDetailComponent } from './schedule-manage/work-shift/shift-detail/shift-detail.component';
import { TeamManagementComponent } from './schedule-manage/team-management/team-management.component';
import { TeamManagementDetailComponent } from './schedule-manage/team-management/team-management-detail/team-management-detail.component';
import { TeamMembersComponent } from './share/component/team-members/team-members.component';
import { WorkforceManagementDetailComponent } from './schedule-manage/workforce-management/workforce-management-detail/workforce-management-detail.component';
import { TeamNameSelectorComponent } from './share/component/team-name-selector/team-name-selector.component';
import { ViewSchedulingComponent } from './schedule-manage/workforce-management/view-scheduling/view-scheduling.component';

@NgModule({
  declarations: [ScheduleComponent,
    PersonInformationComponent,
    PersonDetailComponent,
    AssociateUserComponent,
    UserListSelectorComponent,
    WorkforceManagementComponent,
    ScheduleCalendarComponent,
    WorkShiftComponent,
    ShiftDetailComponent,
    TeamManagementComponent,
    TeamManagementDetailComponent,
    TeamMembersComponent,
    WorkforceManagementDetailComponent,
    TeamNameSelectorComponent,
    ViewSchedulingComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(ROUTER_CONFIG),
    CoreModule
  ],
  providers: [ScheduleApiService]
})
export class ScheduleModule { }
