import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlarmComponent } from './alarm.component';
import { SharedModule } from '../../shared-module/shared-module.module';
import { RouterModule } from '@angular/router';
import { ROUTER_CONFIG } from './alarm.routes';
import { CurrentAlarmComponent } from './alarm-manage/current-alarm/current-alarm.component';
import { HistoryAlarmComponent } from './alarm-manage/history-alarm/history-alarm.component';
import { AlarmSetComponent } from './alarm-manage/alarm-set/alarm-set.component';
import { CurrentAlarmSetComponent } from './alarm-manage/alarm-set/current-alarm-set/current-alarm-set.component';
import { HistoryAlarmSetComponent } from './alarm-manage/alarm-set/history-alarm-set/history-alarm-set.component';
import { AlarmLevelSetComponent } from './alarm-manage/alarm-set/current-alarm-set/alarm-level-set/alarm-level-set.component';
import {AlarmManageComponent} from './alarm-manage/alarm-manage.component';
import { AlarmFiltrationComponent } from './alarm-manage/alarm-set/alarm-filtration/alarm-filtration.component';
import { AlarmFiltrationAddComponent } from './alarm-manage/alarm-set/alarm-filtration/alarm-filtration-add/alarm-filtration-add.component';
import { AlarmRemoteNotificationComponent } from './alarm-manage/alarm-set/alarm-remote-notification/alarm-remote-notification.component';
import { AlarmWorkOrderComponent } from './alarm-manage/alarm-set/alarm-work-order/alarm-work-order.component';
import { RemoteAddComponent } from './alarm-manage/alarm-set/alarm-remote-notification/remote-add/remote-add.component';
import { WorkOrderAddComponent } from './alarm-manage/alarm-set/alarm-work-order/work-order-add/work-order-add.component';
import { CurrentAlarmAddComponent } from './alarm-manage/current-alarm/current-alarm-add/current-alarm-add.component';
import { TemplateTableComponent } from './alarm-manage/current-alarm/template-table/template-table.component';
// tslint:disable-next-line:max-line-length
import { AlarmFiltrationRuleComponent } from './alarm-manage/alarm-set/alarm-filtration/alarm-filtration-rule/alarm-filtration-rule.component';
import { DiagnoseDetailsComponent } from './alarm-manage/current-alarm/diagnose-details/diagnose-details.component';
import {NgxEchartsModule} from 'ngx-echarts';
import { AlarmAnalysisComponent } from './alarm-manage/current-alarm/diagnose-details/alarm-analysis/alarm-analysis.component';
import { AlarmOperationComponent } from './alarm-manage/current-alarm/diagnose-details/alarm-operation/alarm-operation.component';
import { CorrelationAlarmComponent } from './alarm-manage/current-alarm/diagnose-details/correlation-alarm/correlation-alarm.component';
import { AlarmImgViewComponent } from './alarm-manage/current-alarm/diagnose-details/alarm-img-view/alarm-img-view.component';
// tslint:disable-next-line:max-line-length
import { RedeployInfoComponent } from './alarm-manage/current-alarm/diagnose-details/redeploy-info/redeploy-info.component';
import { AlarmBasicInfoComponent } from './alarm-manage/current-alarm/diagnose-details/alarm-basic-info/alarm-basic-info.component';
import { AddAlarmSetComponent } from './alarm-manage/alarm-set/current-alarm-set/add-alarm-set/add-alarm-set.component';
import {AlarmService} from './share/service/alarm.service';
import {CorrelationRuleComponent} from './alarm-manage/common-components/correlation-rule/correlation-rule.component';
import {DynamicCorrelationRuleComponent} from './alarm-manage/common-components/dynamic-correlation-rule/dynamic-correlation-rule.component';
import {AlarmCorrelationSettingComponent} from './alarm-manage/alarm-set/alarm-correlation-setting/alarm-correlation-setting.component';
import { AlarmWarningSettingComponent } from './alarm-manage/alarm-set/alarm-warning-setting/alarm-warning-setting.component';
import { AddAlarmWarningSetComponent } from './alarm-manage/alarm-set/alarm-warning-setting/add-alarm-warning-set/add-alarm-warning-set.component';
import { DynamicCorrelationRuleDetailComponent } from './alarm-manage/common-components/dynamic-correlation-rule/dynamic-correlation-rule-detail/dynamic-correlation-rule-detail.component';
import { DynamicRuleViewResultComponent } from './alarm-manage/common-components/dynamic-correlation-rule/dynamic-rule-view-result/dynamic-rule-view-result.component';
import { AddCorrelationAnalysisComponent } from './alarm-manage/common-components/correlation-rule/add-correlation-analysis/add-correlation-analysis.component';
import { SelectAlarmComponent } from './alarm-manage/common-components/correlation-rule/select-alarm/select-alarm.component';
import { RuleConditionComponent } from './alarm-manage/common-components/correlation-rule/rule-condition/rule-condition.component';
import { OtherSettingComponent } from './alarm-manage/common-components/correlation-rule/other-setting/other-setting.component';
import { ViewRuleComponent } from './alarm-manage/common-components/correlation-rule/view-rule/view-rule.component';

@NgModule({
    declarations: [AlarmComponent, CurrentAlarmComponent, HistoryAlarmComponent,
        AlarmManageComponent,
        AlarmSetComponent, CurrentAlarmSetComponent,
        HistoryAlarmSetComponent, AlarmLevelSetComponent,
        AlarmFiltrationComponent, AlarmFiltrationAddComponent,
        AlarmRemoteNotificationComponent, AlarmWorkOrderComponent, RemoteAddComponent, WorkOrderAddComponent,
        CurrentAlarmAddComponent, TemplateTableComponent, AlarmFiltrationRuleComponent, DiagnoseDetailsComponent,
        AlarmAnalysisComponent, AlarmOperationComponent, CorrelationAlarmComponent, AlarmImgViewComponent,
        RedeployInfoComponent, AlarmBasicInfoComponent, AddAlarmSetComponent, AlarmCorrelationSettingComponent,
        CorrelationRuleComponent, DynamicCorrelationRuleComponent, AlarmWarningSettingComponent, AddAlarmWarningSetComponent,
        DynamicCorrelationRuleDetailComponent, DynamicRuleViewResultComponent, AddCorrelationAnalysisComponent,
        DynamicRuleViewResultComponent, AddCorrelationAnalysisComponent, SelectAlarmComponent,
      RuleConditionComponent,
      OtherSettingComponent,
      ViewRuleComponent
    ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(ROUTER_CONFIG),
    NgxEchartsModule,
  ],
    exports: [
    ],
    providers: [AlarmService]
})
export class AlarmModule {
}
