import {Component, EventEmitter, OnInit, Input, Output, TemplateRef, ViewChild} from '@angular/core';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {AlarmService} from '../../../share/service/alarm.service';
import {AlarmLanguageInterface} from '../../../../../../assets/i18n/alarm/alarm-language.interface';
import {NzI18nService, toBoolean} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../../shared-module/model/query-condition.model';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {AlarmFiltrationModel} from '../../../share/model/alarm-filtration.model';
import {AlarmTemplateModel} from '../../../share/model/alarm-template.model';

/**
 * 当前告警、历史告警页面的 模板列表
 */

@Component({
  selector: 'app-template-table',
  templateUrl: './template-table.component.html',
})
export class TemplateTableComponent implements OnInit {
  // 是否历史告警模板
  @Input() isHistoryAlarmTemplateTable = false;
  // 数据和关闭弹出事件
  @Output() resultAndClose = new EventEmitter<AlarmFiltrationModel>();
  // 列表选择模板
  @ViewChild('radioTemp') radioTemp: TemplateRef<any>;
  // 模板列表数据
  public dataSetTemplate: AlarmTemplateModel[] = [];
  // 模板列表翻页对象
  public pageBeanTemplate: PageModel = new PageModel(100);
  // 模板列表表格配置
  public tableConfigTemplate: TableConfigModel;
  // 告警国际化引用
  public language: AlarmLanguageInterface;
  // 选择模板弹窗
  public templateTable: boolean = true;
  // 列表选中数据
  public selectedAlarm: AlarmFiltrationModel = new AlarmFiltrationModel();
  // 列表选中告警ID
  public selectedAlarmId: string;
  // 表格过滤条件
  private filterEvent: FilterCondition[] = [];
  // 表格查询条件
  private queryCondition: QueryConditionModel = new QueryConditionModel();

  constructor(private $router: Router,
              private $nzI18n: NzI18nService,
              private $alarmService: AlarmService,
              private $message: FiLinkModalService) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    // 模板表格配置
    this.templateListConfig();
    // 查询模板列表数据
    this.queryTemplateData();
  }

  /**
   * 取消选择
   */
  public closePopUp(): void {
    this.templateTable = false;
    this.isHistoryAlarmTemplateTable = false;
    this.resultAndClose.emit();
  }
  /**
   * 翻页查询
   */
  public pageTemplateChange(event: PageModel): void {
    this.queryCondition.filterConditions = this.filterEvent;
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.queryTemplateData();
  }

  /**
   * 选中确认
   */
  public okText(): void {
    if (Object.keys(this.selectedAlarm).length > 0) {
      this.resultAndClose.emit(this.selectedAlarm);
    } else {
      this.closePopUp();
    }
  }

  /**
   * 选择列表数据
   * param data
   */
  public selectedAlarmChange(data: AlarmFiltrationModel): void {
    this.selectedAlarm = data;
  }

  /**
   * 查询模板列表数据
   */
  private queryTemplateData(): void {
    this.tableConfigTemplate.isLoading = true;
    let url;
    if (!toBoolean(this.isHistoryAlarmTemplateTable)) {
      url = 'queryAlarmTemplateList';
    } else {
      url = 'queryHistoryAlarmTemplateList';
    }
    this.$alarmService[url](this.queryCondition).subscribe(res => {
      if (res.code === 0) {
        this.tableConfigTemplate.isLoading = false;
        this.dataSetTemplate = res.data || [];
      } else {
        this.tableConfigTemplate.isLoading = false;
      }
    }, () => this.tableConfigTemplate.isLoading = false);
  }

  /**
   * 模板列表配置
   */
  public templateListConfig(): void {
    this.tableConfigTemplate = {
      isDraggable: true,
      isLoading: false,
      showSizeChanger: true,
      noIndex: true,
      notShowPrint: true,
      scroll: {x: '800px', y: '300px'},
      columnConfig: [
        {
          title: '',
          type: 'render',
          renderTemplate: this.radioTemp,
          fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 42
        },
        {
          // 序号
          type: 'serial-number', width: 52, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '12px'}}
        },
        {
          // 模板名称
          title: this.language.templateName, key: 'templateName', width: 100, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '24px'}}
        },
        {
          // 创建时间
          title: this.language.createTime, key: 'createTime', width: 200, isShowSort: true,
          searchable: true,
          pipe: 'date',
          searchConfig: {type: 'input'}
        },
        {
          // 创建用户
          title: this.language.createUser, key: 'createUser', width: 100, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 备注
          title: this.language.remark, key: 'remark', width: 100, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 操作
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 80, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      bordered: false,
      showSearch: false,
      searchReturnType: 'Object',
      topButtons: [
        {
          // 新增
          text: this.language.add,
          iconClassName: 'fiLink-add-no-circle',
          handle: () => {
            if (toBoolean(this.isHistoryAlarmTemplateTable)) {
              this.$router.navigate(['business/alarm/current-alarm/add'], {queryParams: {isHistoryAlarmTemplateTable: true}}).then();
            } else {
              this.$router.navigate(['business/alarm/current-alarm/add']).then();
            }
          }
        }
      ],
      operation: [
        {
          // 编辑
          text: this.language.update,
          className: 'fiLink-edit',
          handle: (currentIndex: AlarmTemplateModel) => {
            this.$router.navigate(['business/alarm/current-alarm/update'], {
              queryParams: {
                id: currentIndex.id,
                isHistoryAlarmTemplateTable : this.isHistoryAlarmTemplateTable
              }
            }).then();
          }
        },
        {
          // 删除
          text: this.language.deleteHandle,
          needConfirm: true,
          className: 'fiLink-delete red-icon',
          handle: (data: AlarmTemplateModel) => {
            const ids = data.id;
            if (ids) {
              let url;
              if (!toBoolean(this.isHistoryAlarmTemplateTable)) {
                url = 'deleteAlarmTemplateList';
              } else {
                url = 'deleteHistoryAlarmTemplateList';
              }
              this.$alarmService[url]([ids]).subscribe((res) => {
                if (res.code === 0) {
                  if (ids === this.selectedAlarmId) {
                    this.selectedAlarmId = null;
                    this.selectedAlarm = null;
                  }
                  this.queryTemplateData();
                  this.$message.success(res.msg);
                } else {
                  this.$message.info(res.msg);
                }
              });
            }
          }
        },
      ],
      leftBottomButtons: [],
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.filterConditions = this.filterEvent;
        this.queryCondition.bizCondition.sortField = event.sortField;
        this.queryCondition.bizCondition.sortRule = event.sortRule;
        this.queryTemplateData();
      },
    };
  }
}
