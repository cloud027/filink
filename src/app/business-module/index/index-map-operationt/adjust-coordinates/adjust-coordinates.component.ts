import {AfterViewInit, Component, EventEmitter, OnInit, OnDestroy, Output, ViewChild, Input, SimpleChanges, OnChanges} from '@angular/core';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {StepIndexEnum} from '../../shared/enum/index-enum';
import {num} from '../../../../core-module/const/index/index.const';
import {PageModel} from '../../../../shared-module/model/page.model';
import {PageSizeEnum} from '../../../../shared-module/enum/page-size.enum';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {AdjustCoordinatesService} from '../../../../shared-module/service/index/adjust-coordinates.service';
import {MapCoverageService} from '../../../../shared-module/service/index/map-coverage.service';
import {MapTypeEnum, ViewEnum} from '../../../../core-module/enum/index/index.enum';
import * as lodash from 'lodash';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {CoordinateAdjustmentTypeEnum} from '../../shared/enum/coordinate-adjustment-type-enum';
import {ArrangementNumberEnum} from '../../../../core-module/enum/index/arrangement-number-enum';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FacilityShowService} from '../../../../shared-module/service/index/facility-show.service';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {OperationService} from '../../../../shared-module/service/index/operation.service';

/**
 * 坐标调整
 */
@Component({
  selector: 'app-adjust-coordinates',
  templateUrl: './adjust-coordinates.component.html',
  styleUrls: ['./adjust-coordinates.component.scss']
})
export class AdjustCoordinatesComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  // 视图类型
  @Input() viewIndex: string;
  // 向父组件发射显示框选分组事件
  @Output() addCoordinatesEventEmitter = new EventEmitter<boolean>();
  // 表格排序输入框
  @ViewChild('serialNumberValue') private serialNumberValue;
  // 运维视图
  public maintenanceView = ViewEnum.maintenanceView;
  // 显示添加选项
  public addCoordinates: boolean = false;
  // 显示坐标调整的弹框
  public isCoordinates: boolean = false;
  // 步骤
  public stepIndex = StepIndexEnum.back;
  // 当前步骤
  public stepNum = num;
  // 显示开关：表格内容/选择内容
  public showContent: boolean = false;
  public isLoading: boolean = false;
  // 总列数据
  public dataTotalSet = [];
  // 显示列表数据集
  public dataSet: object[] = [];  // 表格分页
  public pageBean: PageModel = new PageModel(PageSizeEnum.sizeFive);
  // 运维视图表格配置
  public tableConfig: TableConfigModel;
  // 规划项目表格配置
  public planProjectTableConfig: TableConfigModel;
  // 国际化
  public indexLanguage: IndexLanguageInterface;
  // 步骤条第一步显示选择设施或选择设备
  public deviceOrEquipment: boolean;
  // 当前图层
  public indexType: string;
  // 所有的设施ID
  public allDeviceId: any[] = [];
  // 所有的设备ID
  public allEquipmentId: any[] = [];
  // 表单配置
  public formColumn: FormItem[] = [];
  // 表单状态
  public formStatus: FormOperate;
  // 选中的操作
  public radioValue = ArrangementNumberEnum.singleLine;
  // 保存的操作
  public saveRadioValue = ArrangementNumberEnum.singleLine;
  // 排布类型枚举
  public arrangementTypeEnum = ArrangementNumberEnum;
  // 当前序号
  public value: number;
  // 变动之前序号
  public lastValue: number;
  // 应为改变两条数据的序号，ngModel会触发两次，此变量用来阻止多次触发，只触发一次
  public isChange: number = 0;
  // 坐标调整类型
  public adjustmentType = CoordinateAdjustmentTypeEnum;
  // 是否展开
  public isExpand: boolean = false;
  // 是否可编辑
  public isEdit: boolean = false;
  // 单个坐标调整
  public singleCoordinate: boolean = false;
  // 批量坐标调整
  public batchCoordinate: boolean = false;
  // 坐标调整按钮权限
  public coordinateAdjustment: boolean = true;
  // 坐标调整按钮只有设施显示，设备不显示
  public isShowDevice: boolean = true;
  // 坐标调整确认弹框
  public okIsVisible: boolean = false;
  // 列表去勾选特殊处理
  public checkLastArr = [];
  // 关闭订阅流
  private destroy$ = new Subject<void>();
  // 表单校验
  public isDisabled: boolean = true;

  constructor(private $nzI18n: NzI18nService,
              private $message: FiLinkModalService,
              private $adjustCoordinatesService: AdjustCoordinatesService,
              private $mapCoverageService: MapCoverageService,
              private $facilityShowService: FacilityShowService,
              private $ruleUtil: RuleUtil,
              private $OperationService: OperationService, ) {
    this.indexLanguage = $nzI18n.getLocaleData('index');
  }

  /**
   * 防抖
   */
  changeShake = lodash.debounce(() => {
    this.dataTotalSet.splice(this.value - 1, 0, this.dataTotalSet.splice(this.lastValue - 1, 1)[0]);
    this.dataTotalSet.forEach((item, index) => {
      item.lastSerialNumber = index + 1;
      item.serialNumber = index + 1;
    });
    this.dataSet = this.dataTotalSet.slice(this.pageBean.pageSize * (this.pageBean.pageIndex - 1), this.pageBean.pageIndex * this.pageBean.pageSize);
  }, 1000, {leading: false, trailing: true});

  ngOnInit() {

    // 表格数据初始化
    this.initPage();
    // 坐标调整按钮权限
    this.coordinateAdjustment = SessionUtil.checkHasRole('05-3');
    // 地图分层切换重新获取设施或设备数据
    this.$facilityShowService.subject.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value.mapShowType && value.mapShowType === 'facility') {
        this.isShowDevice = true;
      } else if (value.mapShowType) {
        this.isShowDevice = false;
        this.addCoordinates = false;
      }
    });
    this.$OperationService.eventEmit.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value.addCoordinates === false) {
        this.isExpand = value.addCoordinates;
      }
    });
  }

  ngAfterViewInit() {
    // 表单初始化
    this.initColumn();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.viewIndex.previousValue) {
      this.showDropOut();
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * 数据初始化
   */
  public initPage(): void {
    this.$adjustCoordinatesService.eventEmit.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value.datas && value.showCoverage && value.datas.length < 100) {
        if (this.viewIndex === ViewEnum.maintenanceView) {
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
        } else if (this.viewIndex === ViewEnum.planView) {
          this.indexType = value.showCoverage;
          // 设施列表数据
          this.dataTotalSet = value.datas;
          this.tablePlanProjectConfig(true);
        } else {
          this.indexType = value.showCoverage;
          // 设施列表数据
          this.dataTotalSet = value.datas;
          this.tablePlanProjectConfig(false);
        }
        // 给总数据添加排序字段
        this.dataTotalSet.forEach((item, index) => {
          item.serialNumber = index + 1;
          item.lastSerialNumber = index + 1;
        });
        // 表格分页
        this.pageBean.pageIndex = 1;
        this.dataSet = [];
        this.dataTotalSet.forEach(item => {
          item['checked'] = false;
        });
        this.dataSet = this.dataTotalSet.slice(this.pageBean.pageSize * (this.pageBean.pageIndex - 1), this.pageBean.pageIndex * this.pageBean.pageSize);
        let score = 1;
        this.dataSet.forEach(item => {
          score += 1;
          item['num'] = score;
        });
        this.pageBean.Total = this.dataTotalSet.length;
        // 分组弹框初始化
        this.initialize();
      } else if (value.datas && value.datas.length > 100) {
        this.$message.info(this.indexLanguage.noMoreThanFacilitiesOrEquipmentSelected);
      }
    });
  }

  // 弹出初始化
  public initialize(): void {
    // 显示弹窗
    this.isCoordinates = true;
    // 步骤条
    this.stepIndex = StepIndexEnum.back;
    // 显示开关：表格内容/选择内容
    this.showContent = false;
  }

  /**
   * 选中批量坐标调整或者单个坐标调整按钮
   */
  public selectType(type: string): void {
    // 收起展开
    this.isExpand = false;
    this.addCoordinates = true;
    // 判断选中类型
    this.singleCoordinate = type === this.adjustmentType.singleCoordinate;
  }

  /**
   * 选择坐标调整按钮
   */
  public checkCoordinates(): void {
    this.isExpand = !this.isExpand;
    this.addCoordinatesEventEmitter.emit(this.addCoordinates);
  }

  public showAdjust(): void {
    this.deviceOrEquipment = this.$mapCoverageService.showCoverage === 'facility';
    // 初始化表格数据
    this.dataSet = [];
    // 状态回传
    this.$adjustCoordinatesService.eventEmit.emit({isShow: true});
  }

  /**
   * 保存
   */
  public showSave(): void {
    this.okIsVisible = true;
  }

  /**
   * 单个坐标调整
   */
  public showSingleAdjust(): void {
    this.$adjustCoordinatesService.eventEmit.emit({isDrag: true});
  }

  /**
   * 撤销
   */
  public showRevoke(): void {
    this.allEquipmentId = [];
    this.allDeviceId = [];
    this.$adjustCoordinatesService.eventEmit.emit({isSave: false});
  }

  /**
   * 编辑
   */
  public showModify(): void {
    this.isEdit = !this.isEdit;
    const data = this.formStatus.getData();
    data.type = this.saveRadioValue;
    const value = this.allEquipmentId.concat(this.allDeviceId);
    this.$adjustCoordinatesService.eventEmit.emit({isEdit: this.isEdit, data: data, value: value});
  }

  /**
   * 退出
   */
  public showDropOut(): void {
    this.addCoordinates = false;
    this.allDeviceId = [];
    this.allEquipmentId = [];
    this.$adjustCoordinatesService.eventEmit.emit({isSave: false});
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

  public handleBack(): void {
    // 步骤条
    this.stepIndex = StepIndexEnum.back;
    // 显示开关：表格内容/选择内容
    this.showContent = false;
  }

  /**
   * 表单数据配置
   */
  private initColumn(): void {
    this.formColumn = [
      {
        label: this.indexLanguage.spacing,
        key: 'spacing',
        type: 'input',
        initialValue: 50,
        require: true,
        width: 300,
        rule: [
          {required: true},
          this.$ruleUtil.oneToOneHundred()
        ],
        customRules: [],
        asyncRules: []
      },
      {
        label: this.indexLanguage.wide,
        key: 'width',
        type: 'input',
        hidden: true,
        initialValue: 15,
        require: true,
        width: 300,
        rule: [
          {required: true},
          this.$ruleUtil.oneToOneHundred()
        ],
        customRules: [],
        asyncRules: []
      }
    ];
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
      this.showContent = true;
    } else {
      this.$message.warning(this.indexLanguage.pleaseSelectData);
    }
  }

  /**
   * 确定
   */
  public addGroupHandleOk(): void {
    this.isCoordinates = false;
    const data = this.formStatus.getData();
    data.type = this.radioValue;
    this.saveRadioValue = this.radioValue;
    const value = this.allEquipmentId.concat(this.allDeviceId);
    this.$adjustCoordinatesService.eventEmit.emit({line: true, data: data, value: value});
    // 保存后重置单双边选项
    this.radioValue = ArrangementNumberEnum.singleLine;
    this.initColumn();
  }

  /**
   * 单线或双线选择change
   */
  public radioValueChange(evt): void {
    this.saveRadioValue = evt;
    evt === '1' ? this.formColumn[1].hidden = true : this.formColumn[1].hidden = false;
  }

  /**
   * 表单回调函数
   */
  private formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isDisabled = this.formStatus.getRealValid();
    });
  }

  isDisabledShow() {
    return !this.isDisabled;
  }

  public closeModal(): void {
    // 取消或关闭后重置单双边选项
    this.radioValue = ArrangementNumberEnum.singleLine;
    this.initColumn();
    this.isCoordinates = false;
    this.$adjustCoordinatesService.eventEmit.emit({isShow: false});
  }

  /**
   * 表格序号change事件
   */
  public onChange(evt: number, lastNum: number): void {
    if (this.isChange === 0) {
      this.lastValue = lastNum;
      this.value = evt;
      this.isChange = 1;
      this.changeShake();
    } else {
      this.isChange = 0;
    }
  }

  /**
   * 运维视图表格配置
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
          title: this.indexLanguage.serialNumber, key: 'serialNumberValue',
          width: 100,
          configurable: false,
          type: 'render',
          renderTemplate: this.serialNumberValue,
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
        }
      ],
      simplePageTotalShow: true,
      showPagination: true,
      simplePage: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [],
      sort: (e) => {
        this.dataSet.sort(this.compare(e.sortField, e.sortRule));
        this.dataSet = [].concat(this.dataSet);
      },
      handleSelect: (e) => {
        if (e.length >= 5 && this.checkLastArr.length !== 4) {
          this.dataTotalSet.forEach(item => {
            item.checked = true;
          });
        } else if (e.length === 0 && this.checkLastArr.length !== 1) {
          this.dataTotalSet.forEach(item => {
            item.checked = false;
          });
        }
        this.checkLastArr = e;
      }
    };
  }

  /**
   * 规划项目视图表格配置
   */
  private tablePlanProjectConfig(isPlan: boolean): void {
    this.planProjectTableConfig = {
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
          title: this.indexLanguage.serialNumber, key: 'serialNumberValue',
          width: 100,
          configurable: false,
          type: 'render',
          renderTemplate: this.serialNumberValue,
        },
        {
          // 设施名称
          title: this.indexLanguage.searchDeviceName,
          key: 'pointName',
          isShowSort: true,
          width: 160,
          configurable: false,
        },
        {
          // 设施型号
          title: this.indexLanguage.smartPoleModel,
          key: 'pointModel',
          isShowSort: true,
          width: 160,
          configurable: false,
        },
        {
          // 所属规划、项目
          title: isPlan ? this.indexLanguage.viewPlan : this.indexLanguage.viewProject,
          key: isPlan ? 'planName' : 'projectName',
          isShowSort: true,
          width: 160,
          configurable: false,
        }
      ],
      simplePageTotalShow: true,
      showPagination: true,
      simplePage: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [],
      sort: (e) => {
        this.dataSet.sort(this.compare(e.sortField, e.sortRule));
        this.dataSet = [].concat(this.dataSet);
      },
      handleSelect: (e) => {
        if (e.length >= 5 && this.checkLastArr.length !== 4) {
          this.dataTotalSet.forEach(item => {
            item.checked = true;
          });
        } else if (e.length === 0 && this.checkLastArr.length !== 1) {
          this.dataTotalSet.forEach(item => {
            item.checked = false;
          });
        }
        this.checkLastArr = e;
      }
    };
  }

  /**
   * 字符串排序
   * param property
   * param sortRule
   */
  public compare(property, sortRule) {
    return (a, b) => {
      const vOne = a[property];
      const vtwo = b[property];
      if (sortRule === 'asc') {
        return vOne.localeCompare(vtwo);
      }
      if (sortRule === 'desc') {
        return vtwo.localeCompare(vOne);
      }
    };
  }

  /**
   * 坐标调整弹框取消或关闭
   */
  handleCancel() {
    this.okIsVisible = false;
  }

  /**
   * 坐标调整弹框确定
   */
  handleOk() {
    if (this.singleCoordinate) {
      // 单个坐标调整
      this.$adjustCoordinatesService.eventEmit.emit({isSave: true, isDrags: true});
    } else {
      // 批量坐标调整
      const data = this.formStatus.getData();
      data.type = this.radioValue;
      const value = this.allEquipmentId.concat(this.allDeviceId);
      this.$adjustCoordinatesService.eventEmit.emit({isSave: true, data: data, value: value, isDrags: false});
    }
    this.handleCancel();
    this.showDropOut();
  }
}
