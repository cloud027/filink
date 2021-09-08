import {Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {FacilityForCommonService} from '../../../../../core-module/api-service/facility';
import {TableComponent} from '../../../../../shared-module/component/table/table.component';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {FilterCondition, PageCondition, QueryConditionModel} from '../../../../../shared-module/model/query-condition.model';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {PageSizeEnum} from '../../../../../shared-module/enum/page-size.enum';
import {DeviceDetailStatusEnum, DeviceTypeEnum} from '../../../../../core-module/enum/facility/facility.enum';
import {EquipmentStatusEnum, EquipmentTypeEnum} from '../../../../../core-module/enum/equipment/equipment.enum';
import {EquipmentListModel} from '../../../../../core-module/model/equipment/equipment-list.model';

/**
 * 设施详情挂载设备列表
 */
@Component({
  selector: 'app-mount-equipment',
  templateUrl: './mount-equipment.component.html',
  styleUrls: ['./mount-equipment.component.scss']
})
export class MountEquipmentComponent implements OnInit, OnDestroy {
  // 设施id
  @Input()
  public deviceId: string;
  @Input()
  public deviceType: string;
  @Input()
  public deviceStatus: string;
  // 列表实例
  @ViewChild('tableComponent') public tableComponent: TableComponent;
  // 设备状态template
  @ViewChild('equipmentStatusTemplate') public equipmentStatusTemplate: TemplateRef<Element>;
  // 设备类型template
  @ViewChild('equipmentTypeTemplate') public equipmentTypeTemplate: TemplateRef<Element>;
  // 列表数据
  public dataSet: Array<EquipmentListModel> = [];
  // 列表分页实体
  public pageBean: PageModel = new PageModel(PageSizeEnum.sizeFive);
  // 列表配置
  public tableConfig: TableConfigModel;
  // 列表查询条件
  public queryCondition = new QueryConditionModel();
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 公共语言包
  public commonLanguage: CommonLanguageInterface;
  // 设备类型枚举
  public equipTypeEnum = EquipmentTypeEnum;
  // 设备状态枚举
  public equipStatusEnum = EquipmentStatusEnum;
  // 国际化类型枚举
  public languageEnum = LanguageEnum;
  constructor(
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $facilityCommonService: FacilityForCommonService,
    private $router: Router
  ) {
  }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.initTableConfig();
    // 设置分页每页查询五条
    const filterCondition = new FilterCondition('deviceId', OperatorEnum.in, [this.deviceId]);
    this.queryCondition.filterConditions.push(filterCondition);
    this.queryCondition.pageCondition = new PageCondition(1, PageSizeEnum.sizeFive);
    this.refreshData();
  }

  /**
   * 获取当期设施详情设备列表
   */
  public refreshData(): void {
    if(this.deviceStatus === DeviceDetailStatusEnum.dismantled) {
      // 获取设施详情页面挂载设备概览列表
      this.$facilityCommonService.equipmentListByPageForListPageNew(this.queryCondition)
        .subscribe((result: ResultModel<Array<EquipmentListModel>>) => {
          this.tableConfig.isLoading = false;
          if (result.code === ResultCodeEnum.success) {
            this.dataSet = result.data || [];
            this.dataSet.forEach(item => {
              // 设置状态样式
              const iconStyle = CommonUtil.getEquipmentStatusIconClass(item.equipmentStatus, 'list');
              item.statusIconClass = iconStyle.iconClass;
              item.statusColorClass = iconStyle.colorClass;
              // 设置设备类型的图标
              item.iconClass = CommonUtil.getEquipmentIconClassName(item.equipmentType);
            });
            this.pageBean.Total = result.totalCount;
          } else {
            this.$message.error(result.msg);
          }
        }, () => {
          this.tableConfig.isLoading = false;
        });
    } else {
      // 获取设施详情页面挂载设备概览列表
      this.$facilityCommonService.equipmentListByPage(this.queryCondition)
        .subscribe((result: ResultModel<Array<EquipmentListModel>>) => {
          this.tableConfig.isLoading = false;
          if (result.code === ResultCodeEnum.success) {
            this.dataSet = result.data || [];
            this.dataSet.forEach(item => {
              // 设置状态样式
              const iconStyle = CommonUtil.getEquipmentStatusIconClass(item.equipmentStatus, 'list');
              item.statusIconClass = iconStyle.iconClass;
              item.statusColorClass = iconStyle.colorClass;
              // 设置设备类型的图标
              item.iconClass = CommonUtil.getEquipmentIconClassName(item.equipmentType);
            });
            this.pageBean.Total = result.totalCount;
          } else {
            this.$message.error(result.msg);
          }
        }, () => {
          this.tableConfig.isLoading = false;
        });
    }

  }

  /**
   * 销魂组件
   */
  public ngOnDestroy(): void {
    this.tableComponent = null;
  }

  /**
   * 分页查询
   * @param event PageModel
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }


  /**
   * 初始化表格配置
   */
  private initTableConfig(): void {
    this.tableConfig = {
      outHeight: 108,
      primaryKey: '',
      isDraggable: false,
      isLoading: false,
      scroll: {x: '1804px', y: '340px'},
      noIndex: true,
      columnConfig: [
        {//  序号
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '0'}}
        },
        { // 挂载位置
          title: this.language.mountPosition, key: 'mountPosition',
          fixedStyle: {fixedRight: true, style: {left: '62px'}},
          width: 130,
          searchable: false,
        },
        { // 名称
          title: this.language.equipmentName, key: 'equipmentName', width: 230,
          searchable: false,
        },
        { // 类型
          title: this.language.equipmentType, key: 'equipmentType', width: 230,
          type: 'render',
          renderTemplate: this.equipmentTypeTemplate,
          searchable: false,
        },
        { // 状态
          title: this.language.status, key: 'equipmentStatus',
          width: 210,
          type: 'render',
          renderTemplate: this.equipmentStatusTemplate,
          searchable: false,
        },
        { // 型号
          title: this.language.model,
          key: 'equipmentModel',
          width: 210,
          searchable: false,
        },
        { // 资产编号
          title: this.language.deviceCode,
          key: 'equipmentCode',
          width: 230,
          searchable: false,
        },
        {
          title: this.commonLanguage.operate,
          searchable: false,
          key: '',
          width: 150,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [
        {
          text: this.language.detail, className: 'fiLink-view-detail',
          handle: (currentIndex: EquipmentListModel) => {
            this.navigateToDetail('business/facility/equipment-view-detail', {
              queryParams: {
                equipmentId: currentIndex.equipmentId,
                equipmentType: currentIndex.equipmentType,
                equipmentModel: currentIndex.equipmentModel,
                equipmentStatus: currentIndex.equipmentStatus
              }
            });
          },
        },
      ],
    };

    // 配电箱隐藏挂载位置列
    if (this.deviceType === DeviceTypeEnum.distributionPanel) {
      this.tableConfig.columnConfig[1].hidden = true;
    }

  }
  /**
   * 跳转到详情
   * param url
   */
  private navigateToDetail(url: string, extras = {}): void {
    this.$router.navigate([url], extras).then();
  }

}
