import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService, NzModalService, UploadFile} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {EquipmentApiService} from '../../share/service/equipment/equipment-api.service';
import {ImportMissionService} from '../../../../core-module/mission/import.mission.service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {Operation, TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {TableComponent} from '../../../../shared-module/component/table/table.component';
import {
  FilterCondition,
  QueryConditionModel,
  SortCondition
} from '../../../../shared-module/model/query-condition.model';
import {PageModel} from '../../../../shared-module/model/page.model';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {EquipmentStatisticsModel} from '../../../../core-module/model/equipment/equipment-statistics.model';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {HIDDEN_SLIDER_HIGH_CONST, SHOW_SLIDER_HIGH_CONST} from '../../share/const/facility-common.const';
import {EquipmentServiceUrlConst} from '../../share/const/equipment-service-url.const';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {IrregularData, IS_TRANSLATION_CONST} from '../../../../core-module/const/common.const';
import {BusinessStatusEnum} from '../../share/enum/equipment.enum';
import {LoopApiService} from '../../share/service/loop/loop-api.service';
import {Download} from '../../../../shared-module/util/download';
import {SliderConfigModel} from '../../../../core-module/model/facility/slider-config.model';
import {ListExportModel} from '../../../../core-module/model/list-export.model';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {AssetManagementLanguageInterface} from '../../../../../assets/i18n/asset-manage/asset-management.language.interface';
import {EquipmentListModel} from '../../../../core-module/model/equipment/equipment-list.model';
import {FacilityListModel} from '../../../../core-module/model/facility/facility-list.model';
import {ConfigDetailRequestModel} from '../../../../core-module/model/equipment/config-detail-request.model';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {EquipmentStatusEnum, EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {ConfigResponseContentModel} from '../../../../core-module/model/equipment/config-response-content.model';
import {FacilityListTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {SelectModel} from '../../../../shared-module/model/select.model';
import {EquipmentGetConfigCommon} from '../../../../shared-module/component/business-component/equipment-detail-view/equipment-base-operate/equipment-get-config-common';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {EquipmentBathConfigModel} from '../../share/model/equipment-bath-config.model';
import {HostTypeEnum} from '../../../../core-module/enum/facility/Intelligent-lock/host-type.enum';
import {FacilityApiService} from '../../share/service/facility/facility-api.service';

/**
 * 设备列表组件
 * created by PoHe
 */
@Component({
  selector: 'app-equipment-list',
  templateUrl: './equipment-list.component.html',
  styleUrls: ['./equipment-list.component.scss',
    '../../facility-common.scss']
})
export class EquipmentListComponent implements OnInit, OnDestroy {
  // 设备类型
  @ViewChild('equipmentTypeTemplate') equipmentTypeTemp: TemplateRef<HTMLDocument>;
  //  设备状态模版
  @ViewChild('equipmentStatusTemplate') equipmentStatusFilterTemp: TemplateRef<HTMLDocument>;
  // 业务状态
  @ViewChild('equipmentBusinessTemp') equipmentBusinessTemp: TemplateRef<HTMLDocument>;
  // 列表实例
  @ViewChild('tableComponent') tableRef: TableComponent;
  // 设施过滤模版
  @ViewChild('facilityTemplate') deviceFilterTemplate: TemplateRef<HTMLDocument>;
  // 设施列表展示模版
  @ViewChild('deviceNameTemplate') deviceNameTemplate: TemplateRef<HTMLDocument>;
  // 文件导入
  @ViewChild('importEquipmentTemp') importEquipmentTemp: TemplateRef<HTMLDocument>;
  // 滑块配置
  public sliderConfig: SliderConfigModel[] = [];
  // 列表数据
  public dataSet: EquipmentListModel[] = [];
  // 列表分页实体
  public pageBean: PageModel = new PageModel();
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 首页语言包
  public commonLanguage: CommonLanguageInterface;
  // 资产管理语言包
  public assetsLanguage: AssetManagementLanguageInterface;
  // 列表配置
  public tableConfig: TableConfigModel;
  // 列表查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 业务状态枚举
  public businessStatusEnum = BusinessStatusEnum;
  // 表格更多按钮数据
  public leftBottomButtonsTemp = [];
  // 设备状态枚举
  public equipmentStatusEnum = EquipmentStatusEnum;
  // 设备类型枚举
  public equipmentTypeEnum = EquipmentTypeEnum;
  // 国际化前缀枚举
  public languageEnum = LanguageEnum;
  // 设施过滤
  public filterValue: FilterCondition;
  // 设备设置表单
  public formColumn: FormItem[] = [];
  // 表单状态
  public formStatus: FormOperate;
  // 设备配置弹框是否显示
  public equipmentDeployShow: boolean = false;
  // 设施过滤选择器
  public facilityVisible: boolean = false;
  // 过滤数据所选的设施
  public deviceInfo: FacilityListModel[] = [];
  // 过滤框显示设施名
  public filterDeviceName: string = '';
  //  设备配置型号
  public equipmentModel: string;
  // 设备配置类型
  public equipmentConfigType: EquipmentTypeEnum;
  // 设备配置id
  public equipmentConfigId: string;
  // 已选择设施数据
  public selectFacility: FacilityListModel[] = [];
  // 设备配置内容
  public equipmentConfigContent: ConfigResponseContentModel[];
  // 设备配置提交是否可以操作
  public configOkDisabled: boolean = true;
  // 设备配置详情参数
  public configValueParam: ConfigDetailRequestModel = new ConfigDetailRequestModel();
  // 配置设备id
  public configEquipmentId: string;
  // 文件集合
  public fileList: UploadFile[] = [];
  // 文件数组
  public fileArray: UploadFile[] = [];
  // 文件类型
  public fileType: string;
  // 设备配置弹框是否展开
  public isVisible: boolean = false;
  // 非网关配置时专用字段
  public deviceConfiguration: boolean = true;
  // 设备状态
  private resultEquipmentStatus: SelectModel[];
//  列表功能按钮-迁移
  private migration: boolean = true;
  /**
   * 构造器
   */
  constructor(
    private $nzI18n: NzI18nService,
    private $router: Router,
    private $message: FiLinkModalService,
    public $nzModalService: NzModalService,
    private $equipmentAipService: EquipmentApiService,
    private $facilityCommonService: FacilityForCommonService,
    private $loopService: LoopApiService,
    private $refresh: ImportMissionService,
    private $download: Download,
    private $modalService: NzModalService,
    private $facilityApiService: FacilityApiService,
  ) {
  }

  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.assetsLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);
    this.getTenantRole();
    // 过滤已拆除状态
    this.resultEquipmentStatus = CommonUtil.codeTranslate(EquipmentStatusEnum, this.$nzI18n, null, this.languageEnum.facility) as SelectModel[];
    this.resultEquipmentStatus = this.resultEquipmentStatus.filter(item => item.code !== this.equipmentStatusEnum.dismantled);
    // 初始化表格参数
    this.initTableConfig();
    // 查询设备统计数据
    this.queryEquipmentCount();
    // 查询列表数据
    this.refreshData();
    this.$refresh.refreshChangeHook.subscribe((event) => {
      // 查询设备统计数据
      this.queryEquipmentCount();
      // 查询列表数据
      this.refreshData();
    });

  }

  public ngAfterViewInit(): void {
    this.tableRef.handleRest();
  }

  /**
   * 将实例化模版进行销毁
   */
  public ngOnDestroy(): void {
    this.equipmentTypeTemp = null;
    this.deviceNameTemplate = null;
    this.equipmentStatusFilterTemp = null;
    this.tableRef = null;
    this.deviceFilterTemplate = null;
  }

  /**
   * 滑块显示和隐藏
   */
  public slideShowChange(event: boolean): void {
    this.tableConfig.outHeight = event ? SHOW_SLIDER_HIGH_CONST : HIDDEN_SLIDER_HIGH_CONST;
    this.tableRef.calcTableHeight();
  }


  /**
   * 切换滑块的类型
   */
  public onSliderChange(event: SliderConfigModel): void {
    if (event.code !== null) {
      // 先清空表格里面的查询条件
      this.tableRef.searchDate = {};
      this.tableRef.rangDateValue = {};
      this.tableRef.tableService.resetFilterConditions(this.tableRef.queryTerm);
      this.tableRef.handleSetControlData('equipmentType', [event.code]);
      this.tableRef.handleSearch();
    } else {
      this.tableRef.handleSetControlData('equipmentType', []);
      this.tableRef.handleSearch();
    }
  }

  /**
   * 获取参数配置项内容
   * 返回结果是any是因为配置项具有不确定性
   */
  public getPramsConfig(equipmentID): void {
    this.$equipmentAipService.getEquipmentConfigByModel(equipmentID).subscribe((result: ResultModel<ConfigResponseContentModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.equipmentConfigContent = [];
        const temp = result.data || [];
        // 判断是否有配置项 为空提示无配置项
        if (!_.isEmpty(temp)) {
          this.configEquipmentId = this.equipmentConfigId;
          this.configValueParam.equipmentId = this.equipmentConfigId;
          this.configValueParam.equipmentType = this.equipmentConfigType;
          if (this.equipmentConfigType === EquipmentTypeEnum.gateway) {
            EquipmentGetConfigCommon.queryGatewayPropertyConfig(this.configValueParam.equipmentId, temp, this);
            this.deviceConfiguration = false;
          } else {
            this.deviceConfiguration = true;
            this.equipmentConfigContent = temp;
            // 打开设备配置弹框
            this.configOkDisabled = true;
            this.equipmentDeployShow = true;
          }
        } else {
          this.$message.info(this.assetsLanguage.noEquipmentConfigTip);
        }
      } else {
        // 关闭设备配置弹框
        this.equipmentDeployShow = false;
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 打开设备配置弹窗 (不能删 有用到）
   *
   */
  public openEquipmentConfigShow(): void {
    // 打开设备配置弹框
    this.configOkDisabled = true;
    this.equipmentDeployShow = true;
  }

  /**
   * 切换分页
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 点击输入框弹出设施选择
   */
  public onShowFacility(filterValue: FilterCondition): void {
    this.filterValue = filterValue;
    this.facilityVisible = true;
    if (!this.filterValue.filterValue) {
      this.filterValue.filterValue = [];
    } else {
      const deviceNameArr = this.filterValue.filterName.split(',');
      this.selectFacility = this.filterValue.filterValue.map((item, index) => {
        return {deviceId: item, deviceName: deviceNameArr[index]};
      });
    }
  }

  /**
   * 选择设施数据
   */
  public onFacilityChange(event: FacilityListModel[]): void {
    this.filterValue.filterValue = event.map(item => {
      return item.deviceId;
    }) || [];
    this.selectFacility = event || [];
    if (!_.isEmpty(event)) {
      this.filterDeviceName = event.map(item => {
        return item.deviceName;
      }).join(',');
    } else {
      this.filterDeviceName = '';
    }
    this.filterValue.filterName = this.filterDeviceName;
  }

  // 文件上传之前处理
  beforeUpload = (file: UploadFile): boolean => {
    this.fileList = [file];
    const fileName = this.fileList[0].name;
    const index = fileName.lastIndexOf('\.');
    this.fileType = fileName.substring(index + 1, fileName.length);
    return false;
  }

  /**
   * 路由跳转
   */
  private routingJump(url: string, extras = {}): void {
    this.$router.navigate([url], extras).then();
  }

  /**
   * 查询各种类型设备总量
   */
  private queryEquipmentCount(): void {
    // 调用统计接口
    this.$facilityCommonService.equipmentCount().subscribe(
      (result: ResultModel<EquipmentStatisticsModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          let roleEquip = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n);
          roleEquip = FacilityForCommonUtil.equipmentSort(roleEquip);
          const equipCods = roleEquip.map(v => v.code);
          // 获取所有的设备类型
          const equipmentTypeList: SliderConfigModel[] = [];
          let equipmentTypeData: EquipmentStatisticsModel[] = result.data || [];
          equipmentTypeData = equipmentTypeData.filter(item => equipCods.includes(item.equipmentType));
          equipCods.forEach(row => {
            const temp = equipmentTypeData.find(item => item.equipmentType === row);
            let _iconClass;
            if (row === EquipmentTypeEnum.camera) {
              _iconClass = 'fiLink-camera-statistics camera-color';
            } else if (row === EquipmentTypeEnum.oneTouchCalling) {
              _iconClass = 'fiLink-alarm-fast alarm-fast-color';
            } else {
              _iconClass = CommonUtil.getEquipmentIconClassName(row as string);
            }
            equipmentTypeList.push({
              code: row as string,
              label: CommonUtil.codeTranslate(EquipmentTypeEnum, this.$nzI18n, row as string, LanguageEnum.facility) as string,
              sum: temp ? temp.equipmentNum : 0,
              textClass: CommonUtil.getEquipmentTextColor(row as string),
              iconClass: _iconClass
            });
          });
          // 计算设备总数量
          const sum = _.sumBy(equipmentTypeData, 'equipmentNum') || 0;
          equipmentTypeList.unshift({
            // 设备总数
            label: this.language.equipmentTotal,
            iconClass: CommonUtil.getEquipmentIconClassName(null),
            textClass: CommonUtil.getEquipmentTextColor(null),
            code: null, sum: sum
          });
          this.sliderConfig = equipmentTypeList;
        } else {
          this.$message.error(result.msg);
        }
      });
  }

  /**
   *  刷新列表数据
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    this.$facilityCommonService.equipmentListByPageForListPage(this.queryCondition).subscribe((result: ResultModel<EquipmentListModel[]>) => {
      this.tableConfig.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.pageBean.Total = result.totalCount;
        this.pageBean.pageIndex = result.pageNum;
        this.pageBean.pageSize = result.size;
        this.dataSet = result.data || [];
        // 处理各种状态的显示情况co
        this.dataSet.forEach(item => {
          const statusArr: string[] = [EquipmentStatusEnum.unSet, EquipmentStatusEnum.dismantled];
          item.deleteButtonShow = statusArr.includes(item.equipmentStatus);
          // 设置状态样式
          const iconStyle = CommonUtil.getEquipmentStatusIconClass(item.equipmentStatus, 'list');
          item.facilityRelocation = true;
          item.deviceConfiguration = <string>item.equipmentModelType !== HostTypeEnum.PassiveLock;
          item.statusIconClass = iconStyle.iconClass;
          item.statusColorClass = iconStyle.colorClass;
          // 获取设备类型的图标
          item.iconClass = CommonUtil.getEquipmentTypeIcon(item);
          // 计算安装时间和当前时间是否超过报废年限
          if (item.installationDate && item.scrapTime) {
            const now = new Date().getTime();
            const tempDate = new Date(Number(item.installationDate));
            tempDate.setFullYear(tempDate.getFullYear() + Number(item.scrapTime));
            item.rowStyle = now > tempDate.getTime() ? IrregularData : {};
          }
        });
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 初始化表格参数
   */
  private initTableConfig(): void {
    this.tableConfig = {
      outHeight: 108,
      keepSelected: true,
      selectedIdKey: 'equipmentId',
      primaryKey: '03-8',
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1804px', y: '340px'},
      noIndex: true,
      showSearchExport: true,
      showImport: false,
      columnConfig: [
        { // 选择
          type: 'select',
          fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62
        },
        { // 序号
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        { // 名称
          title: this.language.name,
          key: 'equipmentName',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        { // 资产编码
          title: this.language.deviceCode,
          key: 'equipmentCode',
          width: 150,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 设备id
          title: this.language.sequenceId,
          key: 'sequenceId',
          width: 150,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 类型
          title: this.language.type,
          key: 'equipmentType',
          isShowSort: true,
          type: 'render',
          configurable: true,
          width: 160,
          searchable: true,
          renderTemplate: this.equipmentTypeTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n),
            label: 'label',
            value: 'code'
          }
        },
        { // 状态
          title: this.language.status,
          key: 'equipmentStatus',
          width: 130,
          type: 'render',
          renderTemplate: this.equipmentStatusFilterTemp,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: this.resultEquipmentStatus,
            label: 'label',
            value: 'code'
          }
        },
        { //  型号
          title: this.language.model,
          key: 'equipmentModel',
          width: 124,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 供应商
          title: this.language.supplierName,
          key: 'supplier',
          width: 125,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 报废时间
          title: this.language.scrapTime,
          key: 'scrapTime',
          width: 100,
          isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 所属设施
          title: this.language.affiliatedDevice,
          key: 'deviceName',
          searchKey: 'deviceId',
          width: 150,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this.deviceFilterTemplate
          },
        },
        { // 挂载位置
          title: this.language.mountPosition,
          key: 'mountPosition',
          configurable: true,
          width: 100,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 安装时间日期
          title: this.language.installationDate,
          width: 200,
          configurable: true,
          isShowSort: true,
          searchable: true,
          hidden: true,
          pipe: 'date',
          pipeParam: 'yyyy-MM-dd',
          searchConfig: {type: 'dateRang'},
          key: 'installationDate'
        },
        { // 权属公司
          title: this.language.company, key: 'company',
          searchable: true,
          width: 150,
          configurable: true,
          isShowSort: true,
          hidden: true,
          searchConfig: {type: 'input'}
        },
        { // 业务状态
          title: this.language.businessStatus, key: 'businessStatus',
          configurable: true,
          type: 'render',
          renderTemplate: this.equipmentBusinessTemp,
          width: 150,
          searchable: true,
          isShowSort: true,
          hidden: true,
          searchConfig: {
            type: 'select',
            selectInfo: CommonUtil.codeTranslate(BusinessStatusEnum, this.$nzI18n, null, LanguageEnum.facility),
            label: 'label',
            value: 'code'
          }
        },
        { // 区域名称
          title: this.language.affiliatedArea, key: 'areaName',
          configurable: true,
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'},
        },
        { // 详细地址
          title: this.language.address, key: 'address',
          configurable: true,
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'},
        },
        { // 所属网关
          title: this.language.gatewayName, key: 'gatewayName',
          configurable: true,
          hidden: true,
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 备注
          title: this.language.remarks, key: 'remarks',
          configurable: true,
          hidden: true,
          width: 200,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.commonLanguage.operate,
          searchable: true,
          searchConfig: {type: 'operate'},
          key: '',
          width: 200,
          fixedStyle: {fixedRight: false, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [
        {
          text: this.language.add,
          iconClassName: 'fiLink-add-no-circle',
          permissionCode: '03-8-1',
          handle: () => {
            this.routingJump('business/facility/equipment-detail/add', {});
          }
        },
        {
          text: this.commonLanguage.deleteBtn,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          permissionCode: '03-8-7',
          needConfirm: false,
          canDisabled: true,
          confirmContent: this.language.confirmDeleteData,
          handle: (data: EquipmentListModel[]) => {
            this.handelDeleteEquipment(data);
          }
        }
      ],
      operation: [
        { // 编辑
          permissionCode: '03-8-2',
          text: this.commonLanguage.edit, className: 'fiLink-edit',
          handle: (data: EquipmentListModel) => {
            this.routingJump('business/facility/equipment-detail/update',
              {queryParams: {equipmentId: data.equipmentId}});
          },
        },
        { //  定位
          permissionCode: '03-8-8',
          text: this.language.location, className: 'fiLink-location',
          handle: (data: EquipmentListModel) => {
            const body = {equipmentId: data.equipmentId};
            this.routingJump('business/index', {queryParams: body});
          },
        },
        { // 设备配置
          permissionCode: '03-8-4',
          text: this.language.deviceConfiguration,
          className: 'fiLink-business-info',
          key: 'deviceConfiguration',
          handle: (data: EquipmentListModel) => {
            // 设备配置弹框开启
            const equipmentId = {equipmentId: data.equipmentId};
            this.getPramsConfig(equipmentId);
            this.equipmentConfigId = data.equipmentId;
            this.equipmentConfigType = data.equipmentType;
          },
        },
        { // 设备详情
          permissionCode: '03-8-3',
          text: this.language.equipmentDetail, className: 'fiLink-view-detail',
          handle: (data: EquipmentListModel) => {
            this.routingJump('business/facility/equipment-view-detail',
              {queryParams: {equipmentId: data.equipmentId}});
          },
        },
        {
          // 设备迁移
          text: this.language.Migration, className: 'fiLink-filink-qianyi-icon',
          iconClassName: 'fiLink-filink-qianyi-icon',
          permissionCode: '03-8-9',
          key: 'facilityRelocation',
          handle: (currentIndex: any) => {
            sessionStorage.setItem('facility_migration', JSON.stringify([currentIndex]));
            this.$router.navigate(['business/facility/equipment-migration'], {queryParams: {type: FacilityListTypeEnum.equipmentList}}).then();
          },
        },
        { // 删除
          permissionCode: '03-8-7',
          text: this.commonLanguage.deleteBtn, className: 'fiLink-delete red-icon',
          handle: (data: EquipmentListModel) => {
            // 先注释掉 删除 的校验逻辑，后期会再放开
            /* if (![EquipmentStatusEnum.unSet, EquipmentStatusEnum.dismantled].includes(data.equipmentStatus)) {
               this.$message.warning(this.language.dataCanBeDelete);
               return;
             }*/
            this.handelDeleteEquipment([data]);
          }
        },
      ],
      leftBottomButtons: [],
      rightTopButtons: [
        // 导入
        {
          text: this.language.importEquipment,
          iconClassName: 'fiLink-import',
          permissionCode: '03-8-6',
          handle: () => {
            const modal = this.$nzModalService.create({
              nzTitle: this.language.selectImport,
              nzClassName: 'custom-create-modal',
              nzContent: this.importEquipmentTemp,
              nzOkType: 'danger',
              nzFooter: [
                {
                  label: this.language.okText,
                  onClick: () => {
                    this.handelImportEquipment();
                    modal.destroy();
                  }
                },
                {
                  label: this.language.cancelText,
                  type: 'danger',
                  onClick: () => {
                    this.fileList = [];
                    this.fileArray = [];
                    this.fileType = null;
                    modal.destroy();
                  }
                },
              ]
            });
          }
        },
        { // 模板下载
          text: this.language.downloadTemplate, iconClassName: 'fiLink-download-file',
          permissionCode: '03-8-5',
          handle: () => {
            this.$download.downloadFile(EquipmentServiceUrlConst.downloadTemplate, 'equipmentTemplate.xlsx');
          },
        }
      ],
      moreButtons: this.initLeftBottomButton().concat([
        { // 批量配置
          text: this.language.batchConfig,
          iconClassName: 'fiLink-setup-batch',
          permissionCode: '03-1-21',
          canDisabled: true,
          handle: (e: EquipmentListModel[]) => {
            if (e && e.length > 0) {
              this.batchConfiguration(e);
            }
          }
        },
        { // 释放
          canDisabled: true,
          needConfirm: true,
          iconClassName: 'fiLink-release-icon',
          confirmContent: this.language.confirmRelease,
          permissionCode: '03-8-10',
          text: this.language.release,
          handle: (event: EquipmentListModel[]) => {
            this.updateStatusByIds(event, BusinessStatusEnum.release);
          }
        },
        {
          canDisabled: true,
          needConfirm: true,
          iconClassName: 'fiLink-lock-icon',
          confirmContent: this.language.confirmLock,
          permissionCode: '03-8-11',
          text: this.language.lockEquipment,
          handle: (event: EquipmentListModel[]) => {
            this.updateStatusByIds(event, BusinessStatusEnum.lockEquipment);
          }
        },
      // 列表-更多操作-批量编码
        {
          canDisabled: false,
          iconClassName: 'fiLink-batch-coding-icon',
          confirmContent: this.language.confirmBatchCoding,
          permissionCode: '03-8-12',
          text: this.language.batchCoding,
          handle: (selectData: FacilityListModel[]) => {
            // 跳转到 批量编码页面 设施页面传参为1，设备页面传参为2
            this.routingJump('business/facility/equipment-batch-coding', {queryParams: {pageType: '2'}});
          }
        },
        // 列表-更多操作-设备已拆除
        {
            canDisabled: false,
            iconClassName: 'fiLink-dismantled-x',
            confirmContent: this.language.confirmAlreadyDismantleEquipment,
            permissionCode: '03-8-13',
            text: this.language.removeEquipment,
            handle: (selectData: FacilityListModel[]) => {
              // 跳转到 设备已拆除页面
              this.routingJump('business/facility/remove-equipment-list');
            }
          }
      ]),
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      // 过滤查询数据
      handleSearch: (event: FilterCondition[]) => {
        const deviceIndex = event.findIndex(row => row.filterField === 'deviceId');
        // 使用设施选择器的设施之后对设施ID过滤进行处理
        if (deviceIndex >= 0 && !_.isEmpty(event[deviceIndex].filterValue)) {
          event[deviceIndex].operator = OperatorEnum.in;
        } else {
          this.filterDeviceName = '';
          this.filterValue = null;
          event = event.filter(item => item.filterField !== 'deviceId');
          this.selectFacility = [];
        }
        this.queryCondition.filterConditions = event;
        this.queryCondition.pageCondition.pageNum = 1;
        this.refreshData();
      },
      //  导出数据
      handleExport: (event: ListExportModel<EquipmentListModel[]>) => {
        this.handelExportEquipment(event);
      },
    };
  }

  /**
   * 初始化列表下方按钮
   */
  private initLeftBottomButton(): Operation[] {
    return this.leftBottomButtonsTemp.filter(item => SessionUtil.checkHasRole(item.permissionCode));
  }

  /**
   * 查询租户配置权限
   */
  public getTenantRole() {
    if (this.migration) {
      this.leftBottomButtonsTemp.push(
        // 迁移
        {
          canDisabled: true,
          needConfirm: true,
          iconClassName: 'fiLink-filink-qianyi-icon',
          confirmContent: this.language.isMigrationEquipment,
          permissionCode: '03-8-9',
          text: this.language.migration, handle: (event) => {
            sessionStorage.setItem('facility_migration', JSON.stringify(event.map(item => item)));
            this.$router.navigate(['business/facility/equipment-migration'], {queryParams: {type: FacilityListTypeEnum.equipmentList}}).then();
          }
        }
      );
    }
  }

  /**
   * 执行导入文件
   */
  private handelImportEquipment() {
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
      formData.append('file', file);
    });
    if (this.fileList.length === 1) {
      if (this.fileType === 'xls' || this.fileType === 'xlsx') {
        this.$equipmentAipService.batchImportEquipmentInfo(formData).subscribe((result: ResultModel<string>) => {
          this.fileList = [];
          this.fileType = null;
          if (result.code === ResultCodeEnum.success) {
            this.$message.success(this.language.importTask);
            this.fileArray = [];
          } else {
            this.$message.error(result.msg);
          }
        });
      } else {
        this.$message.info(this.language.fileTypeTips);
      }

    } else {
      this.$message.info(this.language.selectFileTips);
    }
  }

  /**
   * 删除设备数据
   */
  private handelDeleteEquipment(data: EquipmentListModel[]): void {
    // 先注释掉删除校验逻辑后期再放开
    /* const statusArr: string[] = [EquipmentStatusEnum.unSet, EquipmentStatusEnum.dismantled];
     const tempArr = data.filter(item => !statusArr.includes(item.equipmentStatus));
     if (!_.isEmpty(tempArr)) {
       this.$message.warning(this.language.dataCanBeDelete);
       return;
     }*/
    // 提取所选数据的设备id
    const ids = data.map(v => {
      return v.equipmentId;
    });
    this.$modalService.confirm({
      nzTitle: this.language.prompt,
      nzOkType: 'danger',
      nzContent: `<span>${this.language.confirmDeleteEquipment}</span>`,
      nzOkText: this.commonLanguage.cancel,
      nzMaskClosable: false,
      nzOnOk: () => {
      },
      nzCancelText: this.commonLanguage.confirm,
      nzOnCancel: () => {
        this.$equipmentAipService.deleteEquipmentByIds(ids).subscribe((result: ResultModel<string>) => {
          if (result.code === ResultCodeEnum.success) {
            this.$message.success(this.language.deleteEquipmentSuccess);
            this.queryCondition.pageCondition.pageNum = 1;
            this.queryEquipmentCount();
            this.refreshData();
          } else {
            this.$message.error(result.msg);
          }
        });
      }
    });
  }

  /**
   * 导出数据
   */
  private handelExportEquipment(event: ListExportModel<EquipmentListModel[]>): void {
    // 处理参数
    const exportBody = new ExportRequestModel(event.columnInfoList, event.excelType);
    exportBody.columnInfoList.forEach(item => {
      // 安装时间需要转换字段，后台方便处理
      if (item.propertyName === 'installationDate') {
        item.propertyName = 'instDate';
      }
      if (['equipmentType', 'equipmentStatus', 'deviceName', 'instDate', 'businessStatus', 'areaName'].includes(item.propertyName)) {
        // 后台处理字段标示
        item.isTranslation = IS_TRANSLATION_CONST;
      }
    });
    // 处理选择的数据
    if (event && !_.isEmpty(event.selectItem)) {
      const ids = event.selectItem.map(item => item.equipmentId);
      const filter = new FilterCondition('equipmentId', OperatorEnum.in, ids);
      exportBody.queryCondition.filterConditions.push(filter);
    } else {
      // 处理查询条件
      exportBody.queryCondition.filterConditions = event.queryTerm;
    }
    // 调用后台接口
    this.$equipmentAipService.exportEquipmentData(exportBody).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.language.exportEquipmentSuccess);
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 设备产品批量配置
   */
  private batchConfiguration(list: EquipmentListModel[]): void {
    // 去重判断所选设备是否为统一类型
    const arr = [];
    list.forEach(v => {
      if (!arr.includes(v.equipmentType)) {
        arr.push(v.equipmentType);
      }
    });
    if (arr.length > 1) {
      this.$message.info(this.language.sameEquipmentType);
      return;
    }
    if (!arr.some(item => [EquipmentTypeEnum.gateway, EquipmentTypeEnum.centralController].includes(item))) {
      this.$message.info(this.language.noConfigurationInformation);
      return;
    }
    const param = [];
    list.forEach(item => {
      const data = new EquipmentBathConfigModel();
      data.gatewayId = item.gatewayId;
      data.equipmentId = item.equipmentId;
      data.equipmentType = item.equipmentType;
      data.productModel = item.equipmentModel;
      data.supplier = item.supplierId;
      data.softwareVersion = item.softwareVersion;
      data.hardwareVersion = item.hardwareVersion;
      data.gatewayName = item.gatewayName;
      param.push(data);
    });
    // 调用批量配置接口
    this.$facilityCommonService.batchConfigurationDevice(param).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        this.refreshData();
        this.$message.success(this.language.configSuccess);
      } else {
        this.$message.error(this.language.configError);
      }
    });
  }

  /**
   * 更新设备业务状态 释放/锁定
   * @param  data  选中数据
   * @param  businessStatus 业务状态类型
   */
  private updateStatusByIds(data , businessStatus: BusinessStatusEnum) {
    const params = {
      // 选中设备
      equipmentIds : data.map(item => item.equipmentId),
      // 业务状态
      businessStatus: businessStatus
    };
    this.$facilityApiService.updateEquipmentStatusByIds(params).subscribe((result) => {
      if (result.code === ResultCodeEnum.success) {
        if (businessStatus === BusinessStatusEnum.release) {
          this.$message.success(`${this.language.release}${this.language.success}`);
        } else {
          this.$message.success(`${this.language.lockEquipment}${this.language.success}`);
        }
        this.queryCondition.pageCondition.pageNum = 1;
        this.refreshData();
      } else {
        this.$message.error(result.msg);
      }
    });
  }
}
