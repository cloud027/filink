import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {LoopApiService} from '../../../share/service/loop/loop-api.service';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {QueryConditionModel, SortCondition} from '../../../../../shared-module/model/query-condition.model';
import {TableComponent} from '../../../../../shared-module/component/table/table.component';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {MoveInOrOutModel} from '../../../../../core-module/model/loop/move-in-or-out.model';
import {AssetManagementLanguageInterface} from '../../../../../../assets/i18n/asset-manage/asset-management.language.interface';
import {DeviceStatusEnum, DeviceTypeEnum} from '../../../../../core-module/enum/facility/facility.enum';
import {FacilityForCommonService} from '../../../../../core-module/api-service/facility';
import {FacilityListModel} from '../../../../../core-module/model/facility/facility-list.model';


/**
 * 回路关联设施概览列表
 */
@Component({
  selector: 'app-loop-link-device',
  templateUrl: './loop-link-device.component.html',
  styleUrls: ['./loop-link-device.component.scss']
})

export class LoopLinkDeviceComponent implements OnInit, OnDestroy {
  // 回路id
  @Input() public loopId: string;
  // 移出回路操作
  @Output() public hasMoveOut = new EventEmitter<boolean>();
  // 列表实例
  @ViewChild('tableComponent') public tableComponent: TableComponent;
  // 设施状态
  @ViewChild('deviceStatusTemp') private deviceStatusTemp: TemplateRef<HTMLDocument>;
  // 设施类型模板
  @ViewChild('deviceTypeTemp') private deviceTypeTemp: TemplateRef<HTMLDocument>;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 资产语言包
  public assetLanguage: AssetManagementLanguageInterface;
  // 列表数据
  public dataSet: FacilityListModel[] = [];
  // 设施枚举
  public deviceStatusEnum = DeviceStatusEnum;
  // 设施类型枚举
  public deviceTypeEnum = DeviceTypeEnum;
  // 国际化前缀枚举
  public languageEnum = LanguageEnum;
  // 列表分页实体
  public pageBean: PageModel = new PageModel();
  // 列表配置
  public tableConfig: TableConfigModel;
  // 列表查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 移入回路弹框是否展开
  public isVisible: boolean = false;
  // 设施id
  public deviceId: string;

  constructor(
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $router: Router,
    private $loopService: LoopApiService,
    private $facilityCommonService: FacilityForCommonService
  ) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 国际化
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.assetLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);
    // table初始化
    this.initTableConfig();
    // 刷新列表
    this.queryDeviceData();
  }


  /**
   * 组件销毁
   */
  public ngOnDestroy(): void {
    this.tableComponent = null;
  }

  /**
   * 分页
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.queryDeviceData();
  }

  /**
   * 刷新列表
   */
  private queryDeviceData(): void {
    this.queryCondition.bizCondition = {loopId: this.loopId};
    this.tableConfig.isLoading = true;
    this.$facilityCommonService.queryLoopDevicePageByLoopId(this.queryCondition).subscribe((result: ResultModel<FacilityListModel[]>) => {
      this.tableConfig.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.pageBean.pageIndex = result.pageNum;
        this.pageBean.pageSize = result.size;
        this.pageBean.Total = result.totalCount;
        this.dataSet = result.data || [];
        this.dataSet.forEach(item => {
          // 设施状态图标和图标颜色样式
          // 获取设施状态图标和图标的颜色
          const deviceStatusStyle = CommonUtil.getDeviceStatusIconClass(item.deviceStatus);
          item.deviceStatusIconClass = deviceStatusStyle.iconClass;
          item.deviceStatusColorClass = deviceStatusStyle.colorClass;
          // 设施类型类型图标
          item.iconClass = CommonUtil.getFacilityIConClass(item.deviceType);
        });
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 移出回路
   */
  private moveOutLoop(moveOutParam: MoveInOrOutModel): void {
    this.$facilityCommonService.moveOutLoop(moveOutParam).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.assetLanguage.moveOutLoopSucceededTip);
        // 移出回路需要刷新缩略图标识
        this.hasMoveOut.emit(true);
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryDeviceData();
      } else {
        this.$message.error(result.msg);
        this.hasMoveOut.emit(false);
      }
    });
  }

  /**
   * 初始化表格配置
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isLoading: true,
      showSearchSwitch: false,
      outHeight: 108,
      isDraggable: true,
      showSizeChanger: false,
      scroll: {x: '1804px', y: '340px'},
      noIndex: true,
      showSearchExport: false,
      columnConfig: [
        {
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '0'}}
        },
        { // 设施名称
          title: this.language.deviceName_a, key: 'deviceName',
          width: 150,
          configurable: false,
          searchable: false,
          isShowSort: false,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        { // 设施类型
          title: this.language.deviceType_a, key: 'deviceType', width: 150,
          configurable: false,
          searchable: false,
          isShowSort: false,
          type: 'render',
          renderTemplate: this.deviceTypeTemp,
          searchConfig: {type: 'input'},
        },
        { // 型号
          title: this.language.deviceModel,
          key: 'deviceModel',
          width: 120,
          configurable: false,
          searchable: false,
          isShowSort: false,
          searchConfig: {type: 'input'}
        },
        { // 设备数量
          title: this.language.equipmentQuantity,
          key: 'equipmentQuantity',
          width: 150,
          configurable: false,
          searchable: false,
          isShowSort: false,
          searchConfig: {type: 'input'},
        },
        { // 设施状态
          title: this.language.deviceStatus_a,
          key: 'deviceStatus',
          width: 150,
          type: 'render',
          renderTemplate: this.deviceStatusTemp,
          configurable: false,
          searchable: false,
          isShowSort: false,
          searchConfig: {type: 'input'}
        },
        { // 详细地址
          title: this.language.address,
          key: 'address',
          width: 150,
          configurable: false,
          searchable: false,
          isShowSort: false,
          searchConfig: {type: 'input'},
        },
        {
          title: this.language.operate,
          searchable: false,
          searchConfig: {type: 'operate'},
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
        { // 移出回路
          text: this.language.moveOutOfTheLoop,
          permissionCode: '03-10-8',
          className: 'fiLink-move-out',
          needConfirm: true,
          confirmContent: this.assetLanguage.moveOutLoopBeforeTip,
          handle: (data: FacilityListModel) => {
            const moveOutParam = {
              loopIds: [this.loopId],
              deviceIds: [data.deviceId],
            };
            this.moveOutLoop(moveOutParam);
          },
        },
      ],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.queryDeviceData();
      }
    };
  }


}
