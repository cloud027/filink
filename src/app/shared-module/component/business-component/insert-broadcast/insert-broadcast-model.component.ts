import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {SliderValueConst} from '../../../../business-module/application-system/share/const/slider.const';
import {NzI18nService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {PageSizeEnum} from '../../../enum/page-size.enum';
import {ApplicationService} from '../../../../business-module/application-system/share/service/application.service';
import {FiLinkModalService} from '../../../service/filink-modal/filink-modal.service';
import * as _ from 'lodash';
import {DistributeModel} from '../../../../business-module/application-system/share/model/distribute.model';
import {ControlInstructEnum} from '../../../../core-module/enum/instruct/control-instruct.enum';


import {PageModel} from '../../../model/page.model';
import {TableConfigModel} from '../../../model/table-config.model';
import {FilterCondition, PageCondition, QueryConditionModel, SortCondition} from '../../../model/query-condition.model';
import {ResultModel} from '../../../model/result.model';
import {getFileType, getProgramStatus} from '../../../../business-module/application-system/share/util/application.util';
import {ApplicationInterface} from '../../../../../assets/i18n/application/application.interface';
import {LanguageEnum} from '../../../enum/language.enum';
import {ContentListModel} from '../../../../business-module/application-system/share/model/content.list.model';
import {FileTypeEnum, ProgramStatusEnum, ProgramTypeEnum} from '../../../../business-module/application-system/share/enum/program.enum';
import {CheckUserModel} from '../../../../business-module/application-system/share/model/check.user.model';
import {ListExportModel} from '../../../../core-module/model/list-export.model';
import {ResultCodeEnum} from '../../../enum/result-code.enum';
import {OperatorEnum} from '../../../enum/operator.enum';
import {RoleUnitModel} from '../../../../core-module/model/work-order/role-unit.model';
import {TableComponent} from '../../table/table.component';
@Component({
  selector: 'app-insert-broadcast-model',
  templateUrl: './insert-broadcast-model.component.html',
  styleUrls: ['./insert-broadcast-model.component.scss']
})
export class InsertBroadcastModelComponent implements OnInit {
  // ??????????????????
  @Input()
  set xcVisible(params) {
    this.isXcVisible = params;
    this.xcVisibleChange.emit(this.isXcVisible);
  }
  // ??????????????????
  get xcVisible() {
    return this.isXcVisible;
  }
  // ??????????????????????????????
  @Output() xcVisibleChange = new EventEmitter<boolean>();
  // ????????????
  @Input() title: string;
  // ???????????????
  @Input() public insertVolumeValue: number;
  @Input() public equipmentList;
  // ?????????????????????0???????????????1
  @Input() public insertType;
  /**
   * ???????????????????????????
   */
  @ViewChild('programFiles') programFiles: TemplateRef<any>;
  /**
   * ????????????????????????
   */
  @ViewChild('remarksTable') remarksTable: TemplateRef<any>;
  /**
   * ??????????????????
   */
  @ViewChild('roleTemp') roleTemp: TemplateRef<any>;
  @ViewChild('contentTemp') contentTemp: TableComponent;
  // ??????????????????
  public isXcVisible: boolean = false;
  // ??????????????????
  public sliderValue = SliderValueConst;
  // ???????????????
  public volumeMax: number = SliderValueConst.volumeMax;
  // ?????????????????????
  public languageTable: ApplicationInterface;
// ???????????????
  public dataSet: ContentListModel[] = [];
  // ????????????
  public pageBean: PageModel = new PageModel(PageSizeEnum.sizeFive);
  /**
   * ??????????????????
   */
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // ????????????
  public tableConfig: TableConfigModel = new TableConfigModel();
  /**
   * ???????????????
   */
  public isPreview: boolean = false;
 /**
   * ????????????
   */
  public playTime: number = 0;
  public volumeValue: number = 0;
  /**
   * ????????????
   */
  public filePath: string = '';
  /**
   * ????????????
   */
  public playCutInName: string = '';
  /**
   * ?????????????????????
   */
  private reviewedSearchList: RoleUnitModel[] = [];
  /**
   * ??????????????????
   */
  public reviewedBy: string;
  /**
   * ???????????????
   */
  public reviewedByArr: CheckUserModel[] = [];
  private programList = [];
  constructor(
    // ??????
    public $router: Router,
    // ???????????????
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $applicationService: ApplicationService,
  ) {
    // ?????????????????????
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
  }

  ngOnInit() {
    // this.insertVolumeValue = SliderValueConst.min;
    this.queryCondition.pageCondition = new PageCondition(1, PageSizeEnum.sizeFive);
    this.initTableConfig();
    this.getCheckUsers();
    this.refreshData();
  }
  changeProgram () {

  }
  /**
   * ??????????????????
   */
  private refreshData(): void {
    // ???????????????
    this.tableConfig.isLoading = false;
    const hasProgramStatusFilter = this.queryCondition.filterConditions.some(item => item.filterField === 'programStatus ');
    if (!hasProgramStatusFilter) {
      this.queryCondition.filterConditions.push(new FilterCondition('programStatus', OperatorEnum.eq, ProgramStatusEnum.enabled));
    }
    const hasProgramTypeFilter = this.queryCondition.filterConditions.some(item => item.filterField === 'programType ');
    if (!hasProgramTypeFilter) {
      this.queryCondition.filterConditions.push(new FilterCondition('programType', OperatorEnum.eq, ProgramTypeEnum.broadcast));
    }
    this.$applicationService.getReleaseContentList(this.queryCondition)
      .subscribe((result: ResultModel<ContentListModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.tableConfig.isLoading = false;
          this.dataSet = result.data;
          this.pageBean.Total = result.totalCount;
          this.pageBean.pageIndex = result.pageNum;
          this.pageBean.pageSize = result.size;
          this.dataSet.forEach(item => {
            item.programStatus = getProgramStatus(this.$nzI18n, item.programStatus) as ProgramStatusEnum;
            item.programFileType = getFileType(this.$nzI18n, item.programFileType) as FileTypeEnum;
          });
        } else {
          this.$message.error(result.msg);
          this.tableConfig.isLoading = false;
        }
      }, () => {
        this.tableConfig.isLoading = false;
      });
  }
  /**
   * ?????????????????????
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      primaryKey: '09-2-4',
      showSizeChanger: true,
      notShowPrint: true,
      showSearchExport: false,
      scroll: {x: '1600px', y: '600px'},
      pageSizeOptions: [5, 10, 20, 30, 40],
      noIndex: true,
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        // ??????
        {
          type: 'serial-number', width: 62, title: this.languageTable.frequentlyUsed.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        // ????????????
        {
          title: this.languageTable.contentList.programName, key: 'programName', width: 150, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        // ??????
        {
          title: this.languageTable.frequentlyUsed.state, key: 'programStatus', width: 150, isShowSort: true,
          configurable: true,
          searchable: false,
        },
        // ????????????
        {
          title: this.languageTable.contentList.programPurpose, key: 'programPurpose', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // ??????
        {
          title: this.languageTable.contentList.duration, key: 'duration', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // ??????
        {
          title: this.languageTable.contentList.format, key: 'mode', width: 180, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // ??????
        {
          title: this.languageTable.contentList.fileType, key: 'programFileType', width: 180, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: getFileType(this.$nzI18n),
            label: 'label',
            value: 'code'
          },
        },
        // ?????????
        {
          title: this.languageTable.contentList.applicant, key: 'applyUser', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // ?????????
        {
          title: this.languageTable.contentList.addBy, key: 'addUserName', width: 150,
          searchKey: 'addUser',
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: this.reviewedSearchList,
            renderTemplate: this.roleTemp,
          },
        },
        // ????????????
        {
          title: this.languageTable.contentList.addTime, key: 'createTime', width: 200, isShowSort: true,
          pipe: 'date',
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'}
        },
        // ?????????
        {
          title: this.languageTable.contentList.checker, key: 'reviewedUserName', width: 150,
          searchKey: 'reviewedUser',
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: this.reviewedSearchList,
            renderTemplate: this.roleTemp
          },
        },
        // ????????????
        {
          title: this.languageTable.contentList.auditTime, key: 'reviewedTime', width: 150, isShowSort: true,
          pipe: 'date',
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'},
        },
        // ????????????
        {
          title: this.languageTable.contentList.programFiles, key: 'programFileName', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.programFiles,
          searchConfig: {type: 'input'}
        },
        // ??????
        {
          title: this.languageTable.frequentlyUsed.remarks, key: 'remark', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.remarksTable,
          searchConfig: {type: 'input'},
        },
        // ??????
        // {
        //   title: this.languageTable.frequentlyUsed.operate, searchable: true,
        //   searchConfig: {type: 'operate'}, key: '', width: 180, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        // },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      topButtons: [],
      moreButtons: [],
      operation: [
        // ??????
        {
          text: this.languageTable.contentList.preview,
          className: 'fiLink-filink-yulan-icon',
          permissionCode: '09-2-4-6',
          handle: (data: ContentListModel) => {
            console.log(data);
            this.preview(data);
          }
        }],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition = event;
        this.refreshData();
      },
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        event.forEach(item => {
          if (item.filterField === 'programFileType' && item.filterValue.includes(FileTypeEnum.image)) {
            item.filterValue = item.filterValue.concat(FileTypeEnum.image.split('-'));
            item.filterValue = item.filterValue.filter(it => it !== FileTypeEnum.image);
          }
        });
        this.refreshData();
      },
      //  ????????????
      handleExport: (event: ListExportModel<ContentListModel[]>) => {},
      handleSelect: (event) => {
        this.programList = event.map(item => {
          return {
            programId: item.programId,
            mode: item.mode,
          };
        });
      },
    };
  }
  /**
   * ??????????????????
   */
  private getCheckUsers(): void {
    this.$applicationService.getCheckUsers()
      .subscribe((result: ResultModel<CheckUserModel[]>) => {
          if (result.code === ResultCodeEnum.success) {
            if (!_.isEmpty(result.data)) {
              this.reviewedByArr = [...result.data] || [];
              this.reviewedBy = this.reviewedByArr[0].id;
              this.reviewedByArr.forEach(item => {
                this.reviewedSearchList.push({'label': item.userName, 'value': item.id});
              });
            }
          } else {
            this.$message.error(result.msg);
          }
        }
      );
  }
  /**
   * ??????
   * @param data ????????????
   */
  public preview(data: ContentListModel): void {
    this.isPreview = true;
    // ???'\'??????'/'
    this.filePath = data.programPath.replace(/\\/g, '/');
  }

  /**
   * ????????????
   */
  public onPreviewCancel(): void {
    this.isPreview = false;
    // ??????????????????
    this.filePath = '';
  }

  /**
   * ????????????
   */
  public onPreviewOk(): void {
    this.isPreview = false;
    // ??????????????????
    this.filePath = '';
  }
  /**
   * ????????????
   * @param event ????????????
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }
  handleOk() {
    let list = [];
    const params = {};
    const volumeParams = {};
    let isGroup = true;
    params['commandId'] = ControlInstructEnum.broadcastPlay;
    params['param'] = {
      playCutInName: this.playCutInName,
        programList: this.programList
    };
    volumeParams['commandId'] = ControlInstructEnum.broadcastVolume;
    volumeParams['param'] = {
      volume: this.insertVolumeValue
    };
    if (this.insertType === 0) {
      list = this.equipmentList.map(item => item.equipmentId);
      params['equipmentIds'] = list;
      volumeParams['equipmentIds'] = list;
      isGroup = false;
    } else {
      list = this.equipmentList.map(item => item.groupId);
      params['groupIds'] = list;
      volumeParams['groupIds'] = list;
      isGroup = true;
    }
    this.confirmInsertBroadcast(params, volumeParams, isGroup);
  }
  handleCancel () {
    this.xcVisible = false;
    // this.queryCondition = new QueryConditionModel();
    // this.tableConfig.clearQueryTerm();
    this.contentTemp.tableQueryTermStoreService.clearQueryTerm();
  }
  /**
   * ????????????
   * @ param params
   */
  public instructDistribute(params: DistributeModel): void {
    this.$applicationService.instructDistribute(params).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        this.$message.success(`${this.languageTable.contentList.distribution}!`);
        this.xcVisible = false;
      } else {
        this.$message.error(res.msg);
      }
    });
  }
  public groupControl(params: DistributeModel): void {
    this.$applicationService.groupControl(params).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        this.$message.success(`${this.languageTable.contentList.distribution}!`);
        this.xcVisible = false;
        this.contentTemp.tableQueryTermStoreService.clearQueryTerm();
      } else {
        this.$message.error(res.msg);
      }
    });
  }
  public handleConvenientChange () {

  }
  public confirmInsertBroadcast (params, volumeParams, isGroup) {
    if (isGroup) {
      this.$applicationService.groupControl(params).subscribe((res: ResultModel<string>) => {
        if (res.code === ResultCodeEnum.success) {
          this.groupControl(volumeParams);
        } else {
          this.$message.error(res.msg);
        }
      });
    } else {
      this.$applicationService.instructDistribute(params).subscribe((res: ResultModel<string>) => {
        if (res.code === ResultCodeEnum.success) {
          this.instructDistribute(volumeParams);
        } else {
          this.$message.error(res.msg);
        }
      });
    }

  }
}
