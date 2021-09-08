import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as _ from 'lodash';
import {NzI18nService} from 'ng-zorro-antd';
import {GroupApiService} from '../../share/service/group/group-api.service';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {TableComponent} from '../../../../shared-module/component/table/table.component';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {AssetManagementLanguageInterface} from '../../../../../assets/i18n/asset-manage/asset-management.language.interface';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {HISTORY_GO_STEP_CONST} from '../../share/const/facility-common.const';
import {QuickGroupTypeEnum} from '../../../../core-module/enum/facility/group.enum';
import {GroupDetailModel} from '../../../../core-module/model/facility/group-detail.model';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {OperateTypeEnum} from '../../../../shared-module/enum/page-operate-type.enum';
import {PAGE_NO_DEFAULT_CONST} from '../../../../core-module/const/common.const';
import {EquipmentStatusEnum, EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {DeviceStatusEnum, DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {FacilityListModel} from '../../../../core-module/model/facility/facility-list.model';
import {EquipmentListModel} from '../../../../core-module/model/equipment/equipment-list.model';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {SelectModel} from '../../../../shared-module/model/select.model';

/**
 * 新增设备或编辑设备组件
 */
@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.scss',
    '../../facility-common.scss'],
})
export class GroupDetailComponent implements OnInit, OnDestroy {

  // 设施状态
  @ViewChild('deviceStatusTemplate') private deviceStatusTemplate: TemplateRef<HTMLDocument>;
  // 分组类容模版
  @ViewChild('groupContentTemp') private groupContentTemp: TemplateRef<HTMLDocument>;
  // 设备类型
  @ViewChild('equipmentTypeTemp') private equipmentTypeTemp: TemplateRef<HTMLDocument>;
  //  设备状态模版
  @ViewChild('equipmentStatusTemp') private equipmentStatusTemp: TemplateRef<HTMLDocument>;
  // 设施列表
  @ViewChild('facilityTable') private facilityTable: TableComponent;
  // 设施列表
  @ViewChild('equipmentTable') private equipmentTable: TableComponent;
  // 设施类型模版
  @ViewChild('deviceTypeTemp') private deviceTypeTemp: TableComponent;
  // 设施选择器过滤框
  @ViewChild('deviceSelectorTemplate') private deviceSelectorTemplate: TemplateRef<HTMLDocument>;
  // 设备列表处的设施类型
  @ViewChild('deviceRefEquipTemp') private deviceRefEquipTemp: TemplateRef<HTMLDocument>;
  // 设施过滤选择器是否显示
  public facilityFilterShow: boolean = false;
  // 页面加载状态
  public pageLoading: boolean = false;
  // 表单字段
  public formColumn: FormItem[] = [];
  // 保存按钮状态
  public saveButtonDisable: boolean = true;
  // 保存按钮状态
  public isLoading: boolean = false;
  // 表单实例
  public formStatus: FormOperate;
  // 公用国际化
  public commonLanguage: CommonLanguageInterface;
  // 资产管理国际化
  public assetLanguage: AssetManagementLanguageInterface;
  // 资产管理公用国际化
  public language: FacilityLanguageInterface;
  // 设备类型枚举
  public equipmentTypeEnum = EquipmentTypeEnum;
  // 设备状态枚举
  public equipmentStatusEnum = EquipmentStatusEnum;
  // 设施状态
  public deviceStatusCodeEnum = DeviceStatusEnum;
  // 国际化前缀枚举
  public languageEnum = LanguageEnum;
  // 分组内容选择器是否显示
  public showGroupContent: boolean = false;
  // 设施快速分组
  public deviceGroupType: string;
  // 设备快速分组类型
  public equipmentGroupType: string;
  // 设施列表数据集
  public facilityData: FacilityListModel[] = [];
  // 设备列表数据集
  public equipmentData: EquipmentListModel[] = [];
  // 设施列表分页参数
  public facilityPageBean: PageModel = new PageModel();
  // 设备列表分页参数
  public equipmentPageBean: PageModel = new PageModel();
  // 设施列表表格参数
  public facilityTableConfig: TableConfigModel;
  // 设备列表参数
  public equipmentTableConfig: TableConfigModel;
  // 页面操作类型
  public operateType: string = OperateTypeEnum.add;
  // 页面标题
  public pageTitle: string;
  // 选择分组内容中设施和设备的条数
  public groupContentMessage: string = '';
  // 设施类型枚举
  public deviceTypeEnum = DeviceTypeEnum;
  // 设施过滤
  public filterValue: FilterCondition;
  //  快速分组类型枚举
  public quickGroupTypeEnum = QuickGroupTypeEnum;
  // 已选择过滤设施的名称
  public selectedDeviceName: string;
  // 所选设施
  public selectedFacility: FacilityListModel[] = [];
  //  设施查询参数
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // 设备列表查询参数
  private equipmentQueryCondition: QueryConditionModel = new QueryConditionModel();
  // 新增-编辑（回显）公用参数
  private addGroupParams: GroupDetailModel = new GroupDetailModel();
  // 已选设施id
  private selectedDeviceIds: string[] = [];
  // 已选设施id
  private selectedEquipmentIds: string[] = [];
  // 分组内容设备列表设备状态筛选枚举
  private equipmentStatus;

  /**
   * 构造器
   */
  constructor(
    private $nzI18n: NzI18nService,
    private $ruleUtil: RuleUtil,
    private $groupApiService: GroupApiService,
    private $active: ActivatedRoute,
    private $message: FiLinkModalService,
    private $facilityCommonApiService: FacilityForCommonService) {
  }

  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.assetLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);
    // 初始化表单
    this.initForm();
    // 获取操作类型生成title
    this.operateType = this.$active.snapshot.params.type;
    // 获取页面标题
    this.pageTitle = this.operateType === OperateTypeEnum.update ?
      this.assetLanguage.updateGroup : this.assetLanguage.addGroup;
    // 如果是修改页面则需要查询分组信息进行数据回显
    if (this.operateType === OperateTypeEnum.update) {
      this.handelGroupDetail();
    }
    this.equipmentStatus = CommonUtil.codeTranslate(EquipmentStatusEnum, this.$nzI18n, null, LanguageEnum.facility);
    // 过滤已拆除状态枚举
    this.equipmentStatus = this.equipmentStatus.filter(item => item.code !== EquipmentStatusEnum.dismantled);
  }

  /**
   * 组件销毁
   */
  public ngOnDestroy(): void {
    this.deviceStatusTemplate = null;
    this.groupContentTemp = null;
    this.equipmentTypeTemp = null;
    this.equipmentStatusTemp = null;
    this.facilityTable = null;
    this.equipmentTable = null;
  }

  /**
   * 取消和关闭弹框
   */
  public onClose(): void {
    if (!_.isEmpty(this.facilityTable)) {
      this.facilityTable.handleRest();
    }
    if (!_.isEmpty(this.facilityTableConfig)) {
      this.facilityTableConfig.showSearch = false;
    }
    this.showGroupContent = false;
    this.queryCondition = new QueryConditionModel();
    this.equipmentQueryCondition = new QueryConditionModel();
    this.queryCondition.filterConditions = [];
  }

  /**
   * 设施快速分组
   */
  public onChangeDeviceGroupType(event: string): void {
    this.facilityTable.keepSelectedData.clear();
    this.deviceGroupType = event;
    this.onClickQuickDevice();
  }

  /**
   * 设备快速分组
   */
  public onChangeEquipmentGroupType(event: string): void {
    this.equipmentTable.keepSelectedData.clear();
    this.equipmentGroupType = event;
    this.onClickQuickEquipment();
  }

  /**
   * 选择过滤的设施数据
   */
  public onSelectData(data: FacilityListModel[]): void {
    this.selectedFacility = data || [];
    if (_.isEmpty(data)) {
      this.filterValue.filterValue = [];
      this.selectedDeviceName = '';
    } else {
      this.selectedDeviceName = data.map(item => item.deviceName).join(',');
      this.filterValue.filterValue = data.map(row => row.deviceId);
    }
  }

  /**
   * 修改设施列表的分页
   */
  public facilityPageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.queryDeviceList();
  }

  /**
   * 修改设备列表的分页
   */
  public equipmentPageChange(event: PageModel): void {
    this.equipmentQueryCondition.pageCondition.pageSize = event.pageSize;
    this.equipmentQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryEquipmentList();
  }

  /**
   * 确定选择分组内容
   */
  public onOk(): void {
    this.showGroupContent = false;
  }

  /**
   * 设施快速分组勾选数据
   */
  public onClickQuickDevice(): void {
    this.queryCondition.bizCondition = {selectType: this.deviceGroupType};
    this.$groupApiService.quickSelectGroupDeviceInfoList(this.queryCondition).subscribe(
      (result: ResultModel<FacilityListModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          const ids = result.data.map(item => item.deviceId);
          this.selectedDeviceIds = _.cloneDeep(ids);
          this.setSelected();
        }
      });
  }

  /**
   *  清空
   */
  public onClickCleanUp(): void {
    this.facilityTable.keepSelectedData.clear();
    this.facilityTable.checkAll(false);
    this.equipmentTable.keepSelectedData.clear();
    this.equipmentTable.checkAll(false);
    this.selectedEquipmentIds = [];
    this.selectedDeviceIds = [];
  }

  /**
   * 设置回勾选
   */
  public setSelected(): void {
    this.selectedEquipmentIds = _.isEmpty(this.selectedEquipmentIds) ? this.addGroupParams.groupEquipmentIdList : this.selectedEquipmentIds;
    this.selectedDeviceIds = _.isEmpty(this.selectedDeviceIds) ? this.addGroupParams.groupDeviceInfoIdList : this.selectedDeviceIds;
    this.facilityData.forEach(item => {
      // 设置选中的状态
      item.checked = this.selectedDeviceIds.includes(item.deviceId);
    });
    this.facilityTable.keepSelectedData.clear();
    this.selectedDeviceIds.forEach(item => {
      this.facilityTable.keepSelectedData.set(item, {deviceId: item});
    });
    // 遍历设置选中状态
    this.equipmentTable.keepSelectedData.clear();
    // 触发表格修改状态事件，便于获取一次性获取跨页的设施数据
    this.facilityTable.updateSelectedData();
    this.equipmentData.forEach(item => {
      // 设置设备回显勾中
      item.checked = this.selectedEquipmentIds.includes(item.equipmentId);
    });
    this.selectedEquipmentIds.forEach(item => {
      this.equipmentTable.keepSelectedData.set(item, {equipmentId: item});
    });
    // 触发表格选择事件便于一次性获取表格勾选项
    this.equipmentTable.updateSelectedData();
  }

  /**
   * 设备快速分组选择数据
   */
  public onClickQuickEquipment(): void {
    this.equipmentQueryCondition.bizCondition = {selectType: this.equipmentGroupType};
    this.$groupApiService.quickSelectGroupEquipmentInfoList(this.equipmentQueryCondition)
      .subscribe((res: ResultModel<EquipmentListModel[]>) => {
        if (res.code === ResultCodeEnum.success) {
          // 获取返回的设备数据集
          const equipmentIds = res.data.map(v => v.equipmentId);
          this.selectedEquipmentIds = _.cloneDeep(equipmentIds);
          this.setSelected();
        }
      });
  }

  /**
   * 获取表单实例
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    event.instance.group.statusChanges.subscribe(() => {
      // 判断是否选择了分组内容的设施或者设备
      const selectedContent = _.isEmpty(this.addGroupParams.groupDeviceInfoIdList) && _.isEmpty(this.addGroupParams.groupEquipmentIdList);
      // 表单校验是否填写了分组名称
      this.saveButtonDisable = !event.instance.getValid('groupName') || selectedContent;
    });
  }

  /**
   * 保存分组信息
   */
  public onClickSaveGroup(): void {
    const formValue = this.formStatus.group.getRawValue();
    this.addGroupParams.groupName = formValue.groupName;
    this.addGroupParams.remark = formValue.remark;
    let successMsg;
    this.isLoading = true;
    let request;
    // 新增操作路径
    if (this.operateType === OperateTypeEnum.add) {
      request = this.$groupApiService.addGroupInfo(this.addGroupParams);
      successMsg = this.assetLanguage.addGroupSuccess;
    } else {
      // 修改操作路径
      request = this.$groupApiService.updateGroupInfo(this.addGroupParams);
      successMsg = this.assetLanguage.updateGroupSuccess;
    }
    if (request) {
      request.subscribe(
        (result: ResultModel<string>) => {
          this.isLoading = false;
          if (result.code === ResultCodeEnum.success) {
            this.$message.success(successMsg);
            this.onClickCancel();
          } else {
            this.$message.error(result.msg);
          }
        }, () => {
          this.isLoading = false;
        });
    }
  }

  /**
   * 确定选择分组内容
   */
  public onClickSelectContent(): void {
    this.addGroupParams.groupEquipmentIdList = this.selectedEquipmentIds;
    this.addGroupParams.groupDeviceInfoIdList = this.selectedDeviceIds;
    this.groupContentMessage = '';
    // 拼接已选数据再文本框中显示
    if (!_.isEmpty(this.selectedDeviceIds)) {
      this.groupContentMessage = `${this.assetLanguage.selectedDevice}${this.selectedDeviceIds.length}${this.assetLanguage.item} `;
    }
    if (!_.isEmpty(this.selectedEquipmentIds)) {
      this.groupContentMessage = this.groupContentMessage.concat(`${this.assetLanguage.selectedEquipment}${this.selectedEquipmentIds.length}${this.assetLanguage.item}`);
    }
    this.formStatus.resetControlData('groupContent', this.groupContentMessage);
    this.showGroupContent = false;
    this.onClose();
  }

  /**
   * 取消编辑
   */
  public onClickCancel(): void {
    // 回到之前的页面
    window.history.go(HISTORY_GO_STEP_CONST);
  }

  /**
   * 打开分组类容选择器
   */
  public onShowGroupContent(): void {
    // 初始化设施表格
    this.initFacilityTableConfig();
    // 初始化设备表格
    this.initEquipmentTableConfig();
    this.showGroupContent = true;
    // 查询设施列表
    this.queryDeviceList();
    // 查询设备列表
    this.queryEquipmentList();
  }

  /**
   * 取消选择分组内容
   */
  public onClickCancelContent(): void {
    this.queryCondition.pageCondition.pageNum = PAGE_NO_DEFAULT_CONST;
    this.equipmentQueryCondition.pageCondition.pageNum = PAGE_NO_DEFAULT_CONST;
    this.selectedDeviceIds = [];
    this.selectedEquipmentIds = [];
    this.deviceGroupType = null;
    this.equipmentGroupType = null;
    this.onClose();
  }

  /**
   * 打开所属设施选择器
   */
  public onShowDeviceSelector(filterValue: FilterCondition): void {
    this.filterValue = filterValue;
    if (!this.filterValue.filterValue) {
      this.filterValue.filterValue = [];
    }
    this.facilityFilterShow = true;
  }

  /**
   *  处理分组基本信息进行回显
   */
  private handelGroupDetail(): void {
    let groupId = '';
    this.$active.queryParams.subscribe(params => {
      groupId = params.groupId;
    });
    const queryBody = {
      groupId: groupId
    };
    // 根据分组ID查询分组信息
    this.$groupApiService.queryGroupDeviceAndEquipmentByGroupInfoId(queryBody).subscribe(
      (res: ResultModel<GroupDetailModel>) => {
        if (res.code === ResultCodeEnum.success) {
          this.addGroupParams = res.data || null;
          this.selectedEquipmentIds = this.addGroupParams ? res.data.groupEquipmentIdList : [];
          this.selectedDeviceIds = this.addGroupParams ? res.data.groupDeviceInfoIdList : [];
          this.onClickSelectContent();
          // 处理表单数据进行回显
          this.formStatus.resetData(this.addGroupParams);
        } else {
          this.$message.error(res.msg);
        }
      });
  }

  /**
   *  查询设施列表
   */
  private queryDeviceList(): void {
    this.facilityTableConfig.isLoading = true;
    this.queryCondition.bizCondition = {};
    const facilityFilter = this.queryCondition.filterConditions.filter(item => item.filterField === 'deviceType');
    if (_.isEmpty(facilityFilter)) {
      const facilityRole = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
      let facilityTypes = facilityRole.map(row => row.code) || [];
      facilityTypes = facilityTypes.filter(v => ![DeviceTypeEnum.opticalBox, DeviceTypeEnum.well, DeviceTypeEnum.outdoorCabinet].includes(v as DeviceTypeEnum)) || [];
      const equipmentFilter = new FilterCondition('deviceType', OperatorEnum.in, facilityTypes);
      this.queryCondition.filterConditions.push(equipmentFilter);
    }
    this.$facilityCommonApiService.deviceListByPage(this.queryCondition).subscribe(
      (result: ResultModel<FacilityListModel[]>) => {
        this.facilityTableConfig.isLoading = false;
        this.facilityPageBean.Total = result.totalCount;
        this.facilityPageBean.pageIndex = result.pageNum;
        this.facilityPageBean.pageSize = result.size;
        if (result.code === ResultCodeEnum.success) {
          this.facilityData = result.data;
          if (!_.isEmpty(this.facilityData)) {
            this.facilityData.forEach(item => {
              // 处理状态图标和国际化
              const statusType = CommonUtil.getDeviceStatusIconClass(item.deviceStatus);
              item.deviceStatusIconClass = statusType.iconClass;
              item.deviceStatusColorClass = statusType.colorClass;
              item.iconClass = CommonUtil.getFacilityIConClass(item.deviceType);
              this.setSelected();
            });
          }
        }
      }, () => {
        this.facilityTableConfig.isLoading = false;
      });
  }

  /**
   *  查询设备列表
   */
  private queryEquipmentList(): void {
    this.equipmentTableConfig.isLoading = true;
    this.equipmentQueryCondition.bizCondition = {};
    const equipmentTypeFilter = this.equipmentQueryCondition.filterConditions.filter(item => item.filterField === 'equipmentType');
    if (_.isEmpty(equipmentTypeFilter)) {
      const equipmentRole = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n);
      let equipmentTypes = equipmentRole.map(row => row.code) || [];
      equipmentTypes = equipmentTypes.filter(v => v !== EquipmentTypeEnum.intelligentEntranceGuardLock) || [];
      const equipmentFilter = new FilterCondition('equipmentType', OperatorEnum.in, equipmentTypes);
      this.equipmentQueryCondition.filterConditions.push(equipmentFilter);
    }
    this.$facilityCommonApiService.equipmentListByPage(this.equipmentQueryCondition).subscribe(
      (result: ResultModel<EquipmentListModel[]>) => {
        this.equipmentTableConfig.isLoading = false;
        this.equipmentPageBean.Total = result.totalCount;
        this.equipmentPageBean.pageSize = result.size;
        this.equipmentPageBean.pageIndex = result.pageNum;
        if (result.code === ResultCodeEnum.success) {
          this.equipmentData = result.data;
          if (!_.isEmpty(this.equipmentData)) {
            this.equipmentData.forEach(item => {
              // 处理设施类型图标
              item.deviceIcon = CommonUtil.getFacilityIConClass(item.deviceType);
              // 设置设备类型的图标
              item.iconClass = CommonUtil.getEquipmentTypeIcon(item);
              // 设置设备状态图标样式
              const iconStyle = CommonUtil.getEquipmentStatusIconClass(item.equipmentStatus, 'list');
              item.statusIconClass = iconStyle.iconClass;
              item.statusColorClass = iconStyle.colorClass;
              item.deviceName = item.deviceInfo ? item.deviceInfo.deviceName : '';
              // 设置设备列表反勾选
              this.setSelected();
            });
          }
        }
      }, () => {
        this.equipmentTableConfig.isLoading = false;
      });
  }

  /**
   * 初始化表单字段
   */
  private initForm(): void {
    this.formColumn = [
      {
        label: this.language.name,
        key: 'groupName',
        type: 'input',
        placeholder: this.language.pleaseEnter,
        col: 24,
        require: true,
        rule: [
          {required: true},
          RuleUtil.getNameMaxLengthRule(),
          this.$ruleUtil.getNameRule()
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value =>
              this.$groupApiService.checkGroupInfoByName(
                {groupName: value, groupId: this.addGroupParams.groupId}),
            res => res.data)
        ],
      },
      {
        label: this.assetLanguage.groupContent,
        key: 'groupContent',
        type: 'custom',
        template: this.groupContentTemp,
        placeholder: this.language.picInfo.pleaseChoose,
        col: 24,
        require: true,
        rule: [
          {required: true}],
        customRules: [],
        asyncRules: [],
      },
      {
        label: this.language.remarks,
        key: 'remark',
        type: 'textarea',
        placeholder: this.language.pleaseEnter,
        col: 24,
        require: false,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule()],
        customRules: [],
        asyncRules: [],
      }
    ];
  }

  /**
   *  初始化设施表格参数
   */
  private initFacilityTableConfig(): void {
    this.facilityTableConfig = {
      isDraggable: false,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      notShowPrint: true,
      noAutoHeight: true,
      scroll: {x: '600px', y: '400px'},
      noIndex: true,
      showSearchExport: false,
      keepSelected: true,
      selectedIdKey: 'deviceId',
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        { // 名称
          title: this.language.deviceName_a, key: 'deviceName',
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        { // 类型
          title: this.language.deviceType_a,
          key: 'deviceType',
          type: 'render',
          width: 150,
          renderTemplate: this.deviceTypeTemp,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {
            type: 'select',
            selectInfo: this.getFacilityTypeRole(),
            selectType: 'multiple',
            label: 'label',
            value: 'code'
          }
        },
        { // 型号
          title: this.language.model,
          key: 'deviceModel',
          width: 100,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        { // 设备数量
          title: this.language.equipmentQuantity,
          key: 'equipmentQuantity', width: 100,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 状态
          title: this.language.deviceStatus_a,
          key: 'deviceStatus',
          width: 120,
          type: 'render',
          renderTemplate: this.deviceStatusTemplate,
          configurable: false,
          isShowSort: true,
          searchable: true,
          minWidth: 90,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: CommonUtil.codeTranslate(this.deviceStatusCodeEnum, this.$nzI18n, null),
            label: 'label',
            value: 'code'
          }
        },
        {  // 详细地址
          title: this.language.address,
          key: 'address',
          width: 150,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.commonLanguage.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 150,
          fixedStyle: {fixedRight: false, style: {right: '0px'}}
        }
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [],
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.queryDeviceList();
      },
      // 过滤查询
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = PAGE_NO_DEFAULT_CONST;
        this.queryCondition.filterConditions = event;
        this.queryDeviceList();
      },
      // 勾选或去勾选数据做处理
      handleSelect: (event: FacilityListModel[]) => {
        // 获取列表中未选中的数据
        const unChecked = this.facilityData.filter(item => !item.checked);
        const unCheckIds = unChecked.map(item => {
          return item.deviceId;
        });
        // 获取选中数据的id
        const checkIdIds = event.map(row => {
          return row.deviceId;
        });
        //  将选中的数据添加进list并且去重
        this.selectedDeviceIds =
          _.uniq(this.selectedDeviceIds.concat(checkIdIds));
        this.selectedDeviceIds = this.selectedDeviceIds.filter(
          row => !unCheckIds.includes(row));
      }
    };
  }

  /**
   *  初始化设备的配置
   */
  private initEquipmentTableConfig(): void {
    this.equipmentTableConfig = {
      isDraggable: false,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      notShowPrint: true,
      noAutoHeight: true,
      scroll: {x: '600px', y: '400px'},
      noIndex: true,
      showSearchExport: false,
      showPagination: true,
      bordered: false,
      showSearch: false,
      keepSelected: true,
      selectedIdKey: 'equipmentId',
      operation: [],
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        { // 名称
          title: this.language.equipmentName,
          key: 'equipmentName',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 类型
          title: this.language.equipmentType,
          key: 'equipmentType',
          isShowSort: true,
          type: 'render',
          width: 150,
          searchable: true,
          renderTemplate: this.equipmentTypeTemp,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: this.getEquipmentTypeRole(),
            label: 'label',
            value: 'code'
          }
        },
        { // 状态
          title: this.language.equipmentStatus,
          key: 'equipmentStatus',
          width: 130,
          type: 'render',
          renderTemplate: this.equipmentStatusTemp,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: this.equipmentStatus,
            label: 'label',
            value: 'code'
          }
        }, { // 所属设施
          title: this.language.affiliatedDevice,
          key: 'deviceName',
          searchKey: 'deviceId',
          width: 150,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this.deviceSelectorTemplate
          },
        },
        { // 设施类型
          title: this.language.deviceType_a,
          key: 'deviceType',
          type: 'render',
          renderTemplate: this.deviceRefEquipTemp,
          width: 150,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: this.getFacilityTypeRole(),
            label: 'label',
            value: 'code'
          }
        },
        { // 详细地址
          title: this.language.address,
          key: 'address',
          searchable: true,
          width: 150,
          searchConfig: {type: 'input'}
        },
        {
          title: this.commonLanguage.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 150,
          fixedStyle: {fixedRight: false, style: {right: '0px'}}
        }
      ],
      // 排序
      sort: (event: SortCondition) => {
        this.equipmentQueryCondition.sortCondition.sortField = event.sortField;
        this.equipmentQueryCondition.sortCondition.sortRule = event.sortRule;
        this.queryEquipmentList();
      },
      // 过滤查询数据
      handleSearch: (devices: FilterCondition[]) => {
        // 设置当前页为第一页
        this.equipmentQueryCondition.pageCondition.pageNum = PAGE_NO_DEFAULT_CONST;
        // 判断过滤条件是否包含设施的过滤
        const index = _.findIndex(devices, function (o) {
          return o.filterField === 'deviceId';
        });
        if (index >= 0 && !_.isEmpty(devices[index].filterValue)) {
          devices[index].operator = OperatorEnum.in;
        } else {
          this.selectedDeviceName = '';
          this.filterValue = null;
          this.selectedFacility = [];
          devices = devices.filter(item => item.filterField !== 'deviceId');
        }
        this.equipmentQueryCondition.filterConditions = devices;
        this.queryEquipmentList();
      },
      // 选中或去勾选
      handleSelect: (data: EquipmentListModel[]) => {
        // 获取选中数据的设备id
        const checkIdIds = data.map(row => {
          return row.equipmentId;
        });
        // 获取列表中未选中的数据
        const unEquipmentChecked = this.equipmentData.filter(item => !item.checked);
        const unCheckIds = unEquipmentChecked.map(item => {
          return item.equipmentId;
        });
        //  将选中的设备数据添加进list并且去重
        this.selectedEquipmentIds = _.uniq(this.selectedEquipmentIds.concat(checkIdIds));
        this.selectedEquipmentIds = this.selectedEquipmentIds.filter(v => !unCheckIds.includes(v));
      }
    };
  }

  /**
   * 获取设备列表的设备类型过滤下拉选
   */
  private getEquipmentTypeRole(): SelectModel[] {
    let equipments = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n) || [];
    if (!_.isEmpty(equipments)) {
      equipments = equipments.filter(item => item.code !== EquipmentTypeEnum.intelligentEntranceGuardLock);
    }
    return equipments;
  }

  /**
   * 获取可过滤的设施类型
   */
  private getFacilityTypeRole(): SelectModel[] {
    let devices = FacilityForCommonUtil.getRoleFacility(this.$nzI18n) || [];
    if (!_.isEmpty(devices)) {
      devices = devices.filter(item => ![DeviceTypeEnum.well, DeviceTypeEnum.outdoorCabinet, DeviceTypeEnum.opticalBox].includes(item.code as DeviceTypeEnum)) || [];
    }
    return devices;
  }
}

