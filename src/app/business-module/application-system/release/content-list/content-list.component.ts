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
 * 内容列表页面
 */
@Component({
  selector: 'app-content-list',
  templateUrl: './content-list.component.html',
  styleUrls: ['./content-list.component.scss']
})
export class ContentListComponent implements OnInit, OnDestroy {
  /**
   * 节目文件自定义表单
   */
  @ViewChild('programFiles') programFiles: TemplateRef<any>;
  /**
   * 备注显示多行问题
   */
  @ViewChild('remarksTable') remarksTable: TemplateRef<any>;
  /**
   * 责任人自定义
   */
  @ViewChild('roleTemp') roleTemp: TemplateRef<any>;
  /**
   * 列表数据
   */
  public dataSet: ContentListModel[] = [];
  /**
   * 分页初始设置
   */
  public pageBean: PageModel = new PageModel();
  /**
   * 列表配置
   */
  public tableConfig: TableConfigModel;
  /**
   * 国际化
   */
  public language: ApplicationInterface;
  /**
   * 是否是视屏
   */
  public isVideo: boolean = true;
  /**
   * 预览模态框
   */
  public isPreview: boolean = false;
  /**
   * 发起审核模态框
   */
  public isToExamine: boolean = false;
  /**
   * 文件路径
   */
  public filePath: string = '';
  /**
   * 审核人绑定值
   */
  public reviewedBy: string;
  public boxStyle ;
  /**
   * 审核人列表
   */
  public reviewedByArr: CheckUserModel[] = [];
  // 信息屏型号尺寸信息
  public informationScreen: InformationScreenModalModel[] = [];
  // 信息屏选择下拉框
  public informationSelectList = [];
  // 所选信息屏
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
   * 审核人搜索列表
   */
  private reviewedSearchList: RoleUnitModel[] = [];
  /**
   * 单行数据
   */
  private rowData: ContentListModel;
  /**
   * 列表查询参数
   */
  private queryCondition: QueryConditionModel = new QueryConditionModel();

  /**
   * @param $nzI18n  国际化服务
   * @param $router  路由跳转服务
   * @param $message  信息提示服务
   * @param $userService  操作用户后台接口服务
   * @param $applicationService  应用系统后台接口服务
   * @param $download  文件下载
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
   * 页面销毁
   */
  public ngOnDestroy(): void {
    this.programFiles = null;
    this.remarksTable = null;
    this.roleTemp = null;
  }

  /**
   * 分页事件
   * @param event 分页对象
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 跳转到新增/编辑页面
   * @param jumpType 跳转类型
   * @param programId 节目ID
   */
  public openContent(jumpType: string, programId?: string): void {
    this.$router.navigate([`business/application/release/content-list/${jumpType}`], {
      queryParams: {programId: programId}
    }).then();
  }

  /**
   * 查询节目状态
   * @param programIdList programId集合
   */
  public checkProgramStatus(programIdList: Array<string>) {
    return this.$applicationService.programStatus(programIdList).toPromise();
  }

  /**
   * 更新列表状态
   * @param parameter 参数（启用禁用）
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
   * 预览
   * @param data 内容信息
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
      // 图片
      this.queryScreen();
    } else {
      this.isPreview = true;
    }
    // 将'\'换成'/'
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
   * 信息屏型号选择事件
   * @param event 所选信息屏
   */
  public onChangeScreen(event) {
    const model = _.cloneDeep(this.informationScreen.find(v => (v.equipmentModel === event)));
    // 放大缩小比例
    this.chooseScreen = {
      equipmentModel: model.equipmentModel,
      width: model.width,
      height: model.height,
    };
    this.boxStyle = {'max-width': `${model.width}px`, 'max-height': `${model.height}px`};
  }
  /**
   * 取消预览
   */
  public onPreviewCancel(): void {
    this.isPreview = false;
    // 预览路径置空
    this.filePath = '';
  }

  /**
   * 预览确定
   */
  public onPreviewOk(): void {
    this.isPreview = false;
    // 预览路径置空
    this.filePath = '';
  }

  /**
   * 发起审核
   */
  public toExamine(): void {
    this.isToExamine = true;
  }

  /**
   * 取消发起审核
   */
  public onToExamineCancel(): void {
    this.isToExamine = false;
  }

  /**
   * 发起审核确定
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
   * 文件下载 节目文件
   * @param data 节目数据
   */
  public downloadFile(data: ContentListModel): void {
    this.$download.downloadFile(data.programPath, data.programFileName);
  }

  /**
   * 初始化表格配置
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
        // 序号
        {
          type: 'serial-number', width: 62, title: this.language.frequentlyUsed.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        // 节目名称
        {
          title: this.language.contentList.programName, key: 'programName', width: 150, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        // 状态
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
        // 节目用途
        {
          title: this.language.contentList.programPurpose, key: 'programPurpose', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // 时长
        {
          title: this.language.contentList.duration, key: 'duration', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // 格式
        {
          title: this.language.contentList.format, key: 'mode', width: 180, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // 类型
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
        // 分辨率
        {
          title: this.language.contentList.resolvingPower, key: 'resolution', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // 申请人
        {
          title: this.language.contentList.applicant, key: 'applyUser', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // 添加人
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
        // 添加时间
        {
          title: this.language.contentList.addTime, key: 'createTime', width: 200, isShowSort: true,
          pipe: 'date',
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'}
        },
        // 审核人
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
        // 审核时间
        {
          title: this.language.contentList.auditTime, key: 'reviewedTime', width: 150, isShowSort: true,
          pipe: 'date',
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'},
        },
        // 节目文件
        {
          title: this.language.contentList.programFiles, key: 'programFileName', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.programFiles,
          searchConfig: {type: 'input'}
        },
        // 备注
        {
          title: this.language.frequentlyUsed.remarks, key: 'remark', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.remarksTable,
          searchConfig: {type: 'input'},
        },
        // 操作
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
        // 更多操作
        // 启用
        {
          text: this.language.frequentlyUsed.enable,
          iconClassName: 'fiLink-enable',
          needConfirm: true,
          canDisabled: true,
          permissionCode: '09-2-4-3',
          confirmContent: `${this.language.frequentlyUsed.confirmEnable}?`,
          handle: (data: ContentListModel[]) => {
            // 只有已审核或已禁用的节目才可以启用
            if (data.find(item =>
              item.programStatus !== getProgramStatus(this.$nzI18n, ProgramStatusEnum.reviewed)
              && item.programStatus !== getProgramStatus(this.$nzI18n, ProgramStatusEnum.disabled))) {
              this.$message.warning(this.language.contentList.canEnabled);
              return;
            }
            // 参数数组 用于启用禁用功能
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
        // 禁用
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
            // ID列表 用于判断节目播放
            const programIds = data.map(item => {
              return item.programId;
            });
            // 参数数组 用于启用禁用功能
            const parameter = data.map(item => {
              return {
                programId: item.programId,
                programStatus: ProgramStatusEnum.disabled
              };
            });
            // 判断节目是否在播放
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
            // 判断节目是否在播放
            this.checkProgramStatus([data.programId]).then((result: ResultModel<ContentListModel[]>) => {
              if (!result.data) {
                this.openContent(OperateTypeEnum.update, data.programId);
              } else {
                // 节目正在播放中
                this.$message.warning(`${this.language.contentList.theProgramIsPlaying}!`);
              }
            });
          },
        },
        // 预览
        {
          text: this.language.contentList.preview,
          className: 'fiLink-filink-yulan-icon',
          permissionCode: '09-2-4-6',
          handle: (data: ContentListModel) => {
            this.preview(data);
          }
        },
        // 启用
        {
          text: this.language.frequentlyUsed.enable,
          className: 'fiLink-enable',
          needConfirm: true,
          permissionCode: '09-2-4-3',
          key: 'isEnable',
          confirmContent: `${this.language.frequentlyUsed.confirmEnable}?`,
          handle: (data: ContentListModel) => {
            // 参数数组 用于启用禁用功能
            const parameter = [{
              programId: data.programId,
              programStatus: data.programStatus === getProgramStatus(this.$nzI18n, ProgramStatusEnum.reviewed)
                ? ProgramStatusEnum.enabled : ProgramStatusEnum.toBeReviewed
            }];
            this.updateReleaseContentState(parameter);
          }
        },
        // 禁用
        {
          text: this.language.frequentlyUsed.disabled,
          className: 'fiLink-disable-o',
          needConfirm: true,
          permissionCode: '09-2-4-4',
          key: 'isDisabled',
          confirmContent: `${this.language.frequentlyUsed.confirmDeactivation}?`,
          handle: (data: ContentListModel) => {
            // 判断节目是否在播放
            this.checkProgramStatus([data.programId]).then((result: ResultModel<ContentListModel[]>) => {
              if (!result.data) {
                // 参数数组 用于启用禁用功能
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
        // 发起审核
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
        // 删除
        {
          text: this.language.frequentlyUsed.delete,
          className: 'fiLink-delete red-icon',
          needConfirm: true,
          permissionCode: '09-2-4-2',
          key: 'isDelete',
          // 确认删除
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
      //  导出数据
      handleExport: (event: ListExportModel<ContentListModel[]>) => {
        this.handelExportProgramList(event);
      },
    };
  }

  /**
   * 刷新表格数据
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
   * 按钮是否展示逻辑处理
   */
  public buttonShow(item: ContentListModel): void {
    // 是否能删除  审核中的节目没有删除
    item.isDelete = item.programStatus !== ProgramStatusEnum.underReviewed;
    // 是否能审核 发起审核的前提是待审核 或者是审核不通过的
    item.isAudit = item.programStatus === ProgramStatusEnum.toBeReviewed || item.programStatus === ProgramStatusEnum.auditFailed;
    // 是否能禁用 禁用必须的前提是启用
    item.isDisabled = item.programStatus === ProgramStatusEnum.enabled;
    // 是否能启用 启用的前提，必须是审核通过 或者是被禁用的
    item.isEnable = item.programStatus === ProgramStatusEnum.reviewed || item.programStatus === ProgramStatusEnum.disabled;
    // 是否能编辑  编辑的前提，必须是待审核 或者是审核不通过的
    item.isUpdate = item.programStatus === ProgramStatusEnum.toBeReviewed || item.programStatus === ProgramStatusEnum.auditFailed;
  }

  /**
   * 删除列表内容
   * @param programIdList programId集合
   */
  private deleteReleaseContentList(programIdList: Array<string>): void {
    this.$applicationService.deleteReleaseContentList({programIdList: programIdList})
      .subscribe((result: ResultModel<ContentListModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          // 删除跳第一页
          this.queryCondition.pageCondition.pageNum = 1;
          this.refreshData();
        } else {
          this.$message.error(result.msg);
        }
      });
  }

  /**
   * 删除列表内容之前判断节目是否播放
   * @param programIdList programId集合
   */
  private judgeTheProgram(programIdList: Array<string>): void {
    // 判断节目是否在播放
    this.checkProgramStatus(programIdList).then((result: ResultModel<ContentListModel[]>) => {
      if (!result.data) {
        this.deleteReleaseContentList(programIdList);
      } else {
        this.$message.warning(`${this.language.contentList.theProgramIsPlaying}!`);
      }
    });
  }

  /**
   * 用户列表查询
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
   * 导出数据
   */
  private handelExportProgramList(event: ListExportModel<ContentListModel[]>): void {
    // 处理参数
    const exportBody = new ExportRequestModel(event.columnInfoList, event.excelType);
    exportBody.columnInfoList.forEach(item => {
      if (['programStatus', 'programFileType', 'createTime', 'reviewedTime'].includes(item.propertyName)) {
        // 后台处理字段标示
        item.isTranslation = IS_TRANSLATION_CONST;
      }
    });
    // 处理选择的数据
    if (event && !_.isEmpty(event.selectItem)) {
      const ids = event.selectItem.map(item => item.programId);
      const filter = new FilterCondition('programId', OperatorEnum.in, ids);
      exportBody.queryCondition.filterConditions.push(filter);
    } else {
      // 处理查询条件
      exportBody.queryCondition.filterConditions = event.queryTerm;
    }
    const programTypeFilter = new FilterCondition('programType', OperatorEnum.eq, ProgramTypeEnum.info);
    exportBody.queryCondition.filterConditions.push(programTypeFilter);
    // 调用后台接口
    this.$applicationService.exportProgramData(exportBody).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(result.msg);
      } else {
        this.$message.error(result.msg);
      }
    });
  }
}
