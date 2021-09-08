import {Component, OnInit, TemplateRef, ViewChild, Output, EventEmitter} from '@angular/core';
import {RuleUtil} from '../../../../../shared-module/util/rule-util';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {differenceInCalendarDays} from 'date-fns';
import {QueryConditionModel, SortCondition} from '../../../../../shared-module/model/query-condition.model';
import {Result} from '../../../../../shared-module/entity/result';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {OnlineLanguageInterface} from '../../../../../../assets/i18n/online/online-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {FormOperate} from '../../../../../shared-module/component/form/form-operate.service';
import {UserForCommonService} from '../../../../../core-module/api-service/user/user-for-common.service';

@Component({
  selector: 'app-security-strategy',
  templateUrl: './security-strategy.component.html',
  styleUrls: ['./security-strategy.component.scss']
})
export class SecurityStrategyComponent implements OnInit {
  pageTitle: string = '新增策略'; // 页面标题
  isLoading = false; // 列表初始加载图标
  isVisible = false;
  formColumn: FormItem[] = []; // form表单配置
  _dataSet = [];
  pageBean: PageModel = new PageModel(10, 1, 1);
  tableConfig: TableConfigModel;
  language: OnlineLanguageInterface;
  queryCondition: QueryConditionModel = new QueryConditionModel();
  @ViewChild('ecTimeTemp') ecTimeTemp: TemplateRef<any>;
  @ViewChild('startEndTime') startEndTime;
  @ViewChild('enableStatus') enableStatus;
  // 单位模板
  @ViewChild('department') private departmentTep;
  @Output() notify = new EventEmitter();
  formStatus: FormOperate;
  size = 'default';
  checked = 'true';
  // 已选责任单位
  selectUnitName: string = '';
  stepsSecondParams = {};
  constructor(
    public $nzI18n: NzI18nService,
    public $router: Router,
    public $userService: UserForCommonService,
  ) {
    this.language = this.$nzI18n.getLocaleData('online');
  }

  ngOnInit() {
    this.initColumn();
    this.initTableConfig();
    this.refreshData();
  }

  formInstance(event) {
    this.formStatus = event.instance;
  }
  pageChange(event) {
  }
  /**
   * 初始化表格配置
   */
  private initTableConfig() {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1600px', y: '600px'},
      noIndex: true,
      notShowPrint: true,
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        {
          title: '设备名称', key: 'userCode', width: 150, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        {
          title: '设施类型', key: 'userName', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: '设备类型', key: 'userNickname', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: '详细地址', key: 'loginTime', width: 180, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'}
        },
        {
          title: '设备状态', key: 'loginIp', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        }
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      sort: (event: SortCondition) => {
        const obj = {};
        obj['sortProperties'] = event.sortField;
        obj['sort'] = event.sortRule;
        this.refreshData();
      },
      handleSearch: (event) => {
      }
    };
  }
  /**
   * 刷新表格数据
   */
  private refreshData() {
    this.tableConfig.isLoading = true;
    this.$userService.getOnLineUser(this.queryCondition).subscribe((res: Result) => {
      this.tableConfig.isLoading = false;
      this._dataSet = res.data.data;
      this.pageBean.Total = res.data.totalCount;
      this.pageBean.pageIndex = res.data.pageNum;
      this.pageBean.pageSize = res.data.size;
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }
  /**
   * 打开责任单位选择器
   */
  showModal() {
    this.isVisible = true;
  }

  handleOk() {
    this.isVisible = false;
  }

  handleCancel() {
    this.isVisible = false;
  }

  handNextSteps() {
    const data = this.formStatus.group.getRawValue();
    this.stepsSecondParams = data;
  }

  handPrevSteps() {
    this.notify.emit(1);
  }
  handleCancelSteps() {
    this.$router.navigate(['business/application/security/workbench'], {}).then();
  }
  disabledEndDate = (current: Date): boolean => {
    const nowTime = new Date();
    return differenceInCalendarDays(current, nowTime) < 0 || CommonUtil.checkTimeOver(current);
  }

  private initColumn() {
    this.formColumn = [
      {
        label: '触发条件',
        key: 'triggerCondition',
        type: 'custom',
        require: true,
        rule: [],
        asyncRules: [],
        template: this.departmentTep
      },
      { // 工单名称
        label: '执行动作',
        key: 'execOpera',
        type: 'input',
        require: true,
        disabled: false,
        placeholder: '请输入策略名称',
        rule: [
          RuleUtil.getNameMinLengthRule(),
          RuleUtil.getNameMaxLengthRule(),
          // this.$ruleUtil.getNameRule()
        ],
        asyncRules: [
          {
            asyncRule: (control: FormControl) => {
              return Observable.create(observer => {
                // this.inspectionName = control.value;
                observer.next(null);
                observer.complete();
              });
            },
            asyncCode: 'duplicated', msg: '输入错误!'
          }
        ],
      },
      {
        label: '控制类型', key: 'controlType', type: 'select',
        selectInfo: {
          data: [
            {label: '平板控制', code: '1'},
            {label: '设备控制', code: '2'}
          ],
          label: 'label',
          value: 'code'
        },
        modelChange: (controls, $event, key) => {
        },
        require: true,
        rule: [{required: true}], asyncRules: []
      }
    ];
  }
}
