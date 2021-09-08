import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzI18nService, NzModalService } from 'ng-zorro-antd';
import { CommonLanguageInterface } from '../../../../../assets/i18n/common/common.language.interface';
import { EnergyLanguageInterface } from '../../../../../assets/i18n/energy/energy.language.interface';
import { LanguageEnum } from '../../../../shared-module/enum/language.enum';
import { QueryConditionModel } from '../../../../shared-module/model/query-condition.model';
import { TableConfigModel } from '../../../../shared-module/model/table-config.model';
import { SessionUtil } from '../../../../shared-module/util/session-util';
import { EnergyApiService } from '../../share/service/energy/energy-api.service';
import { ResultCodeEnum } from '../../../../shared-module/enum/result-code.enum';
import { ResultModel } from '../../../../shared-module/model/result.model';
import { EnergyNodesDetailsModel } from '../../share/model/energy-nodes-detail.model';
import { FiLinkModalService } from '../../../../shared-module/service/filink-modal/filink-modal.service';
import { ProjectTypeEnmu } from '../../share/enum/project.enum';
import { CommonUtil } from '../../../../shared-module/util/common-util';
import { switchPageEnum } from '../../share/enum/energy-config.enum';
import {
  EquipmentStatusEnum,
  EquipmentTypeEnum,
} from '../../../../core-module/enum/equipment/equipment.enum';

@Component({
  selector: 'app-details-nodes',
  templateUrl: './details-nodes.component.html',
  styleUrls: ['./details-nodes.component.scss'],
})
export class DetailsNodesComponent implements OnInit {
  equipmentDetailInfo: any = {};
  deviceId;
  pageLoading: boolean = false;
  strategyTableSet = [];
  /** nodes-statistic 组件需要的字段 */
  statisticEquipmentId;
  energyDetailsModel: EnergyNodesDetailsModel = new EnergyNodesDetailsModel();
  // 设备状态枚举
  public equipmentStatusEnum = EquipmentStatusEnum;

  // 传递给组件的 table 数据
  tranDeviceTableData: any = [];
  tranEquipmentTableData: any = [];
  tranLoopTableData: any = [];
  // 判断是哪个页面调用查看组件
  switchPage = switchPageEnum;
  // 项目类型枚举
  projectTypeEnum = ProjectTypeEnmu;
  // 设备类型枚举
  public equipmentTypeEnum = EquipmentTypeEnum;
  // 表格配置
  public strategyTableConfig: TableConfigModel;
  // 列表查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  language: EnergyLanguageInterface;
  // 通用的提示语句 国际化组件
  private commonLanguage: CommonLanguageInterface;
  // 国际化前缀枚举
  public languageEnum = LanguageEnum;
  constructor(
    private $nzI18n: NzI18nService,
    private $modalService: NzModalService,
    private $energyApiService: EnergyApiService,
    private $active: ActivatedRoute,
    private router: Router,
    public $message: FiLinkModalService,
  ) {
    this.commonLanguage = $nzI18n.getLocaleData(LanguageEnum.common);
  }

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.energy);
    this.queryEnergyDetailById();
  }
  // 获取数据
  queryEnergyDetailById() {
    this.$active.queryParams.subscribe((params) => {
      const { id } = params;
      this.energyDetailsModel.energyConsumptionNodeId = id;
      this.pageLoading = true;
      this.$energyApiService
        .energyNodesQueryById_API({
          energyConsumptionNodeId: id,
        })
        .subscribe(
          (result: ResultModel<any>) => {
            console.log(result, 'result');
            this.pageLoading = false;
            if (result.code === ResultCodeEnum.success) {
              this.equipmentDetailInfo = result.data.equipmentInfo;
              if (result.data && result.data.equipmentInfo && result.data.energyConsumptionNode) {
                const getResult = Object.assign(
                  {},
                  result.data.areaInfo,
                  result.data.energyConsumptionNode,
                  result.data.equipmentInfo,
                );
                this.energyDetailsModel = getResult;                
                const createTime = result.data.energyConsumptionNode.createTime;
                this.energyDetailsModel.ctime = createTime ? new Date(createTime).getTime() : null;
                this.energyDetailsModel.utime = result.data.utime;
                this.energyDetailsModel.project = result.data.energyConsumptionNode.project;
                this.energyDetailsModel.projectName = result.data.energyConsumptionNode.projectName;
                this.energyDetailsModel.remarks = result.data.energyConsumptionNode.remarks;
                // 设施
                this.tranDeviceTableData = result.data.energyConsumptionNodeDeviceInfoList.map(
                  (item) => (item.deviceInfo ? item.deviceInfo : []),
                );

                // 设备
                this.tranEquipmentTableData = result.data.energyConsumptionNodeEquipmentInfoList.map(
                  (item) => (item.equipmentInfo ? item.equipmentInfo : []),
                );

                // 回路
                this.tranLoopTableData = result.data.energyConsumptionNodeLoopInfoList.map((item) =>
                  item.loopInfo ? item.loopInfo : [],
                );
                this.statisticEquipmentId = result.data.energyConsumptionNode.equipmentId;
              }
            } else {
              this.$message.error(result.msg);
            }
          },
          () => (this.pageLoading = false),
        );
    });
  }
  /**
   * 获取设备状态图标
   */
  public getEquipmentStatusIconClass(status: EquipmentStatusEnum): string {
    const statusIcon = 'icon-fiLink-l iconfont';
    const statusIconClass = CommonUtil.getEquipmentStatusIconClass(status);
    return `icon-fiLink-5 ${statusIcon} ${statusIconClass.iconClass}`;
  }
  /**
   * 获取设备状态背景色
   */
  public getEquipmentStatusBg(status: EquipmentStatusEnum): string {
    const statusIconClass = CommonUtil.getEquipmentStatusIconClass(status);
    return statusIconClass.bgColor;
  }
  /**
   * 获取设备图标白色
   */
  public getEquipmentIconClass(type: EquipmentTypeEnum) {
    const facilityType = CommonUtil.getEquipmentIconClassName(type) || 'all-facility';
    return `icon-fiLink-5 iconfont fiLink-${facilityType.slice(0, facilityType.lastIndexOf(' '))}`;
  }
  // 删除操作
  public handleDelete(): void {
    this.$modalService.confirm({
      nzTitle: this.language.strategyInfo.deleteHandle,
      nzContent: `<span>${this.language.strategyInfo.confirmDelete}</span>`,
      nzOkText: this.commonLanguage.cancel,
      nzOkType: 'danger',
      nzMaskClosable: false,
      nzOnOk: () => {},
      nzCancelText: this.commonLanguage.confirm,
      nzOnCancel: () => {
        this.pageLoading = true;
        this.$energyApiService
          .energyNodesDelete_API([this.energyDetailsModel.energyConsumptionNodeId])
          .subscribe(
            (result: ResultModel<string>) => {
              this.pageLoading = false;
              if (result.code === ResultCodeEnum.success) {
                this.$message.success(this.language.deleteEnergyNodesSuccess);
                this.router.navigateByUrl('/business/energy/energy-nodes');
              } else {
                this.$message.error(result.msg);
              }
            },
            () => {
              this.pageLoading = false;
            },
          );
      },
    });
  }
  // 编辑
  handleEdit() {
    this.router
      .navigate(['/business/energy/energy-nodes/update'], {
        queryParams: { id: this.energyDetailsModel.energyConsumptionNodeId },
      })
      .then();
  }
  refreshData() {}

  // 判断是否有操作权限
  public checkHasRole(code: string): boolean {
    return SessionUtil.checkHasRole(code);
  }
  // 点击巡检工单tab 事件
  // 1 采集设施  2 采集设备  3 采集回路
  public onClickTab(): void {
    // if (type === 1) {
    //     this.deviceTab.refreshData() // 查询
    // } else if (type === 2) {
    //     this.equipmentTab.refreshData() // 查询
    // } else if (type === 3) {
    //     this.loopTab.refreshData() // 查询
    // }
  }
}
