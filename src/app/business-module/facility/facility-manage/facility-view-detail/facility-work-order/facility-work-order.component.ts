import {NzI18nService} from 'ng-zorro-antd';
import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {ObjectTypeEnum} from '../../../../../core-module/enum/facility/object-type.enum';
import {DEVICE_SERVER} from '../../../../../core-module/api-service/api-common.config';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {WorkOrderTypeEnum} from '../../../../../core-module/enum/work-order-type.enum';
import {WorkOrderLanguageInterface} from '../../../../../../assets/i18n/work-order/work-order.language.interface';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {PicResourceEnum} from '../../../../../core-module/enum/picture/pic-resource.enum';
import {WorkOrderCommonComponent} from '../../../common-component/work-order-common/work-order-common.component';
import {SessionUtil} from '../../../../../shared-module/util/session-util';
import {QueryRealPicModel} from '../../../../../core-module/model/picture/query-real-pic.model';

/**
 * 设施工单
 */
@Component({
  selector: 'app-facility-work-order',
  templateUrl: './facility-work-order.component.html',
  styleUrls: ['./facility-work-order.component.scss']
})
export class FacilityWorkOrderComponent implements OnInit, OnDestroy {
  // 设施id
  @Input()
  public deviceId: string;
  // 巡检工单公共组件
  @ViewChild('workOrderInspectionCommon') workOrderInspectionCommon: WorkOrderCommonComponent;
  // 销障工单公共组件
  @ViewChild('workOrderClearBarrierCommon') workOrderClearBarrierCommon: WorkOrderCommonComponent;
  // 安装工单
  @ViewChild('workOrderInstallCommon') workOrderInstallCommon: WorkOrderCommonComponent;
  // 告警确认工单
  @ViewChild('workOrderAlarmConfirmCommon') workOrderAlarmConfirmCommon: WorkOrderCommonComponent;
  @ViewChild('workOrderRemoveCommon') workOrderRemoveCommon: WorkOrderCommonComponent;
  // 关联告警模版
  @ViewChild('refAlarmTemp') refAlarmTemp: HTMLDocument;
  // 设备国际化
  public language: FacilityLanguageInterface;
  // 工单类型枚举
  public workOrderTypeEnum = WorkOrderTypeEnum;
  // 工单国际化
  public workOrderLanguage: WorkOrderLanguageInterface;
  //  公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 更多路由条状路径
  private moreRouter = 'business/work-order/inspection/unfinished-list';
  // 设施类型
  public facilityType = ObjectTypeEnum.facility;

  // 查询图片模型
  public queryRealPicModel = new QueryRealPicModel(this.deviceId, ObjectTypeEnum.facility, PicResourceEnum.workOrder,
    '', `${DEVICE_SERVER}/picRelationInfo/getPicDetail`);

  /**
   * 构造器
   */
  constructor(
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $router: Router) {
  }

  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.workOrderLanguage = this.$nzI18n.getLocaleData(LanguageEnum.workOrder);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
  }

  /**
   *  组件销毁
   */
  public ngOnDestroy(): void {
    this.workOrderInspectionCommon = this.workOrderClearBarrierCommon
        = this.workOrderInstallCommon = this.workOrderAlarmConfirmCommon =   null;
    this.workOrderRemoveCommon =   null;
  }
  /**
   * 判断是否有操作权限
   */
  public checkHasRole(code: string): boolean {
    return SessionUtil.checkHasRole(code);
  }

  /**
   *  点击巡检工单tab 事件
   */
  public onClickTab(type: WorkOrderTypeEnum = WorkOrderTypeEnum.inspection): void {
    if (type === WorkOrderTypeEnum.inspection) {
      this.workOrderInspectionCommon.initTableConfig(); // 初始化巡检工单表格
      this.workOrderInspectionCommon.refreshInspectionData(); // 查询巡检工单列表数据
      this.moreRouter = 'business/work-order/inspection/unfinished-list';
    } else if(type === WorkOrderTypeEnum.clear) {
      this.workOrderClearBarrierCommon.initClearTableConfig(); // 初始化销障工单表格参数
      this.workOrderClearBarrierCommon.refreshClearBarrier(); // 查询消障工单列表
      this.moreRouter = 'business/work-order/clear-barrier/unfinished-list';
    } else if (type === WorkOrderTypeEnum.install) {
      // 初始化安装工单表格参数
      this.workOrderInstallCommon.initInstallTableConfig();
      // 查询安装工单列表数据
      this.workOrderInstallCommon.refreshInstallData();
      this.moreRouter = 'business/work-order/installation/unfinished-list';
    } else if (type === WorkOrderTypeEnum.remove) {
      // 初始化拆除工单表格参数
      this.workOrderRemoveCommon.initRemoveTableConfig();
      // 查询拆除工单列表数据
      this.workOrderRemoveCommon.refreshRemove();
      this.moreRouter = 'business/work-order/dismantle-barrier/unfinished-list';
    } else {
      // 初始化告警确认工单表格参数
      this.workOrderAlarmConfirmCommon.initAlarmConfirmTableConfig();
      // 查询告警确认工单的列表数据
      this.workOrderAlarmConfirmCommon.refreshAlarmConfirmData();
      this.moreRouter = 'business/work-order/alarm-confirm/unfinished-list';
    }
  }

  /**
   *  显示更多工单
   */
  public onClickShowMoreWorkOrder(): void {
    const queryParams = {queryParams: {deviceId: this.deviceId}};
    this.$router.navigate([this.moreRouter], queryParams).then();
  }
}
