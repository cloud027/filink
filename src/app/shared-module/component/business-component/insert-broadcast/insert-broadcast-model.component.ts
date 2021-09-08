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
  // 弹框是否开启
  @Input()
  set xcVisible(params) {
    this.isXcVisible = params;
    this.xcVisibleChange.emit(this.isXcVisible);
  }
  // 弹框是否开启
  get xcVisible() {
    return this.isXcVisible;
  }
  // 弹框是否开启触发事件
  @Output() xcVisibleChange = new EventEmitter<boolean>();
  // 弹框标题
  @Input() title: string;
  // 滑块默认值
  @Input() public insertVolumeValue: number;
  @Input() public equipmentList;
  // 区分设备了列表0、分组列表1
  @Input() public insertType;
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
  @ViewChild('contentTemp') contentTemp: TableComponent;
  // 弹框是否开启
  public isXcVisible: boolean = false;
  // 滑块值的常量
  public sliderValue = SliderValueConst;
  // 滑块最大值
  public volumeMax: number = SliderValueConst.volumeMax;
  // 设备列表多语言
  public languageTable: ApplicationInterface;
// 分组数据集
  public dataSet: ContentListModel[] = [];
  // 分页参数
  public pageBean: PageModel = new PageModel(PageSizeEnum.sizeFive);
  /**
   * 列表查询参数
   */
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // 列表参数
  public tableConfig: TableConfigModel = new TableConfigModel();
  /**
   * 预览模态框
   */
  public isPreview: boolean = false;
 /**
   * 播放按钮
   */
  public playTime: number = 0;
  public volumeValue: number = 0;
  /**
   * 文件路径
   */
  public filePath: string = '';
  /**
   * 插播名称
   */
  public playCutInName: string = '';
  /**
   * 审核人搜索列表
   */
  private reviewedSearchList: RoleUnitModel[] = [];
  /**
   * 审核人绑定值
   */
  public reviewedBy: string;
  /**
   * 审核人列表
   */
  public reviewedByArr: CheckUserModel[] = [];
  private programList = [];
  constructor(
    // 路由
    public $router: Router,
    // 多语言配置
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $applicationService: ApplicationService,
  ) {
    // 表格多语言配置
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
   * 刷新表格数据
   */
  private refreshData(): void {
    // 接口有问题
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
   * 初始化表格配置
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
        // 序号
        {
          type: 'serial-number', width: 62, title: this.languageTable.frequentlyUsed.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        // 节目名称
        {
          title: this.languageTable.contentList.programName, key: 'programName', width: 150, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        // 状态
        {
          title: this.languageTable.frequentlyUsed.state, key: 'programStatus', width: 150, isShowSort: true,
          configurable: true,
          searchable: false,
        },
        // 节目用途
        {
          title: this.languageTable.contentList.programPurpose, key: 'programPurpose', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // 时长
        {
          title: this.languageTable.contentList.duration, key: 'duration', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // 格式
        {
          title: this.languageTable.contentList.format, key: 'mode', width: 180, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // 类型
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
        // 申请人
        {
          title: this.languageTable.contentList.applicant, key: 'applyUser', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // 添加人
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
        // 添加时间
        {
          title: this.languageTable.contentList.addTime, key: 'createTime', width: 200, isShowSort: true,
          pipe: 'date',
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'}
        },
        // 审核人
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
        // 审核时间
        {
          title: this.languageTable.contentList.auditTime, key: 'reviewedTime', width: 150, isShowSort: true,
          pipe: 'date',
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'},
        },
        // 节目文件
        {
          title: this.languageTable.contentList.programFiles, key: 'programFileName', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.programFiles,
          searchConfig: {type: 'input'}
        },
        // 备注
        {
          title: this.languageTable.frequentlyUsed.remarks, key: 'remark', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.remarksTable,
          searchConfig: {type: 'input'},
        },
        // 操作
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
        // 预览
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
      //  导出数据
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
   * 用户列表查询
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
   * 预览
   * @param data 内容信息
   */
  public preview(data: ContentListModel): void {
    this.isPreview = true;
    // 将'\'换成'/'
    this.filePath = data.programPath.replace(/\\/g, '/');
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
   * 分页事件
   * @param event 分页对象
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
   * 指令接口
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
