import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzI18nService, NzModalService, UploadFile} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {ScheduleLanguageInterface} from '../../../../../assets/i18n/schedule/schedule.language.interface';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {JobStatusEnum} from '../../share/enum/job-status.enum';
import {ListUnitSelector} from '../../../../shared-module/component/business-component/list-unit-selector/list-unit-selector';
import {UserForCommonService} from '../../../../core-module/api-service';
import {Router} from '@angular/router';
import {ListExportModel} from '../../../../core-module/model/list-export.model';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {PersonInfoModel} from '../../share/model/person-info.model';
import {Download} from '../../../../shared-module/util/download';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ScheduleApiService} from '../../share/service/schedule-api.service';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {DOWNLOAD_URL} from '../../share/const/schedule.const';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {ImportMissionService} from '../../../../core-module/mission/import.mission.service';
import {ScheduleForCommonUtil} from '../../../../core-module/business-util/schedule/schedule-for-common.util';

/**
 * 人员信息列表页面
 */
@Component({
  selector: 'app-person-information',
  templateUrl: './person-information.component.html',
  styleUrls: ['./person-information.component.scss']
})
export class PersonInformationComponent extends ListUnitSelector implements OnInit {
  // 导入
  @ViewChild('importTemp') private importTemp: TemplateRef<any>;
  // 在职状态模板
  @ViewChild('jobStatusTemp') private jobStatusTemp: TemplateRef<any>;
  // 责任单位选择模板
  @ViewChild('unitNameSearch') unitNameSearch: TemplateRef<any>;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 国际化
  public scheduleLanguage: ScheduleLanguageInterface;
  // 列表数据
  public dataSet: PersonInfoModel[] = [];
  // 列表分页
  public pageBean: PageModel = new PageModel();
  // 列表配置
  public tableConfig: TableConfigModel = new TableConfigModel();
  // 列表查询参数
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 在职状态枚举
  public jobStatusEnum = JobStatusEnum;
  // 上传的文件序列
  public fileList: UploadFile[] = [];
  // 上传的文件序列
  private fileArray = [];
  // 上传的文件类型
  private fileType: string;

  constructor(public $nzModalService: NzModalService,
              public $userForCommonService: UserForCommonService,
              public $nzI18n: NzI18nService,
              public $scheduleService: ScheduleApiService,
              public $message: FiLinkModalService,
              private $download: Download,
              private $refresh: ImportMissionService,
              private $modalService: NzModalService,
              private $router: Router) {
    super($userForCommonService, $nzI18n, $message);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 初始国际化
    this.scheduleLanguage = this.$nzI18n.getLocaleData(LanguageEnum.schedule);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // 初始化表格配置
    this.initTableConfig();
    this.initTreeSelectorConfig();
    this.queryPersonList();
    // 导入服务 监听数据变化 用于列表刷新使用
    this.$refresh.refreshChangeHook.subscribe(() => {
      this.queryPersonList();
    });
  }

  /**
   * 分页
   * @param event PageModel
   */
  public personPageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.queryPersonList();
  }

  /**
   * 上传文件
   */
  public beforeUpload = (file: UploadFile): boolean => {
    this.fileArray = this.fileArray.concat(file);
    if (this.fileArray.length > 1) {
      this.fileArray.splice(0, 1);
    }
    this.fileList = this.fileArray;
    const fileName = this.fileList[0].name;
    const index = fileName.lastIndexOf('\.');
    this.fileType = fileName.substring(index + 1, fileName.length);
    return false;
  }

  /**
   * 在职状态操作 修改状态且若修改为离职 则离职时间修改为当前时间 人员离职后当前关联用户禁用
   */
  public clickSwitch(data: PersonInfoModel): void {
    let statusValue;
    this.dataSet.forEach(item => {
      if (item.id === data.id) {
        item.clicked = true;
      }
    });
    statusValue = data.onJobStatus === JobStatusEnum.work ? JobStatusEnum.resign : JobStatusEnum.work;
    this.$scheduleService.updateJobStatus({onJobStatus: statusValue, id: data.id}).subscribe((res: ResultModel<boolean>) => {
      if (res.code === ResultCodeEnum.success) {
        if (res.data) {
          this.dataSet.forEach(item => {
            item.clicked = false;
            if (item.id === data.id) {
              item.onJobStatus = statusValue;
              item.leaveTime = item.onJobStatus === JobStatusEnum.resign ? new Date().getTime(): null;
            }
          });
        }
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 查询人员信息列表数据
   */
  private queryPersonList(): void {
    this.tableConfig.isLoading = true;
    this.$scheduleService.queryPersonInformation(this.queryCondition).subscribe((res: ResultModel<any>) => {
      this.tableConfig.isLoading = false;
      if (res.code === ResultCodeEnum.success) {
        this.dataSet = res.data || [];
        this.pageBean.Total = res.totalCount;
        this.pageBean.pageIndex = res.pageNum;
        this.pageBean.pageSize = res.size;
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 初始化表格配置
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSizeChanger: true,
      showSearchSwitch: true,
      showPagination: true,
      notShowPrint: false,
      scroll: {x: '1200px', y: '600px'},
      noIndex: true,
      showSearchExport: true,
      primaryKey: '18-1',
      columnConfig: [
        // 选择
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0'}}, width: 60},
        // 序号
        {
          type: 'serial-number', width: 60, title: this.commonLanguage.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '60px'}}
        },
        // 姓名
        {
          title: this.scheduleLanguage.userName, key: 'personName', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          searchConfig: {type: 'input'}
        },
        // 工号
        {
          title: this.scheduleLanguage.jobNumber, key: 'jobNumber', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          searchConfig: {type: 'input'}
        },
        // 单位
        {
          title: this.scheduleLanguage.unit, key: 'deptName', width: 200, configurable: true,
          searchKey: 'deptCodeList',
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'render', renderTemplate: this.unitNameSearch}
        },
        // 手机号
        {
          title: this.scheduleLanguage.phoneNumber, key: 'phoneNumber', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          searchConfig: {type: 'input'}
        },
        // 关联用户
        {
          title: this.scheduleLanguage.associatedUsers, key: 'userName', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          searchKey: 'associatedUserName',
          searchConfig: {type: 'input'}
        },
        {
          // 岗位
          title: this.scheduleLanguage.workPosition, key: 'workPosition', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          searchConfig: {type: 'input'}
        },
        // 在职状态
        {
          title: this.scheduleLanguage.jobStatus, key: 'onJobStatus', width: 120, isShowSort: true,
          searchable: true, configurable: true,
          type: 'render',
          minWidth: 80,
          renderTemplate: this.jobStatusTemp,
          searchConfig: {
            type: 'select',
            selectInfo: [
              {label: this.scheduleLanguage.work, value: JobStatusEnum.work},
              {label: this.scheduleLanguage.resign, value: JobStatusEnum.resign}
            ]
          }
        },
        // 入职日期
        {
          title: this.scheduleLanguage.entryTime, key: 'entryTime', width: 180, isShowSort: true,
          searchable: true,
          configurable: true,
          pipe: 'date',
          pipeParam: 'yyyy-MM-dd',
          searchConfig: {type: 'dateRang', notShowTime: true}
        },
        // 离职日期
        {
          title: this.scheduleLanguage.leaveTime, key: 'leaveTime', width: 180, isShowSort: true,
          searchable: true,
          configurable: true,
          pipe: 'date',
          pipeParam: 'yyyy-MM-dd',
          searchConfig: {type: 'dateRang', notShowTime: true}
        },
        // 备注
        {
          title: this.scheduleLanguage.remark, key: 'remark', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          searchConfig: {type: 'input'}
        },
        { // 操作列
          title: this.commonLanguage.operate,
          searchable: true,
          searchConfig: {type: 'operate'},
          key: '', width: 180,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      bordered: false,
      showSearch: false,
      topButtons: [
        {
          // 新增
          text: this.scheduleLanguage.add,
          iconClassName: 'fiLink-add-no-circle',
          permissionCode: '17-1-2',
          handle: () => {
            this.$router.navigate(['/business/schedule/person-detail/add']).then();
          }
        },
        {
          // 批量删除
          text: this.commonLanguage.deleteBtn,
          btnType: 'danger',
          needConfirm: true,
          canDisabled: true,
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          permissionCode: '17-1-4',
          handle: (data: PersonInfoModel[]) => {
            this.handleDeletePerson(data);
          }
        }
      ],
      operation: [
        {
          // 编辑
          text: this.commonLanguage.edit,
          className: 'fiLink-edit',
          permissionCode: '17-1-3',
          handle: (data: PersonInfoModel) => {
            this.$router.navigate(['/business/schedule/person-detail/update'],
              {queryParams: {personId: data.id}}).then();
          },
        },
        {
          // 关联用户
          text: this.scheduleLanguage.associatedUsers,
          className: 'fiLink-associate-user',
          permissionCode: '17-1-3',
          handle: (data: PersonInfoModel) => {
            this.$router.navigate(['/business/schedule/associate-user'],
              {queryParams: {personId: data.id}}).then();
          }
        },
        {
          // 单个删除
          text: this.commonLanguage.deleteBtn,
          className: 'fiLink-delete red-icon',
          btnType: 'danger',
          iconClassName: 'fiLink-delete',
          needConfirm: true,
          canDisabled: true,
          permissionCode: '17-1-4',
          handle: (data: PersonInfoModel) => {
            this.handleDeletePerson([data]);
          }
        },
      ],
      rightTopButtons: [
        // 导入
        {
          text: this.commonLanguage.import,
          iconClassName: 'fiLink-import',
          permissionCode: '17-1-6',
          handle: () => {
            const modal = this.$nzModalService.create({
              nzTitle: this.commonLanguage.selectImport,
              nzClassName: 'custom-create-modal',
              nzContent: this.importTemp,
              nzOkType: 'danger',
              nzFooter: [
                {
                  label: this.commonLanguage.confirm,
                  onClick: () => {
                    this.handleImport();
                    modal.destroy();
                  }
                },
                {
                  label: this.commonLanguage.cancel,
                  type: 'danger',
                  onClick: () => {
                    this.fileList = [];
                    this.fileArray = [];
                    this.fileType = null;
                    modal.destroy();
                  }
                },
              ]
            });
          }
        },
        // 导入模板下载
        {
          text: this.commonLanguage.downloadTemplate, iconClassName: 'fiLink-download-file',
          permissionCode: '17-1-7',
          handle: () => {
            this.$download.downloadFile(DOWNLOAD_URL.downloadTemplate, 'personInformationTemplate.xlsx');
          },
        }
      ],
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.queryPersonList();
      },
      // 搜索
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        // 对选择的入职日期和离职日期数据做处理
        ScheduleForCommonUtil.handleRangeTimeFormat(event, ['entryTime', 'leaveTime']);
        // 没有值的时候重置已选数据
        if (!event.length) {
          this.selectUnitName = '';
          FacilityForCommonUtil.setTreeNodesStatus(this.treeNodes || [], []);
        }
        this.queryPersonList();
      },
      // 导出
      handleExport: (event: ListExportModel<PersonInfoModel[]>) => {
        this.handleExportPerson(event);
      },
    };
  }

  /**
   * 导入文件
   */
  private handleImport(): void {
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
      formData.append('file', file);
    });
    if (this.fileList.length === 1) {
      if (this.fileType === 'xls' || this.fileType === 'xlsx') {
        this.$scheduleService.importPersonInfo(formData).subscribe((result: ResultModel<string>) => {
          this.fileType = null;
          this.fileList = [];
          if (result.code === ResultCodeEnum.success) {
            this.$message.success(this.commonLanguage.importTask);
            this.fileArray = [];
          } else {
            this.$message.error(result.msg);
          }
        });
      } else {
        this.$message.info(this.commonLanguage.fileTypeTips);
      }
    } else {
      this.$message.info(this.commonLanguage.selectFileTips);
    }
  }

  /**
   * 删除人员
   */
  private handleDeletePerson(data: PersonInfoModel[]): void {
    this.tableConfig.isLoading = true;
    const personIds = data.map(item => item.id);
    this.$scheduleService.deletePersonData(personIds).subscribe((res: ResultModel<string>) => {
      this.tableConfig.isLoading = false;
      if (res.code === ResultCodeEnum.success) {
        this.$message.success(this.scheduleLanguage.deletePersonSuccess);
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryPersonList();
      } else if (res.code === ResultCodeEnum.noDeleteWork) {
        // 在职状态的人员不能删除
        this.$message.warning(this.scheduleLanguage.notDeleteWork);
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 导出数据
   */
  private handleExportPerson(event: ListExportModel<PersonInfoModel[]>): void {
    // 处理参数
    const exportBody = new ExportRequestModel(event.columnInfoList, event.excelType);
    // 处理传给后台的字段名
    exportBody.columnInfoList.forEach(item => {
      if (item.propertyName === 'entryTime') {
        item.propertyName = 'entryTimeStr';
      }
      if (item.propertyName === 'leaveTime') {
        item.propertyName = 'leaveTimeStr';
      }
    });
    // 处理选择的数据
    if (event && !_.isEmpty(event.selectItem)) {
      const ids = event.selectItem.map(item => item.id);
      const filter = new FilterCondition('personIdList', OperatorEnum.in, ids);
      exportBody.queryCondition.filterConditions.push(filter);
    } else {
      // 处理查询条件
      exportBody.queryCondition.filterConditions = event.queryTerm;
    }
    this.$scheduleService.exportPersonInfo(exportBody).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        this.$message.success(this.scheduleLanguage.exportPersonSuccess);
      } else {
        this.$message.error(res.msg);
      }
    });
  }
}
