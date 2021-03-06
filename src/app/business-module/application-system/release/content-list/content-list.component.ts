import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {ApplicationService} from '../../share/service/application.service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {getFileType, getProgramStatus} from '../../share/util/application.util';
import {ApplicationInterface} from '../../../../../assets/i18n/application/application.interface';
import {Download} from '../../../../shared-module/util/download';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {ContentEnableModel, ContentListModel} from '../../share/model/content.list.model';
import {FileNameTypeEnum, FileTypeEnum, ProgramStatusEnum, ProgramTypeEnum} from '../../share/enum/program.enum';
import {CheckUserModel} from '../../share/model/check.user.model';
import {ListExportModel} from '../../../../core-module/model/list-export.model';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {IS_TRANSLATION_CONST} from '../../../../core-module/const/common.const';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {UserForCommonService} from '../../../../core-module/api-service';
import {OperateTypeEnum} from '../../../../shared-module/enum/page-operate-type.enum';
import {RoleUnitModel} from '../../../../core-module/model/work-order/role-unit.model';
import {InformationScreenModalModel} from '../../share/model/information-screen-modal.model';

/**
 * ??????????????????
 */
@Component({
  selector: 'app-content-list',
  templateUrl: './content-list.component.html',
  styleUrls: ['./content-list.component.scss']
})
export class ContentListComponent implements OnInit, OnDestroy {
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
  /**
   * ????????????
   */
  public dataSet: ContentListModel[] = [];
  /**
   * ??????????????????
   */
  public pageBean: PageModel = new PageModel();
  /**
   * ????????????
   */
  public tableConfig: TableConfigModel;
  /**
   * ?????????
   */
  public language: ApplicationInterface;
  /**
   * ???????????????
   */
  public isVideo: boolean = true;
  /**
   * ???????????????
   */
  public isPreview: boolean = false;
  /**
   * ?????????????????????
   */
  public isToExamine: boolean = false;
  /**
   * ????????????
   */
  public filePath: string = '';
  /**
   * ??????????????????
   */
  public reviewedBy: string;
  public boxStyle ;
  /**
   * ???????????????
   */
  public reviewedByArr: CheckUserModel[] = [];
  // ???????????????????????????
  public informationScreen: InformationScreenModalModel[] = [];
  // ????????????????????????
  public informationSelectList = [];
  // ???????????????
  public chooseScreen: InformationScreenModalModel = {
    width: 0,
    height: 0,
    equipmentModel: null
  };
  public imgInfo = {
    width: 0,
    height: 0,
  };
  /**
   * ?????????????????????
   */
  private reviewedSearchList: RoleUnitModel[] = [];
  /**
   * ????????????
   */
  private rowData: ContentListModel;
  /**
   * ??????????????????
   */
  private queryCondition: QueryConditionModel = new QueryConditionModel();

  /**
   * @param $nzI18n  ???????????????
   * @param $router  ??????????????????
   * @param $message  ??????????????????
   * @param $userService  ??????????????????????????????
   * @param $applicationService  ??????????????????????????????
   * @param $download  ????????????
   */
  constructor(
    private $nzI18n: NzI18nService,
    private $router: Router,
    private $message: FiLinkModalService,
    private $userService: UserForCommonService,
    private $applicationService: ApplicationService,
    private $download: Download
  ) {
  }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.initTableConfig();
    this.refreshData();
  }

  /**
   * ????????????
   */
  public ngOnDestroy(): void {
    this.programFiles = null;
    this.remarksTable = null;
    this.roleTemp = null;
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

  /**
   * ???????????????/????????????
   * @param jumpType ????????????
   * @param programId ??????ID
   */
  public openContent(jumpType: string, programId?: string): void {
    this.$router.navigate([`business/application/release/content-list/${jumpType}`], {
      queryParams: {programId: programId}
    }).then();
  }

  /**
   * ??????????????????
   * @param programIdList programId??????
   */
  public checkProgramStatus(programIdList: Array<string>) {
    return this.$applicationService.programStatus(programIdList).toPromise();
  }

  /**
   * ??????????????????
   * @param parameter ????????????????????????
   */
  public updateReleaseContentState(parameter: ContentEnableModel[]): void {
    this.$applicationService.updateReleaseContentState(parameter)
      .subscribe((result: ResultModel<ContentListModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.refreshData();
        } else {
          this.$message.error(result.msg);
        }
      });
  }

  /**
   * ??????
   * @param data ????????????
   */
  public preview(data: ContentListModel): void {
    this.isVideo = data.programFileType === getFileType(this.$nzI18n, FileNameTypeEnum.video);
    if (!this.isVideo) {
      this.chooseScreen = {
        width: 0,
        height: 0,
        equipmentModel: null
      };
      this.imgInfo.width = Number(data.resolution.split('*')[0]);
      this.imgInfo.height = Number(data.resolution.split('*')[1]);
      // ??????
      this.queryScreen();
    } else {
      this.isPreview = true;
    }
    // ???'\'??????'/'
    this.filePath = data.programPath.replace(/\\/g, '/');
  }

  public queryScreen() {
    this.tableConfig.isLoading = true;
    this.$applicationService.queryScreen().subscribe((res: ResultModel<any>) => {
      if (res.code === ResultCodeEnum.success) {
        this.informationScreen = res.data;
        this.isPreview = true;
        this.tableConfig.isLoading = false;
        this.informationSelectList = [];
        this.informationScreen.forEach(item => {
          this.informationSelectList.push({
            label: item['equipmentModel'],
            code: item['equipmentModel'],
          });
        });
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });

  }

  /**
   * ???????????????????????????
   * @param event ???????????????
   */
  public onChangeScreen(event) {
    const model = _.cloneDeep(this.informationScreen.find(v => (v.equipmentModel === event)));
    // ??????????????????
    this.chooseScreen = {
      equipmentModel: model.equipmentModel,
      width: model.width,
      height: model.height,
    };
    this.boxStyle = {'max-width': `${model.width}px`, 'max-height': `${model.height}px`};
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
   */
  public toExamine(): void {
    this.isToExamine = true;
  }

  /**
   * ??????????????????
   */
  public onToExamineCancel(): void {
    this.isToExamine = false;
  }

  /**
   * ??????????????????
   */
  public onToExamineOk(): void {
    this.isToExamine = false;
    const examineParameter = {
      reviewedUser: this.reviewedBy,
      programId: this.rowData.programId,
      programName: this.rowData.programName,
      programType: ProgramTypeEnum.info,
    };
    this.$applicationService.addReleaseWorkProgram(examineParameter)
      .subscribe((result: ResultModel<string>) => {
        if (result.code === ResultCodeEnum.success) {
          this.refreshData();
        } else {
          this.$message.error(result.msg);
        }
      });
  }

  /**
   * ???????????? ????????????
   * @param data ????????????
   */
  public downloadFile(data: ContentListModel): void {
    this.$download.downloadFile(data.programPath, data.programFileName);
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
      notShowPrint: false,
      showSearchExport: true,
      scroll: {x: '1600px', y: '600px'},
      noIndex: true,
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        // ??????
        {
          type: 'serial-number', width: 62, title: this.language.frequentlyUsed.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        // ????????????
        {
          title: this.language.contentList.programName, key: 'programName', width: 150, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        // ??????
        {
          title: this.language.frequentlyUsed.state, key: 'programStatus', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: getProgramStatus(this.$nzI18n),
            label: 'label',
            value: 'code'
          },
        },
        // ????????????
        {
          title: this.language.contentList.programPurpose, key: 'programPurpose', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // ??????
        {
          title: this.language.contentList.duration, key: 'duration', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // ??????
        {
          title: this.language.contentList.format, key: 'mode', width: 180, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // ??????
        {
          title: this.language.contentList.fileType, key: 'programFileType', width: 180, isShowSort: true,
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
          title: this.language.contentList.resolvingPower, key: 'resolution', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // ?????????
        {
          title: this.language.contentList.applicant, key: 'applyUser', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // ?????????
        {
          title: this.language.contentList.addBy, key: 'addUserName', width: 150,
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
          title: this.language.contentList.addTime, key: 'createTime', width: 200, isShowSort: true,
          pipe: 'date',
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'}
        },
        // ?????????
        {
          title: this.language.contentList.checker, key: 'reviewedUserName', width: 150,
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
          title: this.language.contentList.auditTime, key: 'reviewedTime', width: 150, isShowSort: true,
          pipe: 'date',
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'},
        },
        // ????????????
        {
          title: this.language.contentList.programFiles, key: 'programFileName', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.programFiles,
          searchConfig: {type: 'input'}
        },
        // ??????
        {
          title: this.language.frequentlyUsed.remarks, key: 'remark', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.remarksTable,
          searchConfig: {type: 'input'},
        },
        // ??????
        {
          title: this.language.frequentlyUsed.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 180, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      topButtons: [
        {
          text: this.language.frequentlyUsed.add,
          iconClassName: 'fiLink-add-no-circle',
          permissionCode: '09-2-4-1',
          handle: () => {
            this.openContent(OperateTypeEnum.add);
          }
        },
        {
          text: this.language.frequentlyUsed.delete,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          needConfirm: true,
          canDisabled: true,
          permissionCode: '09-2-4-2',
          confirmContent: `${this.language.frequentlyUsed.confirmDelete}?`,
          handle: (data: ContentListModel[]) => {
            const programIdList = data.map(item => {
              return item.programId;
            });
            if (data.find(item => item.programStatus === getProgramStatus(this.$nzI18n, ProgramStatusEnum.underReviewed))) {
              this.$message.warning(this.language.contentList.notDelete);
              return;
            }
            this.judgeTheProgram(programIdList);
          }
        },
      ],
      moreButtons: [
        // ????????????
        // ??????
        {
          text: this.language.frequentlyUsed.enable,
          iconClassName: 'fiLink-enable',
          needConfirm: true,
          canDisabled: true,
          permissionCode: '09-2-4-3',
          confirmContent: `${this.language.frequentlyUsed.confirmEnable}?`,
          handle: (data: ContentListModel[]) => {
            // ???????????????????????????????????????????????????
            if (data.find(item =>
              item.programStatus !== getProgramStatus(this.$nzI18n, ProgramStatusEnum.reviewed)
              && item.programStatus !== getProgramStatus(this.$nzI18n, ProgramStatusEnum.disabled))) {
              this.$message.warning(this.language.contentList.canEnabled);
              return;
            }
            // ???????????? ????????????????????????
            const parameter = data.map(item => {
              return {
                programId: item.programId,
                programStatus: item.programStatus === getProgramStatus(this.$nzI18n, ProgramStatusEnum.reviewed)
                  ? ProgramStatusEnum.enabled : ProgramStatusEnum.toBeReviewed
              };
            });
            this.updateReleaseContentState(parameter);
          }
        },
        // ??????
        {
          text: this.language.frequentlyUsed.disabled,
          iconClassName: 'fiLink-disable-o',
          needConfirm: true,
          canDisabled: true,
          permissionCode: '09-2-4-4',
          confirmContent: `${this.language.frequentlyUsed.confirmDeactivation}?`,
          handle: (data: ContentListModel[]) => {
            if (data.find(item => item.programStatus !== getProgramStatus(this.$nzI18n, ProgramStatusEnum.enabled))) {
              this.$message.warning(this.language.contentList.canDisabled);
              return;
            }
            // ID?????? ????????????????????????
            const programIds = data.map(item => {
              return item.programId;
            });
            // ???????????? ????????????????????????
            const parameter = data.map(item => {
              return {
                programId: item.programId,
                programStatus: ProgramStatusEnum.disabled
              };
            });
            // ???????????????????????????
            this.checkProgramStatus(programIds).then((result: ResultModel<ContentListModel[]>) => {
              if (!result.data) {
                this.updateReleaseContentState(parameter);
              } else {
                this.$message.warning(`${this.language.contentList.theProgramIsPlaying}!`);
              }
            });
          }
        },
      ],
      operation: [
        {
          text: this.language.frequentlyUsed.edit,
          className: 'fiLink-edit',
          permissionCode: '09-2-4-5',
          key: 'isUpdate',
          handle: (data: ContentListModel) => {
            // ???????????????????????????
            this.checkProgramStatus([data.programId]).then((result: ResultModel<ContentListModel[]>) => {
              if (!result.data) {
                this.openContent(OperateTypeEnum.update, data.programId);
              } else {
                // ?????????????????????
                this.$message.warning(`${this.language.contentList.theProgramIsPlaying}!`);
              }
            });
          },
        },
        // ??????
        {
          text: this.language.contentList.preview,
          className: 'fiLink-filink-yulan-icon',
          permissionCode: '09-2-4-6',
          handle: (data: ContentListModel) => {
            this.preview(data);
          }
        },
        // ??????
        {
          text: this.language.frequentlyUsed.enable,
          className: 'fiLink-enable',
          needConfirm: true,
          permissionCode: '09-2-4-3',
          key: 'isEnable',
          confirmContent: `${this.language.frequentlyUsed.confirmEnable}?`,
          handle: (data: ContentListModel) => {
            // ???????????? ????????????????????????
            const parameter = [{
              programId: data.programId,
              programStatus: data.programStatus === getProgramStatus(this.$nzI18n, ProgramStatusEnum.reviewed)
                ? ProgramStatusEnum.enabled : ProgramStatusEnum.toBeReviewed
            }];
            this.updateReleaseContentState(parameter);
          }
        },
        // ??????
        {
          text: this.language.frequentlyUsed.disabled,
          className: 'fiLink-disable-o',
          needConfirm: true,
          permissionCode: '09-2-4-4',
          key: 'isDisabled',
          confirmContent: `${this.language.frequentlyUsed.confirmDeactivation}?`,
          handle: (data: ContentListModel) => {
            // ???????????????????????????
            this.checkProgramStatus([data.programId]).then((result: ResultModel<ContentListModel[]>) => {
              if (!result.data) {
                // ???????????? ????????????????????????
                const parameter = [{
                  programId: data.programId,
                  programStatus: ProgramStatusEnum.disabled
                }];
                this.updateReleaseContentState(parameter);
              } else {
                this.$message.warning(`${this.language.contentList.theProgramIsPlaying}!`);
              }
            });
          }
        },
        // ????????????
        {
          text: this.language.contentList.initiateAudit,
          className: 'fiLink-check',
          permissionCode: '09-2-4-7',
          key: 'isAudit',
          handle: (data: ContentListModel) => {
            this.rowData = data;
            this.getCheckUsers(data.addUser);
            this.toExamine();
          }
        },
        // ??????
        {
          text: this.language.frequentlyUsed.delete,
          className: 'fiLink-delete red-icon',
          needConfirm: true,
          permissionCode: '09-2-4-2',
          key: 'isDelete',
          // ????????????
          confirmContent: `${this.language.frequentlyUsed.confirmDelete}?`,
          handle: (data: ContentListModel) => {
            this.judgeTheProgram([data.programId]);
          }
        }
      ],
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
      handleExport: (event: ListExportModel<ContentListModel[]>) => {
        this.handelExportProgramList(event);
      },
    };
  }

  /**
   * ??????????????????
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    const programTypeIsExist = this.queryCondition.filterConditions.find(item => item.filterField === 'programType');
    if (!programTypeIsExist) {
      this.queryCondition.filterConditions.push({
        filterValue: ProgramTypeEnum.info,
        filterField: 'programType',
        operator: 'eq'
      });
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
            this.buttonShow(item);
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
   * ??????????????????????????????
   */
  public buttonShow(item: ContentListModel): void {
    // ???????????????  ??????????????????????????????
    item.isDelete = item.programStatus !== ProgramStatusEnum.underReviewed;
    // ??????????????? ????????????????????????????????? ???????????????????????????
    item.isAudit = item.programStatus === ProgramStatusEnum.toBeReviewed || item.programStatus === ProgramStatusEnum.auditFailed;
    // ??????????????? ??????????????????????????????
    item.isDisabled = item.programStatus === ProgramStatusEnum.enabled;
    // ??????????????? ??????????????????????????????????????? ?????????????????????
    item.isEnable = item.programStatus === ProgramStatusEnum.reviewed || item.programStatus === ProgramStatusEnum.disabled;
    // ???????????????  ???????????????????????????????????? ???????????????????????????
    item.isUpdate = item.programStatus === ProgramStatusEnum.toBeReviewed || item.programStatus === ProgramStatusEnum.auditFailed;
  }

  /**
   * ??????????????????
   * @param programIdList programId??????
   */
  private deleteReleaseContentList(programIdList: Array<string>): void {
    this.$applicationService.deleteReleaseContentList({programIdList: programIdList})
      .subscribe((result: ResultModel<ContentListModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          // ??????????????????
          this.queryCondition.pageCondition.pageNum = 1;
          this.refreshData();
        } else {
          this.$message.error(result.msg);
        }
      });
  }

  /**
   * ????????????????????????????????????????????????
   * @param programIdList programId??????
   */
  private judgeTheProgram(programIdList: Array<string>): void {
    // ???????????????????????????
    this.checkProgramStatus(programIdList).then((result: ResultModel<ContentListModel[]>) => {
      if (!result.data) {
        this.deleteReleaseContentList(programIdList);
      } else {
        this.$message.warning(`${this.language.contentList.theProgramIsPlaying}!`);
      }
    });
  }

  /**
   * ??????????????????
   */
  private getCheckUsers(id: string): void {
    this.$applicationService.getCheckUsers(id)
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
   * ????????????
   */
  private handelExportProgramList(event: ListExportModel<ContentListModel[]>): void {
    // ????????????
    const exportBody = new ExportRequestModel(event.columnInfoList, event.excelType);
    exportBody.columnInfoList.forEach(item => {
      if (['programStatus', 'programFileType', 'createTime', 'reviewedTime'].includes(item.propertyName)) {
        // ????????????????????????
        item.isTranslation = IS_TRANSLATION_CONST;
      }
    });
    // ?????????????????????
    if (event && !_.isEmpty(event.selectItem)) {
      const ids = event.selectItem.map(item => item.programId);
      const filter = new FilterCondition('programId', OperatorEnum.in, ids);
      exportBody.queryCondition.filterConditions.push(filter);
    } else {
      // ??????????????????
      exportBody.queryCondition.filterConditions = event.queryTerm;
    }
    const programTypeFilter = new FilterCondition('programType', OperatorEnum.eq, ProgramTypeEnum.info);
    exportBody.queryCondition.filterConditions.push(programTypeFilter);
    // ??????????????????
    this.$applicationService.exportProgramData(exportBody).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(result.msg);
      } else {
        this.$message.error(result.msg);
      }
    });
  }
}
