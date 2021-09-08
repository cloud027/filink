import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {FinalValueEnum} from '../../../../../core-module/enum/step-final-value.enum';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {ColumnConfig, TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {QueryConditionModel, SortCondition} from '../../../../../shared-module/model/query-condition.model';
import {CodingStandardApiService} from '../../../share/service/coding-standard/coding-standard-api.service';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {FacilityForCommonService} from '../../../../../core-module/api-service';
import {ActivatedRoute} from '@angular/router';
import {DeviceTypeEnum} from '../../../../../core-module/enum/facility/facility.enum';
import {EquipmentStatusEnum, EquipmentTypeEnum} from '../../../../../core-module/enum/equipment/equipment.enum';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {NzModalService} from 'ng-zorro-antd';
import {CodingStandardEnum} from '../../../share/enum/coding-standard.enum';
import {BatchCodeConfig} from '../../../share/config/batch-code-config';

@Component({
  selector: 'app-batch-coding',
  templateUrl: './batch-coding.component.html',
  styleUrls: ['./batch-coding.component.scss']
})
export class BatchCodingComponent implements OnInit {
  // 启用状态
  @ViewChild('enableStatus') enableStatus: TemplateRef<any>;
  //  设备状态模版
  @ViewChild('equipmentStatusTemplate') equipmentStatusFilterTemp: TemplateRef<HTMLDocument>;
  // 设施类型模板
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<HTMLDocument>;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 选中的步骤数
  public isActiveSteps = FinalValueEnum.STEPS_FIRST;
  // 步骤条的步骤枚举
  public finalValueEnum = FinalValueEnum;
  // 步骤条的值
  public setData = [];
  // 下一步按钮是否禁用
  public nextButtonDisable: boolean = true;
  // 提交loading
  public isSaveLoading: boolean = false;
  // 列表数据
  public dataSet = [];
  // 列表分页实体
  public pageBean: PageModel = new PageModel();
  // 列表配置
  public tableConfig: TableConfigModel = new TableConfigModel();
  // 列表查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 判断批量编码显示设施类型列表还是设备类型列表
  public deviceOrEquipmentList = [];
  // 第二步勾选的数据信息
  public selectDeviceOrEquipmentInformation: any[] = [];
  // 第二部列表数据
  public facilityOrEquipmentDataSet = [];
  // 列表分页实体
  public facilityOrEquipmentPageBean: PageModel = new PageModel();
  // 列表配置
  public facilityOrEquipmentTableConfig: TableConfigModel = new TableConfigModel();
  // 列表查询条件
  public facilityOrEquipmentQueryCondition: QueryConditionModel = new QueryConditionModel();
  // 判断进入批量编码页面的跳转页面为设施列表页面还是设备列表页面
  public pageType: string;
  // 设施类型枚举
  public deviceTypeEnum = DeviceTypeEnum;
  // 设施类型枚举
  public equipmentTypeEnum = EquipmentTypeEnum;
  // 设备状态枚举
  public equipmentStatusEnum = EquipmentStatusEnum;
  // 国际化前缀枚举
  public languageEnum = LanguageEnum;
  // 第一步勾选的数据id
  public selectCodingRuleIds: any = {};
  // 第一步勾选的数据回显
  public selectData = [];
  // 当前tab页Index
  private currentTabIndex: number = 0;
  // 设施设备列表key值改变
  private deviceOrEquipmentId: string;
  // 是否覆盖当前资产编码
  private isConfirmUpdate: string = '1';
  // 当前批量编码第二步表格配置
  private facilityOrEquipmentConfig: ColumnConfig[] = [];

  constructor(
    private $nzI18n: NzI18nService,
    public $message: FiLinkModalService,
    public $CodingStandardApiService: CodingStandardApiService,
    public $FacilityForCommonService: FacilityForCommonService,
    private $active: ActivatedRoute,
    private $modalService: NzModalService
  ) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.setData = [
      {number: FinalValueEnum.STEPS_FIRST, activeClass: ' active', title: this.commonLanguage.firstStep},
      {number: FinalValueEnum.STEPS_SECOND, activeClass: '', title: this.commonLanguage.secondStep},
    ];
    this.$active.queryParams.subscribe(params => {
      this.pageType = params.pageType;
      // 判断页面类型设置初始化设施/设备表格以及勾选的id名称
      if (this.pageType === '1') {
        this.facilityOrEquipmentConfig = BatchCodeConfig.facilityTableConfig(
          this.language, this.deviceTypeTemp);
        this.deviceOrEquipmentId = 'deviceId';
      } else {
        this.facilityOrEquipmentConfig = BatchCodeConfig.equipmentTableConfig(
          this.language, this.deviceTypeTemp, this.equipmentStatusFilterTemp);
        this.deviceOrEquipmentId = 'equipmentId';
      }
    });
    // 初始化编码标准列表
    this.initTableConfig();
    // 初始化设施/设备列表
    this.initFacilityTableConfig();
    // 获取设施设备集
    this.queryAssetTypeList().then(() => {
      this.queryCondition.bizCondition = {
        typeCode: this.deviceOrEquipmentList[0].typeCode
      };
      // 获取相应设施或设备类型编码标准列表
      this.queryCodingRulePageByType();
    });
  }

  /**
   * tab表单index
   */
  public changeTab(index: number): void {
    this.currentTabIndex = index;
    this.queryCondition = new QueryConditionModel();
    this.queryCondition.bizCondition = {
      typeCode: this.deviceOrEquipmentList[index].typeCode
    };
    this.selectData = this.deviceOrEquipmentList[index].selectData;
    this.initTableConfig();
    this.queryCodingRulePageByType();
  }

  /**
   * 上一步
   * @ param val 当前步骤
   */
  public handPrevSteps(val: number): void {
    this.isActiveSteps = val - 1;
    this.setData[1].activeClass = '';
    this.setData[0].activeClass = 'active';
  }

  /**
   * 下一步
   * @ param val 当前步骤
   */
  public handNextSteps(val: number): void {
    this.isActiveSteps = val + 1;
    this.setData[1].activeClass = 'active';
    this.setData[0].activeClass = '';
    this.getHitDevicePage();
  }

  /**
   * 数据提交
   */
  public handStepsSubmit(): void {
    this.isSaveLoading = true;
    if (this.selectDeviceOrEquipmentInformation.some(item => item.deviceCode || item.equipmentCode)) {
      this.isConfirmUpdateAssetCode();
    } else {
      this.isConfirmUpdate = '';
      this.batchUpdateDeviceOrEquipmentCode();
    }
  }

  /**
   * 取消
   */
  public handCancelSteps(): void {
    window.history.go(-1);
  }

  /**
   * 第一步列表分页查询
   * @param event PageModel
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.queryCodingRulePageByType();
  }

  /**
   * 第二步列表分页查询
   * @param event PageModel
   */
  public secondPageChange(event: PageModel): void {
    this.facilityOrEquipmentQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.facilityOrEquipmentQueryCondition.pageCondition.pageSize = event.pageSize;
    this.getHitDevicePage();
  }

  /**
   * 获取资产类型设施设备集
   */
  private queryAssetTypeList(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.$CodingStandardApiService.queryDeviceTypeList().subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          if (this.pageType === '1') {
            // 设施类型
            this.deviceOrEquipmentList = result.data.filter(item => item.generalClassification === '1');
          } else {
            // 设备类型
            this.deviceOrEquipmentList = result.data.filter(item => item.generalClassification === '2');
          }
          this.deviceOrEquipmentList.forEach(item => {
            this.selectCodingRuleIds[item.typeCode] = [];
            // 存储选择的数据
            item.selectData = [];
            // 设施或设备名称国际化
            if (this.pageType === '1') {
              item.typeName = CommonUtil.codeTranslate(DeviceTypeEnum, this.$nzI18n, item.typeCode, 'facility.config');
            } else {
              item.typeName = CommonUtil.codeTranslate(EquipmentTypeEnum, this.$nzI18n, item.typeCode, 'facility');
            }
          });
          resolve();
        }
      }, () => {
        reject();
      });
    });
  }

  /**
   * 获取相应设施或设备类型编码标准列表
   */
  private queryCodingRulePageByType(): void {
    this.tableConfig.isLoading = true;
    this.$FacilityForCommonService.queryCodingRulePageByType(this.queryCondition).subscribe((result: ResultModel<any>) => {
      this.tableConfig.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.dataSet = result.data;
        this.pageBean.Total = result.totalCount;
        this.pageBean.pageIndex = result.pageNum;
        this.pageBean.pageSize = result.size;
        this.dataSet.forEach(item => {
          if (item.scopeType === '0') {
            item.scopeNameStr = this.language.all;
          }
          item.buttonDisabled = item.codingRuleStatus === CodingStandardEnum.enable;
          item.switchLoading = false;
        });
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 通过选择的编码标准查询中标的设施列表
   */
  private getHitDevicePage(): void {
    const deviceOrEquipmentCondition = [];
    Object.keys(this.selectCodingRuleIds).forEach(key => {
      if (this.selectCodingRuleIds[key].length) {
        deviceOrEquipmentCondition.push({
          typeCode: key,
          codingRuleIds: this.selectCodingRuleIds[key],
        });
      }
    });
    this.facilityOrEquipmentTableConfig.isLoading = true;
    let requestUrl;
    if (this.pageType === '1') {
      this.facilityOrEquipmentQueryCondition.bizCondition = {
        deviceCondition: deviceOrEquipmentCondition
      };
      // 获取设施列表
      requestUrl = this.$FacilityForCommonService.getHitDevicePage(this.facilityOrEquipmentQueryCondition);
    } else {
      this.facilityOrEquipmentQueryCondition.bizCondition = {
        equipmentCondition: deviceOrEquipmentCondition
      };
      // 获取设备列表
      requestUrl = this.$FacilityForCommonService.getHitEquipmentPage(this.facilityOrEquipmentQueryCondition);
    }
    requestUrl.subscribe((result: ResultModel<any>) => {
      this.facilityOrEquipmentTableConfig.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
          result.data.forEach(item => {
            if (this.pageType === '1') {
              item.iconClass = CommonUtil.getFacilityIconClassName(item.deviceType);
            } else {
              // 设置状态样式
              const iconStyle = CommonUtil.getEquipmentStatusIconClass(item.equipmentStatus, 'list');
              item.statusIconClass = iconStyle.iconClass;
              item.statusColorClass = iconStyle.colorClass;
              // 获取设备类型图标
              item.iconClass = CommonUtil.getEquipmentIconClassName(item.equipmentType);
            }
          });
          this.facilityOrEquipmentDataSet = result.data;
          this.facilityOrEquipmentPageBean.Total = result.totalCount;
          this.facilityOrEquipmentPageBean.pageIndex = result.pageNum;
          this.facilityOrEquipmentPageBean.pageSize = result.size;
      }
    }, () => {
      this.facilityOrEquipmentTableConfig.isLoading = false;
    });
  }

  /**
   * 设施/设备批量编码
   */
  private batchUpdateDeviceOrEquipmentCode(): void {
    let selectCodingRuleIds = [];
    let selectDeviceOrEquipmentIds;
    Object.keys(this.selectCodingRuleIds).forEach(item => {
      selectCodingRuleIds = selectCodingRuleIds.concat(this.selectCodingRuleIds[item]);
    });
    let requestUrl;
    const body = {
      codingRuleId: selectCodingRuleIds,
      confirmUpdate: this.isConfirmUpdate
    };
    if (this.pageType === '1') {
      // 设施批量编码
      selectDeviceOrEquipmentIds = this.selectDeviceOrEquipmentInformation.map(item => item.deviceId);
      body['deviceIds'] = selectDeviceOrEquipmentIds;
      requestUrl = this.$FacilityForCommonService.batchUpdateDeviceCode(body);
    } else {
      // 设备批量编码
      selectDeviceOrEquipmentIds = this.selectDeviceOrEquipmentInformation.map(item => item.equipmentId);
      body['equipmentIds'] = selectDeviceOrEquipmentIds;
      requestUrl = this.$FacilityForCommonService.batchUpdateEquipmentCode(body);
    }
    requestUrl.subscribe((result: ResultModel<any>) => {
      this.isSaveLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.language.batchCodingSuccess);
        window.history.go(-1);
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.isSaveLoading = false;
    });
  }


  /**
   * 初始化智慧杆表格配置
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      outHeight: 108,
      keepSelected: true,
      selectedIdKey: 'codingRuleId',
      showSizeChanger: true,
      scroll: {x: '1804px', y: '340px'},
      noIndex: true,
      showSearchExport: false,
      notShowPrint: true,
      closeCacheQueryConditions: true,
      columnConfig: [
        {type: 'select', key: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          type: 'serial-number', key: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        { // 名称
          title: this.language.codingStandard.codingName, key: 'codingRuleName', width: 150,
          fixedStyle: {fixedLeft: true, style: {left: '124px'}},
          isShowSort: true,
        },
        { // 编码内容
          title: this.language.codingStandard.codingContent, key: 'codingRuleContent', width: 150,
          isShowSort: true,
        },
        { // 最大编码长度
          title: this.language.codingStandard.maxEncodingLength, key: 'maxLength', width: 150,
          isShowSort: true,
        },
        // 启用状态
        {
          title: this.language.codingStandard.enabledState,
          key: 'codingRuleStatus',
          width: 100,
          isShowSort: true,
          type: 'render',
          renderTemplate: this.enableStatus,
        },
        // 编码范围
        {
          title: this.language.codingStandard.codingRange, key: 'scopeNameStr', width: 150
        },
        { // 备注
          title: this.language.remarks, key: 'remark',
          isShowSort: true,
          width: 150,
        }
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.queryCodingRulePageByType();
      },
      // 选中数据获取
      handleSelect: (event: any[]) => {
        const arr = event.map(item => item.codingRuleId);
        const title = this.deviceOrEquipmentList[this.currentTabIndex].typeCode;
        // 存储选择数据的id
        this.selectCodingRuleIds[title] = arr;
        // 当前选择的数据所有值存在数组对象中
        this.deviceOrEquipmentList[this.currentTabIndex].selectData = event;
        // 点击下一步时判断勾选的数据是否有禁用的，如果有就禁用
        const isSelectData = this.deviceOrEquipmentList.filter(item => item.selectData.length);
        if (isSelectData.length) {
          this.nextButtonDisable = isSelectData.some(item => item.selectData.some(_item => !_item.buttonDisabled));
        } else {
          this.nextButtonDisable = true;
        }
      },
    };
  }

  /**
   * 初始化设施表格配置
   */
  private initFacilityTableConfig(): void {
    this.facilityOrEquipmentTableConfig = {
      isDraggable: true,
      isLoading: false,
      outHeight: 108,
      keepSelected: true,
      selectedIdKey: this.deviceOrEquipmentId,
      showSizeChanger: true,
      primaryKey: '03-1',
      closeCacheQueryConditions: true,
      scroll: {x: '1804px', y: '340px'},
      notShowPrint: true,
      showSearchExport: false,
      noIndex: true,
      columnConfig: this.facilityOrEquipmentConfig,
      showPagination: true,
      bordered: false,
      showSearch: false,
      // 排序
      sort: (event: SortCondition) => {
        this.facilityOrEquipmentQueryCondition.sortCondition.sortField = event.sortField;
        this.facilityOrEquipmentQueryCondition.sortCondition.sortRule = event.sortRule;
        this.getHitDevicePage();
      },
      // 选中数据获取
      handleSelect: (event: any[]) => {
        // 选中的设施/设备数据
        this.selectDeviceOrEquipmentInformation = event;
      },
    };
  }

  /**
   * 监听switch开关事件
   * @ param event
   */
  public switchChange(event): void {
    this.dataSet.forEach(item => {
      if (event.codingRuleId === item.codingRuleId) {
        item.switchLoading = true;
      }
    });
    const body = {
      codingRuleIds: [event.codingRuleId]
    };
    // 状态由禁用状态变为启用状态
    if (!event.buttonDisabled) {
      this.enableCodingRule(body, '1');
    } else {
      // 状态由启用状态变为禁用状态
      this.disableCodingRule(body, '0');
    }
  }

  /**
   * 编码标准禁用
   */
  private disableCodingRule(body, status): void {
    this.$CodingStandardApiService.disableCodingRule(body).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        this.isChangeStatus(body, false, status);
        this.$message.success(this.language.disableCodingSuccessfully);
      } else {
        this.$message.error(result.msg);
        this.isChangeStatus(body, false);
      }
    }, () => {
      this.isChangeStatus(body, false);
    });
  }

  /**
   * 编码标准启用
   */
  private enableCodingRule(body, status): void {
    this.$CodingStandardApiService.enableCodingRule(body).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        this.isChangeStatus(body, false, status);
        this.$message.success(this.language.encodingSuccessfully);
      } else {
        this.$message.error(result.msg);
        this.isChangeStatus(body, false);
      }
    }, () => {
      this.isChangeStatus(body, false);
    });
  }

  /**
   * 启用禁用调接口成功后，改变按钮状态，否则不变
   */
  private isChangeStatus(body, isLoading: boolean, isChangeStatus?): void {
    this.dataSet.forEach(item => {
      if (body.codingRuleIds[0] === item.codingRuleId) {
        item.switchLoading = isLoading;
        if (isChangeStatus) {
          item.codingRuleStatus = isChangeStatus;
          item.buttonDisabled = isChangeStatus === '1';
        }
      }
    });
    this.deviceOrEquipmentList.forEach(item => {
      item.selectData.forEach(i => {
        if (body.codingRuleIds[0] === i.codingRuleId) {
          i.codingRuleStatus = isChangeStatus;
          i.buttonDisabled = isChangeStatus === '1';
        }
      });
    });
    const isSelectData = this.deviceOrEquipmentList.filter(item => item.selectData.length);
    if (isSelectData.length) {
      this.nextButtonDisable = isSelectData.some(item => item.selectData.some(_item => !_item.buttonDisabled));
    } else {
      this.nextButtonDisable = true;
    }
  }

  /**
   * 是否覆盖原有资产编码弹窗
   */
  private isConfirmUpdateAssetCode(): void {
    this.$modalService.confirm({
      nzTitle: this.language.isCoverAssetCode,
      nzOkType: 'danger',
      // nzContent: `是否启动项目？`,
      nzOkText: this.language.deny,
      nzMaskClosable: false,
      nzOnOk: () => {
        this.isConfirmUpdate = '1';
        this.batchUpdateDeviceOrEquipmentCode();
      },
      nzCancelText: this.language.yes,
      nzOnCancel: () => {
        this.isConfirmUpdate = '2';
        this.batchUpdateDeviceOrEquipmentCode();
      }
    });
  }
}
