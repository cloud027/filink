import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../../shared-module/model/query-condition.model';
import {OnlineLanguageInterface} from '../../../../../../assets/i18n/online/online-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {ApplicationService} from '../../../share/service/application.service';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {ElectricConst, RouterJumpConst} from '../../../share/const/application-system.const';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {ApplicationInterface} from '../../../../../../assets/i18n/application/application.interface';
import {LoopModel} from '../../../share/model/loop.model';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {DistributeModel} from '../../../share/model/distribute.model';
import {Router} from '@angular/router';
import {TableColumnConfig} from '../../../share/config/table-column.config';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {AssetManagementLanguageInterface} from '../../../../../../assets/i18n/asset-manage/asset-management.language.interface';
import {LoopUtil} from '../../../share/util/loop-util';
import {LightLoopTableEnum} from '../../../share/enum/auth.code.enum';
import {ControlInstructEnum} from '../../../../../core-module/enum/instruct/control-instruct.enum';
import {LoopViewDetailModel} from '../../../../../core-module/model/loop/loop-view-detail.model';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import {FacilityForCommonService} from '../../../../../core-module/api-service';

/**
 * ????????????-????????????
 */
@Component({
  selector: 'app-loop',
  templateUrl: './loop.component.html',
  styleUrls: ['./loop.component.scss']
})
export class LoopComponent implements OnInit, OnChanges {
  @Input() tableColumn: TableConfigModel;
  // ?????????????????????????????????
  @Input() filterValueChange;
  // ??????????????????????????????
  @Output() loopEvent = new EventEmitter();
  // ????????????????????????
  public dataSet: LoopModel[] = [];
  // ????????????
  public pageBean: PageModel = new PageModel();
  // ????????????
  public tableConfig: TableConfigModel;
  // ?????????????????????
  public loopColumnConfig = [];
  // ???????????????
  public language: OnlineLanguageInterface;
  // ?????????????????????
  public languageTable: ApplicationInterface;
  // ???????????????
  public facilityLanguage: FacilityLanguageInterface;
  // ???????????????
  public assetLanguage: AssetManagementLanguageInterface;
  // ????????????????????????
  public loopSelectedData: LoopModel[] = [];
  // ??????????????????
  private queryCondition: QueryConditionModel = new QueryConditionModel();

  constructor(
    // ???????????????
    private $nzI18n: NzI18nService,
    // ??????
    private $router: Router,
    // ??????
    private $message: FiLinkModalService,
    // ????????????
    private $applicationService: ApplicationService,
    private $facilityForCommonService: FacilityForCommonService,
  ) {
    // ?????????
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.online);
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.assetLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);
    this.facilityLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
  }

  /**
   * ?????????
   */
  public ngOnInit(): void {
    if (!this.tableColumn) {
      this.initTableConfig();
    } else {
      this.tableConfig = this.tableColumn;
    }
    this.refreshData();
  }

  public ngOnChanges(changes: SimpleChanges) {
    // ??????filterValueChange???????????????
    if (changes.filterValueChange.currentValue && !changes.filterValueChange.firstChange) {
      // ???????????????????????????????????????????????????
      if (changes.filterValueChange.currentValue.length > 0) {
        this.queryCondition.filterConditions = [new FilterCondition('deviceIds', OperatorEnum.in, this.filterValueChange)];
      } else {
        this.queryCondition.filterConditions = [];
      }
      // ???????????????????????????????????????????????????
      this.refreshData();
    }
  }
  /**
   * ????????????
   * @ param event
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }
  /**
   * ?????????????????????
   */
  private initTableConfig(): void {
    this.handleColumn();
    this.tableConfig = {
      outHeight: 108,
      primaryKey: LightLoopTableEnum.primaryKey,
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      notShowPrint: true,
      scroll: {x: '1600px', y: '600px'},
      noIndex: true,
      showSearchExport: false,
      columnConfig: this.loopColumnConfig,
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [
        // ??????
        {
          text: this.languageTable.equipmentTable.pull,
          needConfirm: true,
          canDisabled: true,
          permissionCode: LightLoopTableEnum.primaryPullKey,
          btnType: 'special',
          iconClassName: 'fiLink-filink-lazha-icon',
          confirmContent: `${this.languageTable.equipmentTable.confirmPull}?`,
          handle: (data: LoopModel[]) => {
            this.pullGate(data, ElectricConst.up);
          }
        },
        // ??????
        {
          text: this.languageTable.equipmentTable.gate,
          needConfirm: true,
          canDisabled: true,
          permissionCode: LightLoopTableEnum.primaryGateKey,
          btnType: 'special',
          iconClassName: 'fiLink-filink-hezha-icon',
          confirmContent: `${this.languageTable.equipmentTable.confirmGate}?`,
          handle: (data: LoopModel[]) => {
            this.pullGate(data, ElectricConst.down);
          }
        },
      ],
      operation: [
        // ??????
        {
          text: this.languageTable.equipmentTable.details,
          className: 'fiLink-view-detail',
          permissionCode: LightLoopTableEnum.primaryDetailKey,
          handle: (data: LoopViewDetailModel) => {
            this.handEquipmentOperation(data);
          },
        },
        // ??????
        {
          text: this.languageTable.equipmentTable.pull,
          className: 'fiLink-pull-gate',
          needConfirm: true,
          permissionCode: LightLoopTableEnum.primaryPullKey,
          confirmContent: `${this.languageTable.equipmentTable.confirmPull}?`,
          handle: (currentIndex: LoopModel) => {
            this.pullGate([currentIndex], ElectricConst.up);
          }
        },
        // ??????
        {
          text: this.languageTable.equipmentTable.gate,
          className: 'fiLink-close-gate',
          needConfirm: true,
          permissionCode: LightLoopTableEnum.primaryGateKey,
          confirmContent: `${this.languageTable.equipmentTable.confirmGate}?`,
          handle: (currentIndex: LoopModel) => {
            this.pullGate([currentIndex], ElectricConst.down);
          }
        }
      ],
      // ??????
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      // ??????
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      },
      // ????????????????????????
      handleSelect: (event: LoopModel[]) => {
        this.loopSelectedData = event;
        this.loopEvent.emit(this.loopSelectedData);
      }
    };
  }

  /**
   * ???????????????
   */
  private handleColumn(): void {
    this.loopColumnConfig = TableColumnConfig.loopColumnConfig(
      this.facilityLanguage,
      this.assetLanguage,
      this.$nzI18n,
      true);
    this.loopColumnConfig.unshift({type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62});
  }


  /**
   * ??????/??????
   * @ param data ???????????????
   * @ param type ???????????????
   */
  private pullGate(data: LoopModel[], type: string): void {
    const action = type === ElectricConst.up ? ControlInstructEnum.closeBreak : ControlInstructEnum.openBreak;
    const loopList = data.map((item) => {
      return {
        equipmentId: item.centralizedControlId,
        loopCode: item.loopCode
      };
    });
    const params: DistributeModel = {
      commandId: action,
      equipmentIds: data.map(item => item.centralizedControlId),
      param: {
        loopList: loopList
      }
    };
    this.instructDistribute(params);
  }

  /**
   * ????????????
   */
  private instructDistribute(params: DistributeModel): void {
    // ??????????????????????????????
    this.checkEquipmentMode(params.equipmentIds).then( resolve => {
      if (resolve.code === ResultCodeEnum.success) {
        this.$applicationService.instructDistribute(params).subscribe((res: ResultModel<string>) => {
          if (res.code === ResultCodeEnum.success) {
            // ??????????????????????????????
            this.$message.success(`${this.languageTable.contentList.distribution}!`);
            this.refreshData();
          } else {
            // ????????????????????????????????????
            this.$message.error(res.msg);
          }
        });
      } else {
        // ????????????????????????????????????
        this.$message.error(resolve.msg);
      }
    });
  }

  /**
   * ??????????????????
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    this.$applicationService.loopListByPage(this.queryCondition).subscribe((res: ResultModel<LoopModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        this.tableConfig.isLoading = false;
        const {data, totalCount, pageNum, size} = res;
        this.dataSet = data;
        this.pageBean.Total = totalCount;
        this.pageBean.pageIndex = pageNum;
        this.pageBean.pageSize = size;
        LoopUtil.loopFmt(this.dataSet, this.$nzI18n);
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * ????????????
   */
  private handEquipmentOperation(data): void {
    this.$router.navigate([`${RouterJumpConst.loopDetails}`], {
      queryParams: {
        distributionBoxName: data.distributionBoxName,
        controlledObject: data.centralizedControlName,
        loopName: data.loopName,
        loopCode: data.loopCode,
        loopId: data.loopId,
        remark: data.remark,
        centralizedControlId: data.centralizedControlId,
        createTime: data.createTime
      }
    }).then();
  }
  /**
   * ?????????????????????????????????
   */
  private checkEquipmentMode(data): Promise<ResultModel<any>> {
    return new Promise((resolve, reject) => {
      this.$facilityForCommonService.checkEquipmentMode({loopControlEquipmentIdList: data}).subscribe((res: ResultModel<any>) => {
        resolve(res);
      });
    });
  }
}
