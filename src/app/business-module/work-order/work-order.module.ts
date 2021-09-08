import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared-module/shared-module.module';
import {RouterModule} from '@angular/router';
import {ROUTER_CONFIG} from './work-order.routes';
import {WorkOrderComponent} from './work-order.component';
import {InspectionWorkOrderComponent} from './inspection/inspection-work-order.component';
import {InspectionTaskComponent} from './inspection/task/inspection-task.component';
import {InspectionWorkOrderDetailComponent} from './inspection/detail/inspection-work-order-detail.component';
import {UnfinishedInspectionWorkOrderComponent} from './inspection/unfinished';
import {FinishedInspectionWorkOrderComponent} from './inspection/finished/finished-inspection-work-order.component';
import {InspectionTaskDetailComponent} from './inspection/task-detail/inspection-task-detail.component';
import {NgxEchartsModule} from 'ngx-echarts';
import {ClearBarrierWorkOrderComponent} from './clear-barrier/clear-barrier-work-order.component';
import {UnfinishedClearBarrierWorkOrderComponent} from './clear-barrier/unfinished/unfinished-clear-barrier-work-order.component';
import {HistoryClearBarrierWorkOrderComponent} from './clear-barrier/history/history-clear-barrier-work-order.component';
import {ClearBarrierWorkOrderDetailComponent} from './clear-barrier/detail/clear-barrier-work-order-detail.component';
import {UnfinishedClearBarrierWorkOrderTableComponent} from './clear-barrier/unfinished/table';
import {HistoryClearBarrierWorkOrderTableComponent} from './clear-barrier/history/table';
import {InspectionTemplateComponent} from './templates/inspection-template/inspection-template.component';
import {InspectionTemplateDetailComponent} from './templates/template-detail/inspection-template-detail.component';
import {UnfinishedDetailClearBarrierWorkOrderComponent} from './clear-barrier/unfinished-detail/unfinished-detail-clear-barrier-work-order.component';
import {UnfinishedDetailInspectionWorkOrderComponent} from './inspection/unfinished-detail/unfinished-detail-inspection-work-order.component';
import {SelectInspectionTemplateComponent} from './share/component/select-inspection-template/select-inspection-template.component';
import {TemplatesComponent} from './templates/templates.component';
import {NgxIntlTelInputModule} from 'ngx-intl-tel-input';
import {InspectionObjectComponent} from './share/component/inspection-object/inspection-object.component';
import {TransferWorkerOrderComponent} from './share/component/transfer-worker-order/transfer-worker-order.component';
import {WorkOrderCommonServiceUtil} from './share/util/work-order-common-service.util';
import {InspectionWorkOrderService} from './share/service/inspection';
import {ClearBarrierWorkOrderService} from './share/service/clear-barrier';
import { RelevanceFaultComponent } from './share/component/relevance-fault/relevance-fault.component';
import {PictureApiService} from '../facility/share/service/picture/picture-api.service';
import { UnfinishedInstallComponent } from './installation/unfinished-install/unfinished-install.component';
import { FinishedInstallComponent } from './installation/finished-install/finished-install.component';
import { InstallationComponent } from './installation/installation.component';
import { DemolitionComponent } from './demolition/demolition.component';
import { FinishDemolitionComponent } from './demolition/finished-demolition/finish-demolition.component';
import { UnfinishedDemolitionComponent } from './demolition/unfinished-demolition/unfinished-demolition.component';
import { AlarmConfirmComponent } from './alarm-confirm/alarm-confirm.component';
import { FinishedAlarmConfirmComponent } from './alarm-confirm/finished-alarm-confirm/finished-alarm-confirm.component';
import { UnfinishedAlarmConfirmComponent } from './alarm-confirm/unfinished-alarm-confirm/unfinished-alarm-confirm.component';
import { InstallDetailComponent } from './installation/install-detail/install-detail.component';
import { AlarmConfirmDetailComponent } from './alarm-confirm/alarm-confirm-detail/alarm-confirm-detail.component';
import { InstallOrderViewComponent } from './installation/install-order-view/install-order-view.component';
import { AlarmConfirmViewComponent } from './alarm-confirm/alarm-confirm-view/alarm-confirm-view.component';
import { SelectProductModelComponent } from './share/component/select-product-model/select-product-model.component';
import {AlarmConfirmWorkOrderService} from './share/service/alarm-confirm';
import { ChargebackWorkOrderComponent } from './share/component/chargeback-work-order/chargeback-work-order.component';
import {InstallWorkOrderService} from './share/service/installation';
import { InstallationTableComponent } from './installation/installation-table/installation-table.component';
import {SelectDeviceInfoComponent} from './share/component/select-device-info/select-device-info.component';

// -----------------------------------------拆除工单---------------------------------
import { DismantleBarrierWorkOrderComponent } from './dismantle-barrier/dismantle-barrier-work-order.component';
import { UnfinishedDismantleBarrierWorkOrderComponent } from './dismantle-barrier/unfinished/unfinished-dismantle-barrier-work-order.component';
import { UnfinishedDismantleBarrierWorkOrderTableComponent } from './dismantle-barrier/unfinished/table';
import { UnfinishedDetailDismantleBarrierWorkOrderComponent } from './dismantle-barrier/unfinished-detail/unfinished-detail-dismantle-barrier-work-order.component';
import { DismantleBarrierWorkOrderDetailComponent } from './dismantle-barrier/detail/dismantle-barrier-work-order-detail.component';
import { HistoryDismantleBarrierWorkOrderComponent } from './dismantle-barrier/history/history-dismantle-barrier-work-order.component';
import { HistoryDismantleBarrierWorkOrderTableComponent } from './dismantle-barrier/history/table';
import { DismantleBarrierWorkOrderService } from './share/service/dismantle-barrier';
import { DismantleDeviceNameComponent } from './dismantle-barrier/components/device-name/dismantle-device-name.component';
import { FormDismantleTypeComponent } from './dismantle-barrier/components/form-dismantle-type/form-dismantle-type.component';
import { WarnTabComponent } from './dismantle-barrier/components/form-dismantle-type/coomponents/warn-tab/warn-tab.component';
import { TroubleTabComponent } from './dismantle-barrier/components/form-dismantle-type/coomponents/trouble-tab/trouble-tab.component';
import { DismantlePonitModelComponent } from './dismantle-barrier/components/dismantle-ponit-model/dismantle-ponit-model.component';
import { EquipmentApiService } from '../facility/share/service/equipment/equipment-api.service';
import { FacilityApiService } from '../facility/share/service/facility/facility-api.service';
import { TroubleService } from '../trouble/share/service';
import { RemoveDeviceComponent } from './dismantle-barrier/unfinished-detail/remove-device/remove-device.component';
import { RemoveEquipmentComponent } from './dismantle-barrier/unfinished-detail/remove-equipment/remove-equipment.component';
// -----------------------------------------拆除工单---------------------------------

@NgModule({
  declarations: [
    WorkOrderComponent,
    ClearBarrierWorkOrderComponent,
    UnfinishedClearBarrierWorkOrderComponent,
    HistoryClearBarrierWorkOrderComponent,
    ClearBarrierWorkOrderDetailComponent,
    InspectionWorkOrderComponent,
    InspectionTaskComponent,
    InspectionWorkOrderDetailComponent,
    UnfinishedInspectionWorkOrderComponent,
    FinishedInspectionWorkOrderComponent,
    InspectionTaskDetailComponent,
    UnfinishedClearBarrierWorkOrderTableComponent,
    HistoryClearBarrierWorkOrderTableComponent,
    InspectionTemplateComponent,
    InspectionTemplateDetailComponent,
    UnfinishedDetailClearBarrierWorkOrderComponent,
    UnfinishedDetailInspectionWorkOrderComponent,
    SelectInspectionTemplateComponent,
    TemplatesComponent,
    InspectionObjectComponent,
    TransferWorkerOrderComponent,
    RelevanceFaultComponent,
    UnfinishedInstallComponent,
    FinishedInstallComponent,
    InstallationComponent,
    DemolitionComponent,
    FinishDemolitionComponent,
    UnfinishedDemolitionComponent,
    AlarmConfirmComponent,
    FinishedAlarmConfirmComponent,
    UnfinishedAlarmConfirmComponent,
    InstallDetailComponent,
    AlarmConfirmDetailComponent,
    InstallOrderViewComponent,
    AlarmConfirmViewComponent,
    SelectProductModelComponent,
    ChargebackWorkOrderComponent,
    InstallationTableComponent,
    SelectDeviceInfoComponent,
    DismantleBarrierWorkOrderComponent,
    UnfinishedDismantleBarrierWorkOrderComponent,
    DismantleBarrierWorkOrderDetailComponent,
    UnfinishedDetailDismantleBarrierWorkOrderComponent,
    HistoryDismantleBarrierWorkOrderComponent,
    UnfinishedDismantleBarrierWorkOrderTableComponent,
    HistoryDismantleBarrierWorkOrderTableComponent,
    DismantleDeviceNameComponent,
    FormDismantleTypeComponent,
    WarnTabComponent,
    TroubleTabComponent,
    DismantlePonitModelComponent,
    RemoveDeviceComponent,
    RemoveEquipmentComponent,
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(ROUTER_CONFIG),
        SharedModule,
        NgxEchartsModule,
        NgxIntlTelInputModule,
    ],
  exports: [],
  providers: [
    WorkOrderCommonServiceUtil, ClearBarrierWorkOrderService, InspectionWorkOrderService, PictureApiService,
    AlarmConfirmWorkOrderService, InstallWorkOrderService, DismantleBarrierWorkOrderService,
    EquipmentApiService,
    FacilityApiService,
    TroubleService,
  ]
})
export class WorkOrderModule {
}
