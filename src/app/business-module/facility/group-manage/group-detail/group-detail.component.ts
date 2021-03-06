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
 * ?????????????????????????????????
 */
@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.scss',
    '../../facility-common.scss'],
})
export class GroupDetailComponent implements OnInit, OnDestroy {

  // ????????????
  @ViewChild('deviceStatusTemplate') private deviceStatusTemplate: TemplateRef<HTMLDocument>;
  // ??????????????????
  @ViewChild('groupContentTemp') private groupContentTemp: TemplateRef<HTMLDocument>;
  // ????????????
  @ViewChild('equipmentTypeTemp') private equipmentTypeTemp: TemplateRef<HTMLDocument>;
  //  ??????????????????
  @ViewChild('equipmentStatusTemp') private equipmentStatusTemp: TemplateRef<HTMLDocument>;
  // ????????????
  @ViewChild('facilityTable') private facilityTable: TableComponent;
  // ????????????
  @ViewChild('equipmentTable') private equipmentTable: TableComponent;
  // ??????????????????
  @ViewChild('deviceTypeTemp') private deviceTypeTemp: TableComponent;
  // ????????????????????????
  @ViewChild('deviceSelectorTemplate') private deviceSelectorTemplate: TemplateRef<HTMLDocument>;
  // ??????????????????????????????
  @ViewChild('deviceRefEquipTemp') private deviceRefEquipTemp: TemplateRef<HTMLDocument>;
  // ?????????????????????????????????
  public facilityFilterShow: boolean = false;
  // ??????????????????
  public pageLoading: boolean = false;
  // ????????????
  public formColumn: FormItem[] = [];
  // ??????????????????
  public saveButtonDisable: boolean = true;
  // ??????????????????
  public isLoading: boolean = false;
  // ????????????
  public formStatus: FormOperate;
  // ???????????????
  public commonLanguage: CommonLanguageInterface;
  // ?????????????????????
  public assetLanguage: AssetManagementLanguageInterface;
  // ???????????????????????????
  public language: FacilityLanguageInterface;
  // ??????????????????
  public equipmentTypeEnum = EquipmentTypeEnum;
  // ??????????????????
  public equipmentStatusEnum = EquipmentStatusEnum;
  // ????????????
  public deviceStatusCodeEnum = DeviceStatusEnum;
  // ?????????????????????
  public languageEnum = LanguageEnum;
  // ?????????????????????????????????
  public showGroupContent: boolean = false;
  // ??????????????????
  public deviceGroupType: string;
  // ????????????????????????
  public equipmentGroupType: string;
  // ?????????????????????
  public facilityData: FacilityListModel[] = [];
  // ?????????????????????
  public equipmentData: EquipmentListModel[] = [];
  // ????????????????????????
  public facilityPageBean: PageModel = new PageModel();
  // ????????????????????????
  public equipmentPageBean: PageModel = new PageModel();
  // ????????????????????????
  public facilityTableConfig: TableConfigModel;
  // ??????????????????
  public equipmentTableConfig: TableConfigModel;
  // ??????????????????
  public operateType: string = OperateTypeEnum.add;
  // ????????????
  public pageTitle: string;
  // ?????????????????????????????????????????????
  public groupContentMessage: string = '';
  // ??????????????????
  public deviceTypeEnum = DeviceTypeEnum;
  // ????????????
  public filterValue: FilterCondition;
  //  ????????????????????????
  public quickGroupTypeEnum = QuickGroupTypeEnum;
  // ??????????????????????????????
  public selectedDeviceName: string;
  // ????????????
  public selectedFacility: FacilityListModel[] = [];
  //  ??????????????????
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // ????????????????????????
  private equipmentQueryCondition: QueryConditionModel = new QueryConditionModel();
  // ??????-??????????????????????????????
  private addGroupParams: GroupDetailModel = new GroupDetailModel();
  // ????????????id
  private selectedDeviceIds: string[] = [];
  // ????????????id
  private selectedEquipmentIds: string[] = [];
  // ????????????????????????????????????????????????
  private equipmentStatus;

  /**
   * ?????????
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
   * ???????????????
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.assetLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);
    // ???????????????
    this.initForm();
    // ????????????????????????title
    this.operateType = this.$active.snapshot.params.type;
    // ??????????????????
    this.pageTitle = this.operateType === OperateTypeEnum.update ?
      this.assetLanguage.updateGroup : this.assetLanguage.addGroup;
    // ??????????????????????????????????????????????????????????????????
    if (this.operateType === OperateTypeEnum.update) {
      this.handelGroupDetail();
    }
    this.equipmentStatus = CommonUtil.codeTranslate(EquipmentStatusEnum, this.$nzI18n, null, LanguageEnum.facility);
    // ???????????????????????????
    this.equipmentStatus = this.equipmentStatus.filter(item => item.code !== EquipmentStatusEnum.dismantled);
  }

  /**
   * ????????????
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
   * ?????????????????????
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
   * ??????????????????
   */
  public onChangeDeviceGroupType(event: string): void {
    this.facilityTable.keepSelectedData.clear();
    this.deviceGroupType = event;
    this.onClickQuickDevice();
  }

  /**
   * ??????????????????
   */
  public onChangeEquipmentGroupType(event: string): void {
    this.equipmentTable.keepSelectedData.clear();
    this.equipmentGroupType = event;
    this.onClickQuickEquipment();
  }

  /**
   * ???????????????????????????
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
   * ???????????????????????????
   */
  public facilityPageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.queryDeviceList();
  }

  /**
   * ???????????????????????????
   */
  public equipmentPageChange(event: PageModel): void {
    this.equipmentQueryCondition.pageCondition.pageSize = event.pageSize;
    this.equipmentQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryEquipmentList();
  }

  /**
   * ????????????????????????
   */
  public onOk(): void {
    this.showGroupContent = false;
  }

  /**
   * ??????????????????????????????
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
   *  ??????
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
   * ???????????????
   */
  public setSelected(): void {
    this.selectedEquipmentIds = _.isEmpty(this.selectedEquipmentIds) ? this.addGroupParams.groupEquipmentIdList : this.selectedEquipmentIds;
    this.selectedDeviceIds = _.isEmpty(this.selectedDeviceIds) ? this.addGroupParams.groupDeviceInfoIdList : this.selectedDeviceIds;
    this.facilityData.forEach(item => {
      // ?????????????????????
      item.checked = this.selectedDeviceIds.includes(item.deviceId);
    });
    this.facilityTable.keepSelectedData.clear();
    this.selectedDeviceIds.forEach(item => {
      this.facilityTable.keepSelectedData.set(item, {deviceId: item});
    });
    // ????????????????????????
    this.equipmentTable.keepSelectedData.clear();
    // ?????????????????????????????????????????????????????????????????????????????????
    this.facilityTable.updateSelectedData();
    this.equipmentData.forEach(item => {
      // ????????????????????????
      item.checked = this.selectedEquipmentIds.includes(item.equipmentId);
    });
    this.selectedEquipmentIds.forEach(item => {
      this.equipmentTable.keepSelectedData.set(item, {equipmentId: item});
    });
    // ????????????????????????????????????????????????????????????
    this.equipmentTable.updateSelectedData();
  }

  /**
   * ??????????????????????????????
   */
  public onClickQuickEquipment(): void {
    this.equipmentQueryCondition.bizCondition = {selectType: this.equipmentGroupType};
    this.$groupApiService.quickSelectGroupEquipmentInfoList(this.equipmentQueryCondition)
      .subscribe((res: ResultModel<EquipmentListModel[]>) => {
        if (res.code === ResultCodeEnum.success) {
          // ??????????????????????????????
          const equipmentIds = res.data.map(v => v.equipmentId);
          this.selectedEquipmentIds = _.cloneDeep(equipmentIds);
          this.setSelected();
        }
      });
  }

  /**
   * ??????????????????
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    event.instance.group.statusChanges.subscribe(() => {
      // ??????????????????????????????????????????????????????
      const selectedContent = _.isEmpty(this.addGroupParams.groupDeviceInfoIdList) && _.isEmpty(this.addGroupParams.groupEquipmentIdList);
      // ???????????????????????????????????????
      this.saveButtonDisable = !event.instance.getValid('groupName') || selectedContent;
    });
  }

  /**
   * ??????????????????
   */
  public onClickSaveGroup(): void {
    const formValue = this.formStatus.group.getRawValue();
    this.addGroupParams.groupName = formValue.groupName;
    this.addGroupParams.remark = formValue.remark;
    let successMsg;
    this.isLoading = true;
    let request;
    // ??????????????????
    if (this.operateType === OperateTypeEnum.add) {
      request = this.$groupApiService.addGroupInfo(this.addGroupParams);
      successMsg = this.assetLanguage.addGroupSuccess;
    } else {
      // ??????????????????
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
   * ????????????????????????
   */
  public onClickSelectContent(): void {
    this.addGroupParams.groupEquipmentIdList = this.selectedEquipmentIds;
    this.addGroupParams.groupDeviceInfoIdList = this.selectedDeviceIds;
    this.groupContentMessage = '';
    // ???????????????????????????????????????
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
   * ????????????
   */
  public onClickCancel(): void {
    // ?????????????????????
    window.history.go(HISTORY_GO_STEP_CONST);
  }

  /**
   * ???????????????????????????
   */
  public onShowGroupContent(): void {
    // ?????????????????????
    this.initFacilityTableConfig();
    // ?????????????????????
    this.initEquipmentTableConfig();
    this.showGroupContent = true;
    // ??????????????????
    this.queryDeviceList();
    // ??????????????????
    this.queryEquipmentList();
  }

  /**
   * ????????????????????????
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
   * ???????????????????????????
   */
  public onShowDeviceSelector(filterValue: FilterCondition): void {
    this.filterValue = filterValue;
    if (!this.filterValue.filterValue) {
      this.filterValue.filterValue = [];
    }
    this.facilityFilterShow = true;
  }

  /**
   *  ????????????????????????????????????
   */
  private handelGroupDetail(): void {
    let groupId = '';
    this.$active.queryParams.subscribe(params => {
      groupId = params.groupId;
    });
    const queryBody = {
      groupId: groupId
    };
    // ????????????ID??????????????????
    this.$groupApiService.queryGroupDeviceAndEquipmentByGroupInfoId(queryBody).subscribe(
      (res: ResultModel<GroupDetailModel>) => {
        if (res.code === ResultCodeEnum.success) {
          this.addGroupParams = res.data || null;
          this.selectedEquipmentIds = this.addGroupParams ? res.data.groupEquipmentIdList : [];
          this.selectedDeviceIds = this.addGroupParams ? res.data.groupDeviceInfoIdList : [];
          this.onClickSelectContent();
          // ??????????????????????????????
          this.formStatus.resetData(this.addGroupParams);
        } else {
          this.$message.error(res.msg);
        }
      });
  }

  /**
   *  ??????????????????
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
              // ??????????????????????????????
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
   *  ??????????????????
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
              // ????????????????????????
              item.deviceIcon = CommonUtil.getFacilityIConClass(item.deviceType);
              // ???????????????????????????
              item.iconClass = CommonUtil.getEquipmentTypeIcon(item);
              // ??????????????????????????????
              const iconStyle = CommonUtil.getEquipmentStatusIconClass(item.equipmentStatus, 'list');
              item.statusIconClass = iconStyle.iconClass;
              item.statusColorClass = iconStyle.colorClass;
              item.deviceName = item.deviceInfo ? item.deviceInfo.deviceName : '';
              // ???????????????????????????
              this.setSelected();
            });
          }
        }
      }, () => {
        this.equipmentTableConfig.isLoading = false;
      });
  }

  /**
   * ?????????????????????
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
   *  ???????????????????????????
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
        { // ??????
          title: this.language.deviceName_a, key: 'deviceName',
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        { // ??????
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
        { // ??????
          title: this.language.model,
          key: 'deviceModel',
          width: 100,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        { // ????????????
          title: this.language.equipmentQuantity,
          key: 'equipmentQuantity', width: 100,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // ??????
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
        {  // ????????????
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
      // ??????
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.queryDeviceList();
      },
      // ????????????
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = PAGE_NO_DEFAULT_CONST;
        this.queryCondition.filterConditions = event;
        this.queryDeviceList();
      },
      // ?????????????????????????????????
      handleSelect: (event: FacilityListModel[]) => {
        // ?????????????????????????????????
        const unChecked = this.facilityData.filter(item => !item.checked);
        const unCheckIds = unChecked.map(item => {
          return item.deviceId;
        });
        // ?????????????????????id
        const checkIdIds = event.map(row => {
          return row.deviceId;
        });
        //  ???????????????????????????list????????????
        this.selectedDeviceIds =
          _.uniq(this.selectedDeviceIds.concat(checkIdIds));
        this.selectedDeviceIds = this.selectedDeviceIds.filter(
          row => !unCheckIds.includes(row));
      }
    };
  }

  /**
   *  ????????????????????????
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
        { // ??????
          title: this.language.equipmentName,
          key: 'equipmentName',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // ??????
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
        { // ??????
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
        }, { // ????????????
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
        { // ????????????
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
        { // ????????????
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
      // ??????
      sort: (event: SortCondition) => {
        this.equipmentQueryCondition.sortCondition.sortField = event.sortField;
        this.equipmentQueryCondition.sortCondition.sortRule = event.sortRule;
        this.queryEquipmentList();
      },
      // ??????????????????
      handleSearch: (devices: FilterCondition[]) => {
        // ???????????????????????????
        this.equipmentQueryCondition.pageCondition.pageNum = PAGE_NO_DEFAULT_CONST;
        // ?????????????????????????????????????????????
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
      // ??????????????????
      handleSelect: (data: EquipmentListModel[]) => {
        // ???????????????????????????id
        const checkIdIds = data.map(row => {
          return row.equipmentId;
        });
        // ?????????????????????????????????
        const unEquipmentChecked = this.equipmentData.filter(item => !item.checked);
        const unCheckIds = unEquipmentChecked.map(item => {
          return item.equipmentId;
        });
        //  ?????????????????????????????????list????????????
        this.selectedEquipmentIds = _.uniq(this.selectedEquipmentIds.concat(checkIdIds));
        this.selectedEquipmentIds = this.selectedEquipmentIds.filter(v => !unCheckIds.includes(v));
      }
    };
  }

  /**
   * ????????????????????????????????????????????????
   */
  private getEquipmentTypeRole(): SelectModel[] {
    let equipments = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n) || [];
    if (!_.isEmpty(equipments)) {
      equipments = equipments.filter(item => item.code !== EquipmentTypeEnum.intelligentEntranceGuardLock);
    }
    return equipments;
  }

  /**
   * ??????????????????????????????
   */
  private getFacilityTypeRole(): SelectModel[] {
    let devices = FacilityForCommonUtil.getRoleFacility(this.$nzI18n) || [];
    if (!_.isEmpty(devices)) {
      devices = devices.filter(item => ![DeviceTypeEnum.well, DeviceTypeEnum.outdoorCabinet, DeviceTypeEnum.opticalBox].includes(item.code as DeviceTypeEnum)) || [];
    }
    return devices;
  }
}

