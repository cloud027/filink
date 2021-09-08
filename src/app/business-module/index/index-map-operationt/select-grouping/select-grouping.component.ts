import {AfterViewInit, Component, EventEmitter, OnInit, Output, OnDestroy, Input} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import * as lodash from 'lodash';
import {SelectGroupService} from '../../../../shared-module/service/index/select-group.service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {MapCoverageService} from '../../../../shared-module/service/index/map-coverage.service';
import {OperationService} from '../../../../shared-module/service/index/operation.service';
import {IndexFacilityService} from '../../../../core-module/api-service/index/facility/facility.service';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {PageModel} from '../../../../shared-module/model/page.model';
import {QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {IndexGroupTypeEnum, StepIndexEnum} from '../../shared/enum/index-enum';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {PageSizeEnum} from '../../../../shared-module/enum/page-size.enum';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {AddGroupResultModel, AddToExistGroupModel} from '../../shared/model/select-grouping.model';
import {GroupListModel} from '../../../../core-module/model/group/group-list.model';
import {num} from '../../../../core-module/const/index/index.const';
import {MapTypeEnum, ViewEnum} from '../../../../core-module/enum/index/index.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {SetStringSortUtil} from '../../../../shared-module/util/string-sort-util';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
/**
 * 选择分组
 */
@Component({
  selector: 'app-select-grouping',
  templateUrl: './select-grouping.component.html',
  styleUrls: ['./select-grouping.component.scss']
})
export class SelectGroupingComponent implements OnInit, AfterViewInit, OnDestroy {
  // 图层类型， 设备/设施
  @Input() facilityType: string;
  // 视图类型
  @Input() viewIndex: string;
  // 向父组件发射显示框选分组事件
  @Output() addGroupingEventEmitter = new EventEmitter<boolean>();
  // 视图枚举
  public maintenanceView = ViewEnum;
  // 设施设备层枚举
  public mapTypeEnum = MapTypeEnum;
  // 显示添加分组卡片
  public addGrouping: boolean = false;
  // 分组列表查询条件
  public queryGroupListCondition: QueryConditionModel = new QueryConditionModel();
  // 分组枚举
  public groupTypeEnum = IndexGroupTypeEnum;
  // 选中的操作
  public radioValue = IndexGroupTypeEnum.current;
  // 表格分页
  public pageBean: PageModel = new PageModel(PageSizeEnum.sizeFive);
  // 国际化
  public indexLanguage: IndexLanguageInterface;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 表单配置
  public formColumn: FormItem[] = [];
  // 表单状态
  public formStatus: FormOperate;
  // 表格配置
  public tableConfig: TableConfigModel;
  // 显示添加分组弹框
  public isVisible: boolean = false;
  // 显示列表数据集
  public dataSet: object[] = [];
  // 总列数据
  public dataTotalSet = [];
  // 步骤
  public stepIndex = StepIndexEnum.back;
  // 当前步骤
  public stepNum = num;
  // 头名称
  public title: string;
  // 当前图层
  public indexType: string;
  // 显示开关：表格内容/选择分组内容
  public showContent: boolean = false;
  // 选中的当前分组
  public selectValue: string;
  // 现存分组数据集
  public listOfOption: GroupListModel[] = [];
  // 所有的设施ID
  public allDeviceId: any[] = [];
  // 所有的设备ID
  public allEquipmentId: any[] = [];
  // 框选选择的设施ID
  public selectDeviceId: string[] = [];
  // 框选选中的设备ID
  public selectEquipmentId: string[] = [];
  // 确定按钮loading
  public isLoading: boolean = false;
  // 分组名是否重复
  public groupNameRepeat: boolean = true;
  // 步骤条第一步显示选择设施或选择设备
  public deviceOrEquipment: boolean;
  // 关闭订阅流
  private destroy$ = new Subject<void>();

  /**
   * 首页选择分组
   */
  constructor(
    private $nzI18n: NzI18nService,
    private $ruleUtil: RuleUtil,
    private $message: FiLinkModalService,
    private $IndexFacilityService: IndexFacilityService,
    private $mapCoverageService: MapCoverageService,
    private $selectGroupService: SelectGroupService,
    private $OperationService: OperationService,
  ) {
    this.indexLanguage = this.$nzI18n.getLocaleData(LanguageEnum.index);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
  }

  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    // 标题
    this.title = this.indexLanguage.addToGroup;
    // 表格数据初始化
    this.groupInit();
    // 接收所框选数据
    this.$OperationService.eventEmit.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value.selectGroup === false) {
        this.addGrouping = value.selectGroup;
      }
    });
  }

  ngAfterViewInit() {
    // 表单初始化
    this.initColumn();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * 数据初始化
   */
  public groupInit(): void {
    this.$selectGroupService.eventEmit.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value.datas && value.showCoverage) {
        this.indexType = value.showCoverage;
        if (value.showCoverage === MapTypeEnum.facility) {
          // 设施列表数据
          this.dataTotalSet = value.datas;
          // 加载设施表格
          this.tableDeviceConfig(true);
        } else {
          // 设备列表数据处理
          const equipmentData = [];
          value.datas.forEach(item => {
            equipmentData.push(item.equipmentList);
          });
          this.dataTotalSet = lodash.flattenDeep(equipmentData);
          // 加载设备表格
          this.tableDeviceConfig(false);
        }
        // 表格分页
        this.pageBean.pageIndex = 1;
        this.dataSet = [];
        this.dataTotalSet.forEach(item => {
          item['checked'] = false;
        });
        // 去除掉电子锁相关设施设备
        const arr = ['D001', 'D004', 'D005', 'D006', 'D007', 'E012'];
        const newArr = [];
        this.dataTotalSet.forEach((item, index) => {
          if (arr.indexOf(item.deviceType || item.equipmentType) === -1) {
            newArr.push(item);
          }
        });
        this.dataTotalSet = newArr;
        this.dataSet = this.dataTotalSet.slice(this.pageBean.pageSize * (this.pageBean.pageIndex - 1), this.pageBean.pageIndex * this.pageBean.pageSize);
        let score = 1;
        this.dataSet.forEach(item => {
          score += 1;
          item['num'] = score;
        });
        this.pageBean.Total = this.dataTotalSet.length;
        // 分组弹框初始化
        this.initialize();
        this.addGrouping = false;
      }
    });
  }


  /**
   * 显示添加分组卡片
   */
  public groupingShow(): void {
    this.addGrouping = !this.addGrouping;
    this.addGroupingEventEmitter.emit(this.addGrouping);
  }

  /**
   * 显示添加分组弹框
   */
  public showModal(): void {
    if (this.$mapCoverageService.showCoverage === 'facility') {
      this.deviceOrEquipment = true;
    } else {
      this.deviceOrEquipment = false;
    }
    // 初始化表格数据
    this.dataSet = [];
    // 分组状态回传
    this.$selectGroupService.eventEmit.emit({isShow: this.addGrouping});
  }

  // 弹出初始化
  public initialize(): void {
    // 显示弹窗
    this.isVisible = true;
    // 步骤条
    this.stepIndex = StepIndexEnum.back;
    // 显示开关：表格内容/选择分组内容
    this.showContent = false;
    // 显示当前分组
    this.radioValue = IndexGroupTypeEnum.current;
  }

  /**
   * 关闭弹框
   */
  public closeModal(): void {
    // 初始化表格数据
    this.dataSet = [];
    this.allDeviceId = [];
    this.allEquipmentId = [];
    this.dataTotalSet = [];
    this.addGrouping = !this.addGrouping;
    this.$selectGroupService.eventEmit.emit({isShow: false});
    this.isVisible = false;
    this.selectValue = null;
    this.listOfOption = [];
  }

  /**
   * 确定
   */
  public modifyGrouphandleOk(): void {
    this.isLoading = true;
    this.$selectGroupService.eventEmit.emit({isShow: false});
    // 添加到现存分组
    if (this.radioValue === IndexGroupTypeEnum.current) {
      this.addToExistGroupInfo();
    }
  }

  /**
   * 确定
   */
  public addGroupHandleOk(): void {
    this.isLoading = true;
    this.$selectGroupService.eventEmit.emit({isShow: false});
    // 添加分组
    if (this.radioValue === IndexGroupTypeEnum.create) {
      this.addGroupInfo();
    }
  }


  /**
   * 上一步
   */
  public handleBack(): void {
    // 步骤条
    this.stepIndex = StepIndexEnum.back;
    // 显示开关：表格内容/选择分组内容
    this.showContent = false;
  }

  /**
   * 下一步
   */
  public handleNext(): void {
    if (this.indexType === MapTypeEnum.facility) {
      // 设施勾选数据
      this.allDeviceId = [];
      this.dataTotalSet.forEach(item => {
        if (item.checked && item.checked === true) {
          this.allDeviceId.push(item);
        }
      });
    }
    if (this.indexType === MapTypeEnum.equipment) {
      // 设备勾选数据
      this.allEquipmentId = [];
      this.dataTotalSet.forEach(item => {
        if (item.checked && item.checked === true) {
          this.allEquipmentId.push(item);
        }
      });
    }
    if (this.allDeviceId.length || this.allEquipmentId.length) {
      // 步骤条
      this.stepIndex = StepIndexEnum.next;
      // 显示开关：表格内容/选择分组内容
      this.showContent = true;
      // 查询分组
      this.getGroupList();
      // 赋值
      this.analysisSelectData();
    } else {
      this.$message.warning(this.indexLanguage.pleaseSelectData);
    }
  }

  /**
   * 分页
   */
  public pageChange(event): void {
    this.pageBean.pageIndex = event.pageIndex;
    this.pageBean.pageSize = event.pageSize;
    this.dataSet = this.dataTotalSet.slice(this.pageBean.pageSize * (this.pageBean.pageIndex - 1),
      this.pageBean.pageIndex * this.pageBean.pageSize);
  }

  /**
   * 表格配置
   */
  private tableDeviceConfig(isDevice: boolean): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: false,
      showSizeChanger: false,
      scroll: {x: '1000px', y: '600px'},
      noIndex: true,
      notShowPrint: true,
      columnConfig: [
        // 勾选框
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0'}}, width: 62},
        // 序号
        {
          type: 'serial-number', width: 62, title: this.indexLanguage.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        {
          // 设施名称
          title: isDevice ? this.indexLanguage.searchDeviceName : this.indexLanguage.equipmentName,
          key: isDevice ? 'deviceName' : 'equipmentName',
          isShowSort: true,
          width: 160,
          configurable: false,
        },
        {
          // 详细地址
          title: this.indexLanguage.address, key: 'address',
          isShowSort: true,
          width: 160,
          configurable: false,
        },
        {
          // 所属区域
          title: this.indexLanguage.area, key: 'areaName',
          isShowSort: true,
          width: 160,
          configurable: false,
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [],
      handleSelect: (event) => {
      },
      sort: (e) => {
        this.dataSet.sort(SetStringSortUtil.compare(e.sortField, e.sortRule));
        this.dataSet = [].concat(this.dataSet);
      }
    };
  }

  /**
   * 查询分组列表
   */
  private getGroupList(): void {
    delete this.queryGroupListCondition.pageCondition;
    this.$IndexFacilityService.queryGroupInfoList(this.queryGroupListCondition)
      .subscribe((result: ResultModel<GroupListModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.listOfOption = result.data;
        }
      });
  }


  /**
   * 向已有分组中添加设备设施
   */
  private addToExistGroupInfo(): void {
    if (this.radioValue) {
      const para = new AddToExistGroupModel();
      // 所选分组id
      para.groupId = this.selectValue;
      // 设施勾选数据
      para.groupDeviceInfoIdList = this.selectDeviceId;
      // 设备勾选数据
      para.groupEquipmentIdList = this.selectEquipmentId;
      this.$IndexFacilityService.addToExistGroupInfo(para).subscribe((result: ResultModel<GroupListModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          // 关闭分组弹窗
          this.closeModal();
          this.$message.success(this.indexLanguage.addToGroupMsg);
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.$message.error(result.msg);
        }
      });
    }
  }

  /**
   * 新建分组并添加分组信息
   */
  private addGroupInfo(): void {
    if (this.formStatus.getData('groupName')) {
      const para = new AddGroupResultModel();
      // 分组名称
      para.groupName = this.formStatus.getData('groupName');
      // 备注
      para.remark = this.formStatus.getData('remark');
      // 设施勾选数据
      para.groupDeviceInfoIdList = this.selectDeviceId;
      // 设备勾选数据
      para.groupEquipmentIdList = this.selectEquipmentId;
      this.$IndexFacilityService.addGroupInfo(para).subscribe((result: ResultModel<string>) => {
        if (result.code === ResultCodeEnum.success) {
          // 关闭分组弹窗
          this.closeModal();
          this.$message.success(this.indexLanguage.addGroupMsg);
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.$message.error(result.msg);
        }
      });
    }
  }

  /**
   * 解析选中的数据
   */
  private analysisSelectData(): void {
    // 设施图层
    if (this.indexType === MapTypeEnum.facility) {
      if (this.allDeviceId) {
        this.selectDeviceId = this.allDeviceId.map(item => {
          return item.facilityId;
        });
      }
    }
    // 设备图层
    if (this.indexType === MapTypeEnum.equipment) {
      if (this.allEquipmentId) {
        this.selectEquipmentId = this.allEquipmentId.map(item => {
          return item.facilityId;
        });
      }
    }
  }

  /**
   * 表单数据配置
   */
  private initColumn(): void {
    this.formColumn = [
      {
        label: this.indexLanguage.groupName,
        key: 'groupName',
        type: 'input',
        require: true,
        width: 300,
        rule: [
          {required: true},
          RuleUtil.getNameMinLengthRule(),
          RuleUtil.getNameMaxLengthRule(),
          RuleUtil.getAlarmNamePatternRule(this.commonLanguage.nameCodeMsg)
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value =>
              this.$IndexFacilityService.checkGroupInfoByName({groupName: value}),
            res => {
              this.groupNameRepeat = res.data;
              return res.data;
            })
        ]
      },
      {
        label: this.indexLanguage.remark,
        key: 'remark',
        width: 300,
        type: 'textarea',
        rule: [
          {maxLength: 255},
        ],
        asyncRules: [],
      }
    ];
  }

  /**
   * 表单回调函数
   */
  private formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
  }

  /**
   * 表单验证
   */
  private disabledModifyGroup() {
    if ((this.radioValue === IndexGroupTypeEnum.current && this.selectValue)) {
      return false;
    } else {
      return true;
    }
  }


  /**
   * 表单验证
   */
  private disabledAddGroup() {
    if (!this.groupNameRepeat) {
      return true;
    }
    if (this.formStatus) {
      if ((this.radioValue === IndexGroupTypeEnum.create && this.formStatus.getValid('groupName'))) {
        return false;
      }
      return true;
    }
  }

}
