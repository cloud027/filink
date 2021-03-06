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
 * ????????????
 */
@Component({
  selector: 'app-select-grouping',
  templateUrl: './select-grouping.component.html',
  styleUrls: ['./select-grouping.component.scss']
})
export class SelectGroupingComponent implements OnInit, AfterViewInit, OnDestroy {
  // ??????????????? ??????/??????
  @Input() facilityType: string;
  // ????????????
  @Input() viewIndex: string;
  // ??????????????????????????????????????????
  @Output() addGroupingEventEmitter = new EventEmitter<boolean>();
  // ????????????
  public maintenanceView = ViewEnum;
  // ?????????????????????
  public mapTypeEnum = MapTypeEnum;
  // ????????????????????????
  public addGrouping: boolean = false;
  // ????????????????????????
  public queryGroupListCondition: QueryConditionModel = new QueryConditionModel();
  // ????????????
  public groupTypeEnum = IndexGroupTypeEnum;
  // ???????????????
  public radioValue = IndexGroupTypeEnum.current;
  // ????????????
  public pageBean: PageModel = new PageModel(PageSizeEnum.sizeFive);
  // ?????????
  public indexLanguage: IndexLanguageInterface;
  // ???????????????
  public commonLanguage: CommonLanguageInterface;
  // ????????????
  public formColumn: FormItem[] = [];
  // ????????????
  public formStatus: FormOperate;
  // ????????????
  public tableConfig: TableConfigModel;
  // ????????????????????????
  public isVisible: boolean = false;
  // ?????????????????????
  public dataSet: object[] = [];
  // ????????????
  public dataTotalSet = [];
  // ??????
  public stepIndex = StepIndexEnum.back;
  // ????????????
  public stepNum = num;
  // ?????????
  public title: string;
  // ????????????
  public indexType: string;
  // ???????????????????????????/??????????????????
  public showContent: boolean = false;
  // ?????????????????????
  public selectValue: string;
  // ?????????????????????
  public listOfOption: GroupListModel[] = [];
  // ???????????????ID
  public allDeviceId: any[] = [];
  // ???????????????ID
  public allEquipmentId: any[] = [];
  // ?????????????????????ID
  public selectDeviceId: string[] = [];
  // ?????????????????????ID
  public selectEquipmentId: string[] = [];
  // ????????????loading
  public isLoading: boolean = false;
  // ?????????????????????
  public groupNameRepeat: boolean = true;
  // ???????????????????????????????????????????????????
  public deviceOrEquipment: boolean;
  // ???????????????
  private destroy$ = new Subject<void>();

  /**
   * ??????????????????
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
   * ???????????????
   */
  public ngOnInit(): void {
    // ??????
    this.title = this.indexLanguage.addToGroup;
    // ?????????????????????
    this.groupInit();
    // ?????????????????????
    this.$OperationService.eventEmit.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value.selectGroup === false) {
        this.addGrouping = value.selectGroup;
      }
    });
  }

  ngAfterViewInit() {
    // ???????????????
    this.initColumn();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * ???????????????
   */
  public groupInit(): void {
    this.$selectGroupService.eventEmit.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value.datas && value.showCoverage) {
        this.indexType = value.showCoverage;
        if (value.showCoverage === MapTypeEnum.facility) {
          // ??????????????????
          this.dataTotalSet = value.datas;
          // ??????????????????
          this.tableDeviceConfig(true);
        } else {
          // ????????????????????????
          const equipmentData = [];
          value.datas.forEach(item => {
            equipmentData.push(item.equipmentList);
          });
          this.dataTotalSet = lodash.flattenDeep(equipmentData);
          // ??????????????????
          this.tableDeviceConfig(false);
        }
        // ????????????
        this.pageBean.pageIndex = 1;
        this.dataSet = [];
        this.dataTotalSet.forEach(item => {
          item['checked'] = false;
        });
        // ????????????????????????????????????
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
        // ?????????????????????
        this.initialize();
        this.addGrouping = false;
      }
    });
  }


  /**
   * ????????????????????????
   */
  public groupingShow(): void {
    this.addGrouping = !this.addGrouping;
    this.addGroupingEventEmitter.emit(this.addGrouping);
  }

  /**
   * ????????????????????????
   */
  public showModal(): void {
    if (this.$mapCoverageService.showCoverage === 'facility') {
      this.deviceOrEquipment = true;
    } else {
      this.deviceOrEquipment = false;
    }
    // ?????????????????????
    this.dataSet = [];
    // ??????????????????
    this.$selectGroupService.eventEmit.emit({isShow: this.addGrouping});
  }

  // ???????????????
  public initialize(): void {
    // ????????????
    this.isVisible = true;
    // ?????????
    this.stepIndex = StepIndexEnum.back;
    // ???????????????????????????/??????????????????
    this.showContent = false;
    // ??????????????????
    this.radioValue = IndexGroupTypeEnum.current;
  }

  /**
   * ????????????
   */
  public closeModal(): void {
    // ?????????????????????
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
   * ??????
   */
  public modifyGrouphandleOk(): void {
    this.isLoading = true;
    this.$selectGroupService.eventEmit.emit({isShow: false});
    // ?????????????????????
    if (this.radioValue === IndexGroupTypeEnum.current) {
      this.addToExistGroupInfo();
    }
  }

  /**
   * ??????
   */
  public addGroupHandleOk(): void {
    this.isLoading = true;
    this.$selectGroupService.eventEmit.emit({isShow: false});
    // ????????????
    if (this.radioValue === IndexGroupTypeEnum.create) {
      this.addGroupInfo();
    }
  }


  /**
   * ?????????
   */
  public handleBack(): void {
    // ?????????
    this.stepIndex = StepIndexEnum.back;
    // ???????????????????????????/??????????????????
    this.showContent = false;
  }

  /**
   * ?????????
   */
  public handleNext(): void {
    if (this.indexType === MapTypeEnum.facility) {
      // ??????????????????
      this.allDeviceId = [];
      this.dataTotalSet.forEach(item => {
        if (item.checked && item.checked === true) {
          this.allDeviceId.push(item);
        }
      });
    }
    if (this.indexType === MapTypeEnum.equipment) {
      // ??????????????????
      this.allEquipmentId = [];
      this.dataTotalSet.forEach(item => {
        if (item.checked && item.checked === true) {
          this.allEquipmentId.push(item);
        }
      });
    }
    if (this.allDeviceId.length || this.allEquipmentId.length) {
      // ?????????
      this.stepIndex = StepIndexEnum.next;
      // ???????????????????????????/??????????????????
      this.showContent = true;
      // ????????????
      this.getGroupList();
      // ??????
      this.analysisSelectData();
    } else {
      this.$message.warning(this.indexLanguage.pleaseSelectData);
    }
  }

  /**
   * ??????
   */
  public pageChange(event): void {
    this.pageBean.pageIndex = event.pageIndex;
    this.pageBean.pageSize = event.pageSize;
    this.dataSet = this.dataTotalSet.slice(this.pageBean.pageSize * (this.pageBean.pageIndex - 1),
      this.pageBean.pageIndex * this.pageBean.pageSize);
  }

  /**
   * ????????????
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
        // ?????????
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0'}}, width: 62},
        // ??????
        {
          type: 'serial-number', width: 62, title: this.indexLanguage.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        {
          // ????????????
          title: isDevice ? this.indexLanguage.searchDeviceName : this.indexLanguage.equipmentName,
          key: isDevice ? 'deviceName' : 'equipmentName',
          isShowSort: true,
          width: 160,
          configurable: false,
        },
        {
          // ????????????
          title: this.indexLanguage.address, key: 'address',
          isShowSort: true,
          width: 160,
          configurable: false,
        },
        {
          // ????????????
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
   * ??????????????????
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
   * ????????????????????????????????????
   */
  private addToExistGroupInfo(): void {
    if (this.radioValue) {
      const para = new AddToExistGroupModel();
      // ????????????id
      para.groupId = this.selectValue;
      // ??????????????????
      para.groupDeviceInfoIdList = this.selectDeviceId;
      // ??????????????????
      para.groupEquipmentIdList = this.selectEquipmentId;
      this.$IndexFacilityService.addToExistGroupInfo(para).subscribe((result: ResultModel<GroupListModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          // ??????????????????
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
   * ?????????????????????????????????
   */
  private addGroupInfo(): void {
    if (this.formStatus.getData('groupName')) {
      const para = new AddGroupResultModel();
      // ????????????
      para.groupName = this.formStatus.getData('groupName');
      // ??????
      para.remark = this.formStatus.getData('remark');
      // ??????????????????
      para.groupDeviceInfoIdList = this.selectDeviceId;
      // ??????????????????
      para.groupEquipmentIdList = this.selectEquipmentId;
      this.$IndexFacilityService.addGroupInfo(para).subscribe((result: ResultModel<string>) => {
        if (result.code === ResultCodeEnum.success) {
          // ??????????????????
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
   * ?????????????????????
   */
  private analysisSelectData(): void {
    // ????????????
    if (this.indexType === MapTypeEnum.facility) {
      if (this.allDeviceId) {
        this.selectDeviceId = this.allDeviceId.map(item => {
          return item.facilityId;
        });
      }
    }
    // ????????????
    if (this.indexType === MapTypeEnum.equipment) {
      if (this.allEquipmentId) {
        this.selectEquipmentId = this.allEquipmentId.map(item => {
          return item.facilityId;
        });
      }
    }
  }

  /**
   * ??????????????????
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
   * ??????????????????
   */
  private formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
  }

  /**
   * ????????????
   */
  private disabledModifyGroup() {
    if ((this.radioValue === IndexGroupTypeEnum.current && this.selectValue)) {
      return false;
    } else {
      return true;
    }
  }


  /**
   * ????????????
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
