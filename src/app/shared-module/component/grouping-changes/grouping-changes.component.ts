import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FinalValueEnum} from '../../../core-module/enum/step-final-value.enum';
import {PageModel} from '../../model/page.model';
import {TableConfigModel} from '../../model/table-config.model';
import {
  FilterCondition,
  QueryConditionModel,
  SortCondition,
} from '../../model/query-condition.model';
import {FormItem} from '../form/form-config';
import {FormOperate} from '../form/form-operate.service';
import {RuleUtil} from '../../util/rule-util';
import {IndexLanguageInterface} from '../../../../assets/i18n/index/index.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {AssetManagementLanguageInterface} from '../../../../assets/i18n/asset-manage/asset-management.language.interface';
import {LanguageEnum} from '../../enum/language.enum';
import {GroupListModel} from '../../../core-module/model/group/group-list.model';
import {SelectModel} from '../../model/select.model';
import {ResultModel} from '../../model/result.model';
import {ResultCodeEnum} from '../../enum/result-code.enum';
import {FiLinkModalService} from '../../service/filink-modal/filink-modal.service';
import {GroupDetailModel} from '../../../core-module/model/facility/group-detail.model';
import {OperatorEnum} from '../../enum/operator.enum';
import {GroupTypeEnum} from '../../../core-module/enum/facility/group.enum';
import {QueryGroupTypeEnum} from '../../../core-module/enum/equipment/equipment.enum';
import {GroupStepModel} from '../../../core-module/model/facility/group-step.model';
import {FacilityForCommonService} from '../../../core-module/api-service/facility';
import {IndexFacilityService} from '../../../core-module/api-service/index/facility';
import {PageSizeEnum} from '../../enum/page-size.enum';
import {CommonLanguageInterface} from '../../../../assets/i18n/common/common.language.interface';

/**
 * 分组变更
 */
@Component({
  selector: 'app-grouping-changes',
  templateUrl: './grouping-changes.component.html',
  styleUrls: ['./grouping-changes.component.scss']
})
export class GroupingChangesComponent implements OnInit {

  @Input()
  set xcVisible(params) {
    this._xcVisible = params;
    this.xcVisibleChange.emit(this._xcVisible);
  }

  get xcVisible() {
    return this._xcVisible;
  }

  // 框选设备/设施数据数据
  @Input() public tableData;
  // 设施/设备类型
  @Input() public groupFacilityType: QueryGroupTypeEnum;
  // 显示隐藏变化
  @Output() xcVisibleChange = new EventEmitter<boolean>();
  // 选中的值变化
  @Output() selectDataChange = new EventEmitter<any>();
  // 显示隐藏
  private _xcVisible: boolean = false;
  // 国际化
  public indexLanguage: IndexLanguageInterface;
  // 资产管理国际化
  public assetLanguage: AssetManagementLanguageInterface;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 步骤条的值
  public stepData: GroupStepModel[];
  // 分组列表数据集
  public dataSet: GroupListModel[];
  public tableDataSet = [];
  // 所有分组列表数据集
  public allDataSet: GroupListModel[];
  // 选中的步骤数
  public isActiveSteps: number = FinalValueEnum.STEPS_FIRST;
  // 步骤条的步骤枚举
  public finalValueEnum = FinalValueEnum;
  // 提交loading
  public isSaveLoading = false;
  // 翻页对象
  public pageBean: PageModel = new PageModel(PageSizeEnum.sizeFive);
  // 表格配置
  public tableConfig: TableConfigModel;
  // 查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  public deviceQueryCondition: QueryConditionModel = new QueryConditionModel();
  // form表单配置
  public formColumn: FormItem[] = [];
  // 下一步是否可用
  public isNext: boolean = false;
  // 是否可提交
  public isSubmit: boolean = false;
  // 模板表单实例
  private formStatus: FormOperate;
  // 已勾选列表数据
  private selectListData = [];
  // 所有分组数据
  private allGroupData: SelectModel[] = [];
  // 分组数据
  private groupData: SelectModel[] = [];
  // 当前分组数据
  private currentGroupData: SelectModel[] = [];
  // 所选中分组信息
  private selectGroupId: string;
  // 分组类型
  private groupType: GroupTypeEnum = GroupTypeEnum.moveInOtherGroup;
  // 新增组
  private addGroupParams: GroupDetailModel = new GroupDetailModel();

  constructor(
    private $ruleUtil: RuleUtil,
    private $nzI18n: NzI18nService,
    private $facilityForCommonService: FacilityForCommonService,
    private $message: FiLinkModalService,
    private $IndexFacilityService: IndexFacilityService,
  ) {
    this.indexLanguage = this.$nzI18n.getLocaleData(LanguageEnum.index);
    this.assetLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
  }

  /**
   * 初始化数据
   */
  public ngOnInit(): void {
    this.initData();
    this.initTableConfig();
    // 获取所有分组数据
    this.refreshData().then(() => {
      this.initColumn();
    });
    this.deviceQueryCondition.pageCondition = {pageNum: 1, pageSize: 5};
    this.refreshTableData();
  }

  /**
   * 初始化数据
   */
  private initData(): void {
    this.initPageBean();
    this.stepData =
      [
        {
          stepNumber: 1,
          activeClass: ' active',
          title: this.groupFacilityType === QueryGroupTypeEnum.device ? this.indexLanguage.selectFacility : this.indexLanguage.selectEquipment
        },
        {stepNumber: 2, activeClass: '', title: this.indexLanguage.addGroup}
      ];
  }

  /**
   * 上一步
   */
  public handlePrev(): void {
    this.isActiveSteps--;
    this.stepData[0].activeClass = ' active';
    this.stepData[1].activeClass = '';
  }

  /**
   * 下一步
   */
  public handleNext(): void {
    this.isActiveSteps++;
    this.stepData[0].activeClass = ' finish';
    this.stepData[1].activeClass = 'active';
    const queryCondition = new QueryConditionModel();
    if (this.groupFacilityType === QueryGroupTypeEnum.device) {
      const deviceIds = [];
      this.selectListData.forEach(item => {
        deviceIds.push(item.deviceId);
      });
      queryCondition.filterConditions = [new FilterCondition('deviceIds', OperatorEnum.in, deviceIds)];
    } else {
      const equipmentIds = [];
      this.selectListData.forEach(item => {
        equipmentIds.push(item.equipmentId);
      });
      queryCondition.filterConditions = [new FilterCondition('equipmentIds', OperatorEnum.in, equipmentIds)];
    }
    this.refreshCurrentGroupData(queryCondition);
  }


  /**
   * 确定
   */
  public handleSave(): void {
    // 组装设施/设备信息
    if (this.groupFacilityType === QueryGroupTypeEnum.device) {
      this.selectListData.forEach(item => {
        this.addGroupParams.groupDeviceInfoIdList.push(item.deviceId);
      });
    } else {
      this.selectListData.forEach(item => {
        this.addGroupParams.groupEquipmentIdList.push(item.equipmentId);
      });
    }
    switch (this.groupType) {
      // 移入其他分组
      case GroupTypeEnum.moveInOtherGroup:
        const groupData = this.dataSet.find(item => item.groupId === this.selectGroupId);
        this.addGroupParams.groupName = groupData.groupName;
        this.addGroupParams.remark = groupData.remark;
        this.addGroupParams.groupId = groupData.groupId;
        this.addGroupParams.groupType = groupData.groupType;
        this.updateGroupInfoData();
        break;
      // 移出当前分组
      case GroupTypeEnum.moveOutCurrentGroup:
        const formData = this.formStatus.group.getRawValue();
        this.addGroupParams.groupId = formData.selectGroup;
        this.moveOutGroupById();
        break;
      //  移入新分组
      case GroupTypeEnum.moveInNewGroup:
        const formValue = this.formStatus.group.getRawValue();
        this.addGroupParams.groupName = formValue.groupName;
        this.addGroupParams.remark = formValue.remark;
        this.addGroupInfoData();
        break;
    }
    this.isSaveLoading = true;
  }

  /**
   * 关闭
   */
  public handleClose(): void {
    this.xcVisible = false;
  }

  /**
   * 点击步骤
   */
  public backSteps(item): void {
    if (this.isActiveSteps > 1 && item.number === 1) {
      this.handlePrev();
    }
  }

  /**
   * 表格翻页查询
   * param event
   */
  public pageChange(event: PageModel): void {
    this.deviceQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.deviceQueryCondition.pageCondition.pageSize = event.pageSize;
    // this.queryCondition.bizCondition = [];
    // this.queryCondition.filterConditions = [];
    this.refreshTableData();
  }

  /**
   * 获取列表数据
   */
  private initPageBean(): void {
    this.pageBean.Total = this.tableData.length;
  }

  /**
   * 表格配置初始化
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: false,
      notShowPrint: true,
      keepSelected: true,
      selectedIdKey: 'deviceId',
      showRowSelection: false,
      showSizeChanger: false,
      noIndex: true,
      scroll: {x: '1200px', y: '600px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          type: 'serial-number', width: 62, title: this.indexLanguage.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        { // 设施名称
          title: this.groupFacilityType === QueryGroupTypeEnum.device ? this.indexLanguage.searchDeviceName : this.indexLanguage.equipmentName,
          key: this.groupFacilityType === QueryGroupTypeEnum.device ? 'deviceName' : 'equipmentName',
          width: 160,
          isShowSort: true,
        },
        { // 详细地址
          title: this.indexLanguage.address, key: 'address',
          width: 150, isShowSort: true,
        },
        { // 所属区域
          title: this.indexLanguage.area, key: 'areaName',
          width: 150, isShowSort: true,
        }
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      sort: (event: SortCondition) => {
        // this.DueryCondition.sortCondition.sortField = event.sortField;
        this.deviceQueryCondition.sortCondition.sortField = event.sortField;
        // this.deviceQueryCondition.sortCondition.sortRule = event.sortRule;
        this.deviceQueryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshTableData();
      },
      handleSelect: (event) => {
        this.selectListData = event;
        if (event && event.length > 0) {
          this.isNext = true;
        } else {
          this.isNext = false;
        }
      }
    };
  }

  /**
   * 表单绑定
   * @param event 表单对象
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    this.formStatus.group.valueChanges.subscribe(param => {
      if (param.groupType === GroupTypeEnum.moveInNewGroup) {
        this.isSubmit = this.formStatus.getValid('groupName') && this.formStatus.getValid('remark');
      } else {
        this.isSubmit = param.selectGroup ? true : false;
      }
    });
  }

  /**
   * 初始化form表单
   */
  private initColumn(): void {
    this.formColumn = [
      {// 分组类型
        label: this.assetLanguage.groupType,
        key: 'groupType', type: 'radio',
        require: true, width: 400,
        rule: [{required: true}],
        initialValue: GroupTypeEnum.moveInOtherGroup,
        radioInfo: {
          data: [
            {label: this.assetLanguage.moveInOtherGroup, value: GroupTypeEnum.moveInOtherGroup},
            {label: this.assetLanguage.moveOutCurrentGroup, value: GroupTypeEnum.moveOutCurrentGroup},
            {label: this.assetLanguage.moveInNewGroup, value: GroupTypeEnum.moveInNewGroup},
          ],
          label: 'label', value: 'value'
        },
        modelChange: (controls, event, key, formOperate) => {
          this.groupType = event;
          this.changeGroupType(event);
          // 更新分组数据
          this.formStatus.resetControlData('selectGroup', null);
          // 移出分组时候下拉数据为所在的分组数据
          this.groupData = this.groupType === GroupTypeEnum.moveOutCurrentGroup ?  this.currentGroupData : this.allGroupData;
          this.formColumn[1].selectInfo.data = this.groupData;
          this.formColumn[1].placeholder = '请选择';
        }
      },
      {// 选择分组
        label: this.indexLanguage.selectGroup, width: 400,
        key: 'selectGroup', type: 'select',
        require: true, rule: [],
        placeholder: '请选择',
        selectInfo: {
          data: this.groupData,
          label: 'label', value: 'value',
        },
        modelChange: (controls, event, key, formOperate) => {
          this.selectGroupId = event;
        },
      },
      { // 分组名称
        label: this.indexLanguage.groupName, width: 400,
        key: 'groupName', type: 'input',
        require: true, hidden: true,
        rule: [
          {required: true},
          RuleUtil.getNameMinLengthRule(),
          RuleUtil.getNameMaxLengthRule(),
          RuleUtil.getAlarmNamePatternRule(this.commonLanguage.nameCodeMsg)
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value =>
              this.$facilityForCommonService.checkGroupInfoByName(
                {groupName: value, groupId: this.addGroupParams.groupId}),
            res => {
              if (res['code'] === ResultCodeEnum.success) {
                this.isSubmit = res.data;
              } else {
                this.isSubmit = false;
              }
              return res.data;
            })
        ],
        modelChange: (controls, event, key, formOperate) => {
          /**
          let flag = false;
          flag = this.formStatus.group.get('groupName').valid;
           */
        }
      },
      {// 备注
        label: this.indexLanguage.remark, hidden: true, width: 400,
        key: 'remark', type: 'textarea',
        rule: [{minLength: 0}, {maxLength: 255}],
        modelChange: (controls, event, key, formOperate) => {

        }
      },
    ];
  }

  /**
   * 分组类型切换
   * @param type string
   */
  private changeGroupType(type: GroupTypeEnum): void {
    this.formColumn.forEach((item) => {
      // 移入新分组
      if (type === GroupTypeEnum.moveInNewGroup) {
        if (item.key === 'groupName' || item.key === 'remark') {
          item.hidden = false;
        }
        if (item.key === 'selectGroup') {
          item.hidden = true;
        }
      } else {
        if (item.key === 'groupName' || item.key === 'remark') {
          item.hidden = true;
        }
        if (item.key === 'selectGroup') {
          item.hidden = false;
        }
      }
    });
  }

  /**
   * 刷新列表数据
   */
  private refreshData() {
    return new Promise((resolve, reject) => {
      this.tableConfig.isLoading = true;
      // 过滤到分页条件
      if (this.queryCondition.hasOwnProperty('pageCondition')) {
        delete this.queryCondition.pageCondition;
      }
      this.$IndexFacilityService.queryGroupInfoList(this.queryCondition).subscribe(
        (result: ResultModel<GroupListModel[]>) => {
          this.tableConfig.isLoading = false;
          if (result.code === ResultCodeEnum.success) {
            resolve();
            this.getGroupInfo(result.data);
          } else {
            resolve();
            this.$message.error(result.msg);
          }
        }, () => {
          this.tableConfig.isLoading = false;
        });
    });
  }

  /**
   * 新增分组数据
   */
  private addGroupInfoData(): void {
    this.tableConfig.isLoading = true;
    this.$facilityForCommonService.addGroupInfo(this.addGroupParams).subscribe(
      (result: ResultModel<string>) => {
        this.tableConfig.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.$message.success(this.assetLanguage.addGroupSuccess);
          this.selectDataChange.emit('1');
          this.handleClose();
        } else {
          this.$message.error(result.msg);
        }
      }, () => {
        this.tableConfig.isLoading = false;
      });
  }

  /**
   * 更新分组数据
   */
  private updateGroupInfoData(): void {
    this.tableConfig.isLoading = true;
    this.$IndexFacilityService.addToExistGroupInfo(this.addGroupParams).subscribe(
      (result: ResultModel<GroupListModel[]>) => {
        this.tableConfig.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.$message.success(this.assetLanguage.updateGroupSuccess);
          this.selectDataChange.emit('1');
          this.handleClose();
        } else {
          this.$message.error(result.msg);
        }
      }, () => {
        this.tableConfig.isLoading = false;
      });
  }

  /**
   * 获取所有分组信息和当前分组信息
   */
  private getGroupInfo(dataList: GroupListModel[]): void {
    if (this.isNext) {
      this.currentGroupData = [];
      dataList.forEach(item => {
        const selectModel = new SelectModel();
        selectModel.label = item.groupName;
        selectModel.value = item.groupId;
        this.currentGroupData.push(selectModel);
      });
    } else {
      dataList.forEach(item => {
        const selectModel = new SelectModel();
        selectModel.label = item.groupName;
        selectModel.value = item.groupId;
        this.allGroupData.push(selectModel);
      });
      // 获取所有分组信息
      this.dataSet = dataList;
      this.groupData = this.allGroupData;
    }
  }

  private moveOutGroupById() {
    this.tableConfig.isLoading = true;
    this.$facilityForCommonService.moveOutGroupById(this.addGroupParams).subscribe(
      (result: ResultModel<string>) => {
        this.tableConfig.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.selectDataChange.emit('1');
          this.handleClose();
          this.$message.success(this.assetLanguage.updateGroupSuccess);
        } else {
          this.$message.error(result.msg);
        }
      }, () => {
        this.tableConfig.isLoading = false;
      });
  }

  public refreshTableData() {
    this.tableConfig.isLoading = true;
    const hasDeviceId = this.queryCondition.filterConditions.some(item => item.filterField === 'deviceId');
    let reqUrl;
    if (!hasDeviceId && this.groupFacilityType === QueryGroupTypeEnum.device) {
      this.deviceQueryCondition.filterConditions.push({
        filterField: 'deviceId',
        filterValue: this.tableData.map(item => item.deviceId),
        operator: 'in'
      });
      this.tableConfig.selectedIdKey = 'deviceId';
      reqUrl = this.$facilityForCommonService.deviceListByPage(this.deviceQueryCondition);
    } else {
      this.deviceQueryCondition.filterConditions.push({
        filterField: 'equipmentId',
        filterValue: this.tableData.map(item => item.equipmentId),
        operator: 'in'
      });
      this.tableConfig.selectedIdKey = 'equipmentId';
      reqUrl = this.$facilityForCommonService.equipmentListByPage(this.deviceQueryCondition);
    }
    reqUrl.subscribe((result: ResultModel<any>) => {
      this.tableDataSet = result.data;
      this.pageBean.Total = result.totalCount;
      this.pageBean.pageIndex = result.pageNum;
      this.pageBean.pageSize = result.size;
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 根据设备id或者设施id 查询所在分组信息
   * @param queryCondition 设备/设施筛选条件
   */
  private refreshCurrentGroupData(queryCondition): void {
    this.$facilityForCommonService.queryGroupInfoList(queryCondition).subscribe((res) => {
      if (res.code === ResultCodeEnum.success) {
        this.currentGroupData = [];
        const data = res.data || [];
        data.forEach(item => {
          const selectModel = new SelectModel();
          selectModel.label = item.groupName;
          selectModel.value = item.groupId;
          this.currentGroupData.push(selectModel);
        });
      }
    });
  }
}
