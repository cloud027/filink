import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { NzI18nService } from 'ng-zorro-antd';
import * as _ from 'lodash';
import * as $ from 'jquery';
import { FiLinkModalService } from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import { TableComponent } from '../../../../../shared-module/component/table/table.component';
import { MapComponent } from '../../../../../shared-module/component/map/map.component';
import { MapConfig } from '../../../../../shared-module/component/map/map.config';
import { PageModel } from '../../../../../shared-module/model/page.model';
import { TableConfigModel } from '../../../../../shared-module/model/table-config.model';
import {
  FilterCondition,
  QueryConditionModel,
  SortCondition,
} from '../../../../../shared-module/model/query-condition.model';
import { AssetManagementLanguageInterface } from '../../../../../../assets/i18n/asset-manage/asset-management.language.interface';
import { FacilityLanguageInterface } from '../../../../../../assets/i18n/facility/facility.language.interface';
import { ResultModel } from '../../../../../shared-module/model/result.model';
import { LoopListModel } from '../../../../../core-module/model/loop/loop-list.model';
import { LoopMapDeviceDataModel } from '../../../../facility/share/model/loop-map-device-data.model';
import { ResultCodeEnum } from '../../../../../shared-module/enum/result-code.enum';
import { FilinkMapEnum } from '../../../../../shared-module/enum/filinkMap.enum';
import { LoopTypeEnum, LoopStatusEnum } from '../../../../../core-module/enum/loop/loop.enum';
import { LanguageEnum } from '../../../../../shared-module/enum/language.enum';
import { MIN_HEIGHT_CONST } from '../../../../facility/share/const/loop-const';
import { ApplicationInterface } from '../../../../../../assets/i18n/application/application.interface';

import { CommonLanguageInterface } from '../../../../../../assets/i18n/common/common.language.interface';
import { ImportMissionService } from '../../../../../core-module/mission/import.mission.service';

import { CommonUtil } from '../../../../../shared-module/util/common-util';
import { FacilityForCommonService } from '../../../../../core-module/api-service/facility/facility-for-common.service';

@Component({
  selector: 'app-collection-hl',
  templateUrl: './collection-hl.component.html',
  styleUrls: ['./collection-hl.component.scss'],
})
export class CollectionHlComponent implements OnInit, OnDestroy {
  // ????????????
  @ViewChild('loopStatusRef') loopStatusRef: TemplateRef<HTMLDocument>;
  //  ????????????
  @ViewChild('loopTypeRef') loopTypeRef: TemplateRef<HTMLDocument>;
  // ??????
  @ViewChild('mainMap') mainMap: MapComponent;
  // ????????????
  @ViewChild('tableComponent') tableComponent: TableComponent;
  /** ????????????????????????key?????? */
  @Input() public selectEquipments: any = [];
  /** ?????????????????? */
  @Input() public title: string;
  /** ?????????????????? */
  @Input()
  set collectionHLVisible(params) {
    this._collectionHLVisible = params;
    this.collectionHLVisibleChange.emit(this._collectionHLVisible);
  }
  // ??????modal???????????????
  get collectionHLVisible() {
    return this._collectionHLVisible;
  }
  /** ??????id */
  @Input() public selectEquipmentId;
  /** ???????????? */
  @Input() tranFilterConditions: FilterCondition[] = [];
  /** ?????????????????? */
  @Output() public collectionHLVisibleChange = new EventEmitter<any>();
  /** ?????????????????? */
  @Output() public selectDataChange = new EventEmitter<any>();
  /** ???????????? */
  public _selectedData: any = [];
  // ????????????
  public _collectionHLVisible = false;
  // ???????????????
  public commonLanguage: CommonLanguageInterface;

  // ????????????
  public mapConfig: MapConfig;
  // ????????????????????????
  public data: LoopMapDeviceDataModel[] = [];
  // ??????????????????
  public iconSize: string;
  // ????????????
  public mapType: FilinkMapEnum;
  // ????????????????????????????????????
  public isShowButton: boolean = false;
  // ???????????????
  public language: FacilityLanguageInterface;
  // ???????????????
  public assetLanguage: AssetManagementLanguageInterface;
  // ????????????
  public dataSet: LoopListModel[] = [];
  // ??????????????????
  public pageBean: PageModel = new PageModel();
  // ????????????
  public tableConfig: TableConfigModel;
  // ??????????????????
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // ????????????????????????
  public isShowTable: boolean = true;
  // ?????????????????????????????????
  public isShowUpIcon: boolean = true;
  // ?????????????????????????????????
  public isShowDownIcon: boolean = true;
  // ????????????????????????
  public isVisible: boolean = false;
  // ??????????????????
  public loopModalTitle: string;
  // ???????????????
  public centerPoint: string[];
  // ?????????????????????id??????
  public deviceIds: string[] = [];
  // ???????????????????????????????????????
  public isMoveOut: boolean;
  // ??????????????????????????????
  public areaFacilityByLoop: boolean = false;
  // ??????????????????????????????
  public srcPositionY: number;
  // ????????????????????????
  public minHeight: number = MIN_HEIGHT_CONST;
  // ????????????????????????
  public maxHeight: number;
  // ?????????????????????
  public languageTable: ApplicationInterface;
  // ?????????????????????
  public languageEnum = LanguageEnum;
  // ????????????????????????
  private loopSelectedData: LoopListModel[] = [];
  // ??????????????????
  public selectFacility: boolean = true;

  // ??????????????????
  public loopStatusEnum = LoopStatusEnum;
  // ??????????????????
  public loopTypeEnum = LoopTypeEnum;

  constructor(
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $refresh: ImportMissionService,
    private $facilityForCommonService: FacilityForCommonService,
  ) {}

  /**
   * ?????????
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.assetLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this._selectedData = this.selectEquipments || [];
    // ???????????????
    this.initTableConfig();
    // ??????????????????
    this.refreshData();
    console.log(111, 'ngOnInit');
  }

  /**
   * ????????????
   */
  public ngOnDestroy(): void {
    console.log(111, 'ngOnDestroy');
    this.loopStatusRef = null;
    this.tableComponent = null;
    this.loopTypeRef = null;
    this.mainMap = null;
  }

  /**
   * ????????????
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }
  /**
   * ????????????
   */
  public onEquipmentChange(event: string, data): void {
    this.selectEquipmentId = event;
    this._selectedData = [data];
  }

  Confirm() {
    const data = this._selectedData;
    this.selectDataChange.emit(data);
    this.collectionHLVisible = false;
  }
  close() {}
  clearSelectData() {
    this.tableComponent.keepSelectedData.clear();
    this.tableComponent.checkStatus();
    this._selectedData = [];
    this.selectEquipments = [];
    this.selectEquipmentId = null;
    this.refreshData();
  }

  /**
   * ?????????????????????
   */
  private initTableConfig() {
    this.tableConfig = {
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      notShowPrint: true,
      noAutoHeight: true,
      scroll: { x: '600px', y: '450px' },
      noIndex: true,
      showSearchExport: false,
      showPagination: true,
      bordered: false,
      showSearch: false,
      keepSelected: true,
      selectedIdKey: 'loopId',
      topButtons: [],
      operation: [],
      columnConfig: [
        {
          type: 'select',
          fixedStyle: { fixedLeft: true, style: { left: '0px' } },
          width: 62,
        },
        {
          type: 'serial-number',
          title: this.language.serialNumber,
          width: 62,
          fixedStyle: { fixedLeft: true, style: { left: '62px' } },
        },
        {
          // ????????????
          title: this.language.loopName,
          key: 'loopName',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
          fixedStyle: { fixedLeft: true, style: { left: '124px' } },
        },
        {
          // ????????????
          title: this.assetLanguage.loopCode,
          key: 'loopCode',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // ????????????
          title: this.language.loopType,
          key: 'loopType',
          type: 'render',
          renderTemplate: this.loopTypeRef,
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: CommonUtil.codeTranslate(
              LoopTypeEnum,
              this.$nzI18n,
              null,
              LanguageEnum.facility,
            ),
            label: 'label',
            value: 'code',
          },
        },
        {
          // ????????????
          title: this.assetLanguage.loopStatus,
          key: 'loopStatus',
          type: 'render',
          renderTemplate: this.loopStatusRef,
          width: 120,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select',
            selectInfo: CommonUtil.codeTranslate(
              LoopStatusEnum,
              this.$nzI18n,
              null,
              LanguageEnum.facility,
            ),
            label: 'label',
            value: 'code',
          },
        },
        {
          // ???????????????
          title: this.language.distributionBox,
          key: 'distributionBoxName',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // ????????????
          title: this.language.controlledObject,
          key: 'centralizedControlName',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // ??????
          title: this.language.remarks,
          key: 'remark',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // ??????
          title: this.language.operate,
          searchable: true,
          searchConfig: { type: 'operate' },
          key: '',
          width: 180,
          fixedStyle: { fixedRight: true, style: { right: '0px' } },
        },
      ],
      // ????????????
      handleSelect: (event) => {
        this._selectedData = event;
        this.selectEquipments = event;
      },
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
    };
  }
  /**
   * ????????????
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    this.handelFilterCondition();
    this.$facilityForCommonService.queryLoopList(this.queryCondition).subscribe(
      (result: ResultModel<LoopListModel[]>) => {
        this.tableConfig.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.pageBean.Total = result.totalCount;
          this.pageBean.pageIndex = result.pageNum;
          this.pageBean.pageSize = result.size;
          this.dataSet = result.data || [];
          this.dataSet.forEach((item) => {
            // ???????????????????????????????????????????????????
            item.isShowOperateIcon = !!item.centralizedControlId;
          });
        } else {
          this.$message.error(result.msg);
        }
      },
      () => {
        this.tableConfig.isLoading = false;
      },
    );
  }

  /**
   * ??????????????????
   */
  private handelFilterCondition(): void {
    if (!_.isEmpty(this.tranFilterConditions)) {
      this.tranFilterConditions.forEach((item) => {
        const index = this.queryCondition.filterConditions.findIndex(
          (v) => v.filterField === item.filterField,
        );
        if (index < 0) {
          this.queryCondition.filterConditions.push(item);
        } else {
          this.queryCondition.filterConditions[index].filterValue = _.intersection(
            this.queryCondition.filterConditions[index].filterValue,
            item.filterValue,
          );
        }
      });
    }
  }
}
