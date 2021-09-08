import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {TableConfigModel} from '../../../model/table-config.model';
import {PageModel} from '../../../model/page.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../model/query-condition.model';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {PlanProjectLanguageInterface} from '../../../../../assets/i18n/plan-project/plan-project.language.interface';
import {ProjectStatusEnum} from '../../../../core-module/enum/plan-project/project-status.enum';
import {LanguageEnum} from '../../../enum/language.enum';
import {NzI18nService} from 'ng-zorro-antd';
import {ResultCodeEnum} from '../../../enum/result-code.enum';
import {ProjectStatusIconEnum} from '../../../../core-module/enum/plan-project/project-status-icon.enum';
import {TableComponent} from '../../table/table.component';
import {PlanProjectForCommonService} from '../../../../core-module/api-service/plan-project/plan-project-for-common.service';
import {CommonUtil} from '../../../util/common-util';

/**
 * 项目选择器
 */
@Component({
  selector: 'app-select-project',
  templateUrl: './select-project.component.html',
  styleUrls: ['./select-project.component.scss']
})
export class SelectProjectComponent implements OnInit {
  // 所选数据
  @Input() selectList: any[] = [];
  // 多选或单选
  @Input() multiple: boolean = true;
  // 显示隐藏
  @Input() public isVisible: boolean = false;
  // 是否显示清空按钮
  @Input() public showCleanBtn: boolean = false;
  // 选中的值变化
  @Output() selectDataChange = new EventEmitter<any>();
  // 显示隐藏变化
  @Output() isVisibleChange = new EventEmitter<boolean>();
  // 项目列表
  @ViewChild('projectListTable') public projectListTable: TableComponent;
  // 项目列表设施状态模板
  @ViewChild('projectStatusTemp') projectStatusTemp: TemplateRef<HTMLDocument>;
  // 单选按钮
  @ViewChild('radioTemp') radioTemp: TemplateRef<HTMLDocument>;
  // 项目列表配置
  public tableConfig: TableConfigModel;
  // 项目列表分页
  public pageBean: PageModel = new PageModel();
  // 项目列表查询条件
  public projectQueryCondition = new QueryConditionModel();
  // 项目列表数据
  public dataSet: any[] = [];
  // 公共语言包国际化
  public commonLanguage: CommonLanguageInterface;
  // 项目列表语言包
  public projectLanguage: PlanProjectLanguageInterface;
  // 项目状态枚举
  public projectStatusEnum = ProjectStatusEnum;
  // 国际化枚举
  public languageEnum = LanguageEnum;
  public projectId: string;
// 已选数据
  public selectedData = [];
  constructor(
    public $nzI18n: NzI18nService,
    public $planProjectForCommonService: PlanProjectForCommonService,
  ) {
  }

  ngOnInit() {
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.projectLanguage = this.$nzI18n.getLocaleData(LanguageEnum.planProject);
    this.initTableConfig();
    // 单选回显
    if (!this.multiple && this.selectList.length === 1) {
      this.projectId = this.selectList[0].projectId;
    }
    this.selectedData = this.selectList || [];
    this.refreshData();
  }

  public nzVisibleChange(event: boolean) {
    this.isVisible = event;
    this.isVisibleChange.emit(this.isVisible);
  }

  /**
   * 点击取消关闭选择项目列表弹窗
   */
  public handleCancel(): void {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }

  public handleOk(): void {
    const data = this.selectedData;
    this.selectDataChange.emit(data);
    this.handleCancel();
  }

  /**
   * 分页查询
   * param event PageModel
   */
  public pageChange(event: PageModel): void {
    this.projectQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.projectQueryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 单选
   */
  public onSelectChange(event: string, data: any): void {
    this.projectId = event;
    this.selectedData = [data];
  }

  /**
   * 清空操作
   */
  public onClickCleanAll(): void {
    this.projectListTable.keepSelectedData.clear();
    this.projectListTable.checkStatus();
    this.selectedData = [];
    this.selectList = [];
    this.projectId = null;
    this.refreshData();
  }

  /**
   * 刷新项目列表
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    this.$planProjectForCommonService.queryProjectInfoListByPage(this.projectQueryCondition).subscribe((res) => {
      this.tableConfig.isLoading = false;
      if (res.code === ResultCodeEnum.success) {
        this.dataSet = res.data || [];
        this.dataSet.forEach(item => {
          item.statusIconClass = ProjectStatusIconEnum[item.status];
        });
        this.pageBean.pageIndex = res.pageNum;
        this.pageBean.Total = res.totalCount;
        this.pageBean.pageSize = res.size;
      }
    });
  }

  /**
   * 项目列表初始化
   */
  private initTableConfig() {
    this.tableConfig = {
      isDraggable: true,
      isLoading: true,
      outHeight: 108,
      keepSelected: true,
      notShowPrint: true,
      selectedIdKey: 'projectId',
      showSearchSwitch: true,
      scroll: {x: '1200px', y: '340px'},
      noIndex: true,
      columnConfig: [
        // 选择
        {
          type: this.multiple ? 'select' : 'render',
          title: '',
          renderTemplate: this.multiple ? null : this.radioTemp,
          fixedStyle: {fixedLeft: true, style: {left: '0'}}, width: 62
        },
        { // 序号
          type: 'serial-number',
          width: 62,
          title: this.commonLanguage.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        { // 项目名称
          title: this.projectLanguage.projectName,
          key: 'projectName',
          width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 项目编号
          title: this.projectLanguage.projectCode,
          key: 'projectCode',
          width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 项目规模
          title: this.projectLanguage.projectScale,
          key: 'projectScale',
          width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 已建数量
          title: this.projectLanguage.builtCount,
          key: 'builtCount',
          width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 在建数量
          title: this.projectLanguage.buildingCount,
          key: 'buildingCount',
          width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 项目状态
          title: this.projectLanguage.projectStatus,
          key: 'status',
          type: 'render',
          renderTemplate: this.projectStatusTemp,
          width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: CommonUtil.codeTranslate(ProjectStatusEnum, this.$nzI18n, null, LanguageEnum.planProject),
            label: 'label',
            value: 'code'
          }
        },
        { // 操作列
          title: this.commonLanguage.operate,
          searchable: true,
          searchConfig: {type: 'operate'},
          key: '', width: 100,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        }
      ],
      operation: [],
      showPagination: true,
      bordered: false,
      showSearch: false,
      // 勾选
      handleSelect: (event: any[]) => {
        this.selectedData = event;
        this.selectList = event;
      },
      // 过滤查询
      handleSearch: (event: FilterCondition[]) => {
        this.projectQueryCondition.pageCondition.pageNum = 1;
        this.projectQueryCondition.filterConditions = event;
        this.refreshData();
      },
      sort: (event: SortCondition) => {
        this.projectQueryCondition.sortCondition = event;
        this.refreshData();
      },
    };
  }
}
