import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {ApplicationInterface} from '../../../../../assets/i18n/application/application.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {ProgramListModel} from '../../share/model/policy.control.model';
import {ApplicationService} from '../../share/service/application.service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {OnlineLanguageInterface} from '../../../../../assets/i18n/online/online-language.interface';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';


import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {ProgramStatusEnum, ProgramTypeEnum} from '../../share/enum/program.enum';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
@Component({
  selector: 'app-broadcast-select-program',
  templateUrl: './select-broadcast-program.component.html',
  styleUrls: ['./select-broadcast-program.component.scss']
})
export class SelectBroadcastProgramComponent implements OnInit {
  @Input()
  public isVisible: boolean = false;
  // 设备列表多语言
  public languageTable: ApplicationInterface;
  public commonLanguage: CommonLanguageInterface;
  @Input()
  selectedProgram: { id: '', name: '' , duration: ''};
  // 显示隐藏变化
  @Output() isVisibleChange = new EventEmitter<any>();
  @Output() selectChange = new EventEmitter<any>();
  // 节目列表单选
  @ViewChild('radioProgramTemp') radioProgramTemp: TemplateRef<any>;
  programData = [];
  // 节目分页
  public programPageBean: PageModel = new PageModel();
  // 多语言配置
  public language: OnlineLanguageInterface;
  // 表格查询条件
  public programQueryCondition: QueryConditionModel = new QueryConditionModel();
  // 节目表格配置
  public tableProgram: TableConfigModel;

  constructor(public $nzI18n: NzI18nService, public $applicationService: ApplicationService, private $message: FiLinkModalService) {
    // 多语言
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.online);
  }

  ngOnInit() {
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.initTableProgram();
    this.getProgramData();
  }

  nzVisibleChange(event: boolean) {
    this.isVisible = event;
    this.isVisibleChange.emit(this.isVisible);
  }

  /**
   *选中节目提交
   */
  public handleProgramOk(): void {
    this.selectChange.emit(this.selectedProgram);
    this.handleCancel();
  }

  /**
   * 选择节目
   * @ param event
   * @ param data
   */
  public selectedProgramChange(event: string, data): void {
    this.selectedProgram.id = data.programId;
    this.selectedProgram.name = data.programName;
    this.selectedProgram.duration = data.duration.substring(0, data.duration.indexOf('秒'));
  }


  /**
   * 节目分页
   * @ param event
   */
  public programPageChange(event: PageModel): void {
    this.programQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.programQueryCondition.pageCondition.pageSize = event.pageSize;
    this.getProgramData();
  }

  handleCancel() {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }

  /**
   * 节目列表
   */
  public getProgramData(): void {
    this.tableProgram.isLoading = true;
    const hasProgramStatusFilter = this.programQueryCondition.filterConditions.some(item => item.filterField === 'programStatus ');
    if (!hasProgramStatusFilter) {
      this.programQueryCondition.filterConditions.push(new FilterCondition('programStatus', OperatorEnum.eq, ProgramStatusEnum.enabled));
    }
    const hasProgramTypeFilter = this.programQueryCondition.filterConditions.some(item => item.filterField === 'programType ');
    if (!hasProgramTypeFilter) {
      this.programQueryCondition.filterConditions.push(new FilterCondition('programType', OperatorEnum.eq, ProgramTypeEnum.broadcast));
    }
    // 根据表格条件查询获取节目列表
    this.$applicationService.getReleaseContentList(this.programQueryCondition).subscribe((res: ResultModel<ProgramListModel[]>) => {
      this.tableProgram.isLoading = false;
      if (res.code === ResultCodeEnum.success) {
        const {data, totalCount, pageNum, size} = res;
        this.programData = data || [];
        this.programPageBean.Total = totalCount;
        this.programPageBean.pageIndex = pageNum;
        this.programPageBean.pageSize = size;
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.tableProgram.isLoading = false;
    });
  }

  /**
   * 节目表格配置
   */
  public initTableProgram(): void {
    this.tableProgram = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1600px', y: '600px'},
      noIndex: true,
      notShowPrint: true,
      columnConfig: [
        {
          title: '',
          type: 'render',
          key: 'selectedProgramId',
          renderTemplate: this.radioProgramTemp,
          fixedStyle: {fixedLeft: true, style: {left: '0px'}},
          width: 42
        },
        // 序号
        {
          type: 'serial-number', width: 62, title: this.commonLanguage.serialNumber
        },
        // 节目名称
        {
          title: this.languageTable.strategyList.programName, key: 'programName', width: 200, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // 节目用途
        {
          title: this.languageTable.strategyList.programPurpose, key: 'programPurpose', width: 200, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // 时长
        {
          title: this.languageTable.strategyList.duration, key: 'duration', width: 100, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // 格式
        {
          title: this.languageTable.strategyList.mode, key: 'mode', width: 100, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // 分辨率
        // {
        //   title: this.languageTable.strategyList.resolution, key: 'resolution', width: 100, isShowSort: true,
        //   searchable: true,
        //   searchConfig: {type: 'input'}
        // },
        // 节目文件
        {
          title: this.languageTable.strategyList.programFileName, key: 'programFileName', width: 200, isShowSort: true,
          searchable: true,
          // type: 'render',
          // renderTemplate: this.programFileName,
          searchConfig: {type: 'input'},
        },
        {
          title: this.language.operate,
          searchConfig: {type: 'operate'},
          searchable: true,
          key: '',
          width: 100,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      topButtons: [],
      operation: [],
      leftBottomButtons: [],
      // 排序
      sort: (event: SortCondition) => {
        this.programQueryCondition.sortCondition.sortField = event.sortField;
        this.programQueryCondition.sortCondition.sortRule = event.sortRule;
        this.getProgramData();
      },
      // 搜索
      handleSearch: (event: FilterCondition[]) => {
        this.programQueryCondition.pageCondition.pageNum = 1;
        this.programQueryCondition.filterConditions = event;
        this.getProgramData();
      }
    };
  }
}
