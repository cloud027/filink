import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ROUTER_CONFIG } from './trouble.routes';
import { TroubleComponent } from './trouble.component';
import {SharedModule} from '../../shared-module/shared-module.module';
import { TroubleListComponent } from './trouble-manage/trouble-list/trouble-list.component';
import { TroubleDetailComponent } from './trouble-manage/trouble-list/trouble-detail/trouble-detail.component';
import { TroubleAddComponent } from './trouble-manage/trouble-list/trouble-add/trouble-add.component';
import { FaultDetailsComponent } from './trouble-manage/trouble-list/trouble-detail/fault-details/fault-details.component';
import { FaultOperationComponent } from './trouble-manage/trouble-list/trouble-detail/fault-operation/fault-operation.component';
import { FaultExperienceComponent } from './trouble-manage/trouble-list/trouble-detail/fault-experience/fault-experience.component';
import {NgxEchartsModule} from 'ngx-echarts';
// tslint:disable-next-line:max-line-length
import { ResourceAllocationComponent } from './trouble-manage/trouble-list/trouble-detail/resource-allocation/resource-allocation.component';
// tslint:disable-next-line:max-line-length
import { HistoryProcessRecordTableComponent } from './trouble-manage/trouble-list/trouble-detail/history-process-record-table/history-process-record-table.component';
import { TroubleImgViewComponent } from './trouble-manage/trouble-list/trouble-detail/trouble-img-view/trouble-img-view.component';
import { TroubleAssignComponent } from './trouble-manage/trouble-list/trouble-assign/trouble-assign.component';
import { TroubleFlowComponent } from './trouble-manage/trouble-list/trouble-flow/trouble-flow.component';
import { MaterialListComponent } from './trouble-manage/components/material-list/material-list.component';
import { TroubleHistoryRecordComponent } from './trouble-manage/components/trouble-history-record/trouble-history-record.component';
import {TroubleService} from './share/service';
// ------------------------------------------故障统计----------------------------------------
import { EchartColumnComponent } from './trouble-statistic/components/echart-column/echart-column.component';
import { TroubleStatisticComponent } from './trouble-statistic/trouble-statistic.component';
// ------------------------------------------故障统计----------------------------------------
@NgModule({
  declarations: [
    TroubleComponent,
    TroubleListComponent,
    TroubleDetailComponent,
    TroubleAddComponent,
    FaultDetailsComponent,
    FaultOperationComponent,
    FaultExperienceComponent,
    ResourceAllocationComponent,
    HistoryProcessRecordTableComponent,
    TroubleImgViewComponent,
    TroubleAssignComponent,
    TroubleFlowComponent,
    MaterialListComponent,
    TroubleHistoryRecordComponent,
    TroubleStatisticComponent,
    EchartColumnComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(ROUTER_CONFIG),
    NgxEchartsModule,
  ],
  exports: [],
  providers: [TroubleService]
})
export class TroubleModule { }
