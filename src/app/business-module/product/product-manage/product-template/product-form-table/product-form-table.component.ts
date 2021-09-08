import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../../shared-module/model/query-condition.model';
import {FormOperate} from '../../../../../shared-module/component/form/form-operate.service';
import {RuleUtil} from '../../../../../shared-module/util/rule-util';
import {PageSizeEnum} from '../../../../../shared-module/enum/page-size.enum';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {ProductLanguageInterface} from '../../../../../../assets/i18n/product/product.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {FormControl} from '@angular/forms';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {debounceTime, distinctUntilChanged, first, mergeMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import {TableSortConfig} from '../../../../../shared-module/enum/table-style-config.enum';
import * as _ from 'lodash';
import {PortConfigEnum, SensorConfigEnum} from '../../../share/enum/product.enum';
import {ProductFormTableModel} from '../../../share/model/product-form-table.model';

/**
 * 产品设备配置表单模板
 */
@Component({
  selector: 'app-product-form-table',
  templateUrl: './product-form-table.component.html',
  styleUrls: ['./product-form-table.component.scss']
})
export class ProductFormTableComponent implements OnInit {

  // 回显数据
  @Input() set formTableData(formTableData) {
    if (!_.isEmpty(formTableData)) {
      this.tableResultList = formTableData;
      this.tableData = formTableData;
      this.pageBean.Total = formTableData.length;
      this.pageBean.pageSize = PageSizeEnum.sizeFive;
      this.pageBean.pageIndex = 1;
    }
  }
  // 对外触发校验
  @Output() checkCommit = new EventEmitter<any>();
  // 产品国际化词条
  public productLanguage: ProductLanguageInterface;
  public commonLanguage: CommonLanguageInterface;
  // 分页参数
  public pageBean: PageModel = new PageModel(PageSizeEnum.sizeFive, 1);
  // 表格参数
  public tableConfig: TableConfigModel;
  // 列表查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 列表
  public tableData: ProductFormTableModel[] = [];
  public tableResultList: ProductFormTableModel[] = [];
  // 表单
  public tableFormColumn: FormItem[] = [];
  // 是否可添加
  public canCommit: boolean = false;
  // 表单实例
  private tableFormStatus: FormOperate;

  constructor(
    private $nzI18n: NzI18nService,
    private $ruleUtil: RuleUtil,
    private $message: FiLinkModalService,
  ) { }

  public ngOnInit(): void {
    this.productLanguage = this.$nzI18n.getLocaleData(LanguageEnum.product);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.initTemplateColumn();
    this.initTableConfig();
  }

  /**
   * 表单实例化
   */
  public tableFormInstance(event: { instance: FormOperate }) {
    this.tableFormStatus = event.instance;
    this.tableFormStatus.group.valueChanges.subscribe(() => {
      this.canCommit = this.tableFormStatus.getValid();
    });
  }

  /**
   * 分页事件
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 添加
   */
  public handleOk(): void {
    const data = this.tableFormStatus.getData();
    const arr = this.tableResultList.find(v => v.sensorName === data.sensorName);
    if (!arr) {
      data.id = CommonUtil.getUUid();
      this.tableResultList.push(data);
      this.refreshData();
      this.tableFormStatus.resetData({});
      // 校验按钮
      this.checkCommit.emit(this.tableResultList);
    }
  }

  /**
   * 初始化表格
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      primaryKey: '06-3-1',
      showSearchSwitch: true,
      showRowSelection: false,
      showSizeChanger: true,
      notShowPrint: true,
      scroll: {x: '800px', y: '600px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {// 名称
          title: this.productLanguage.sensorName, key: 'sensorName',
          width: 150,
          searchable: true, isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 类型
          title: this.productLanguage.sensorType, key: 'sensorTypeName',
          width: 150, isShowSort: true,
          searchable: true,
          searchConfig: {
            type: 'select',
            selectInfo: CommonUtil.codeTranslate(SensorConfigEnum, this.$nzI18n, null, LanguageEnum.product),
            label: 'label', value: 'code'
          }
        },
        {// 型号
          title: this.productLanguage.sensorModel, key: 'typeCode',
          width: 150, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {// 端口类型
          title: this.productLanguage.portsType, key: 'portType',
          width: 150, isShowSort: true,
          searchable: true,
          searchConfig: {
            type: 'select',
            selectInfo: CommonUtil.codeTranslate(PortConfigEnum, this.$nzI18n, null, LanguageEnum.product),
            label: 'label', value: 'code'
          }
        },
        {// 端口号
          title: this.productLanguage.portNumber, key: 'portCode',
          width: 150, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {// 操作
          title: this.productLanguage.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 80,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'array',
      topButtons: [],
      operation: [
        {
          text: this.productLanguage.delete,
          className: 'fiLink-delete red-icon',
          btnType: 'danger',
          iconClassName: 'fiLink-delete',
          needConfirm: true,
          canDisabled: true,
          handle: (data) => {
            const index = this.tableResultList.findIndex(v => v.id === data.id);
            this.tableResultList.splice(index, 1);
            this.refreshData();
            // 校验按钮
            this.checkCommit.emit(this.tableResultList);
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
        this.refreshData();
      }
    };
  }

  /**
   * 筛选数据
   */
  public refreshData(): void {
    // 搜索逻辑
    let searchData = [];
    const query = this.queryCondition.filterConditions;
    if (query.length > 0) {
      searchData = this.tableResultList.filter(item => {
        return query.every(_item => {
          if (_item.operator === OperatorEnum.like) {
            return item[_item.filterField].includes(_item.filterValue);
          } else if (_item.operator === OperatorEnum.in) {
            return _item.filterValue.includes(item[_item.filterField]);
          }
        });
      });
    } else {
      searchData = this.tableResultList;
    }
    this.pageBean.Total = searchData.length;
    this.pageBean.pageIndex = this.queryCondition.pageCondition.pageNum;
    this.pageBean.pageSize = this.queryCondition.pageCondition.pageSize;
    // 排序逻辑
    let sortDataSet = [];
    const sort = this.queryCondition.sortCondition;
    if (sort && sort.sortRule) {
      sortDataSet = _.sortBy(searchData, sort.sortField);
      if (sort.sortRule === TableSortConfig.DESC) {
        sortDataSet.reverse();
      }
    } else {
      sortDataSet = searchData;
    }
    this.tableData = sortDataSet.slice(this.pageBean.pageSize * (this.pageBean.pageIndex - 1),
      this.pageBean.pageIndex * this.pageBean.pageSize);
    this.tableData.forEach(v => {
      if (v.sensorType) {
        v.sensorTypeName = CommonUtil.codeTranslate(SensorConfigEnum, this.$nzI18n, v.sensorType, LanguageEnum.product);
      }
    });
  }

  /**
   * 校验
   */
  private checkName(name: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const arr = this.tableResultList.find(v => v.sensorName === name);
      if (arr) {
        resolve('0');
      } else {
        resolve('1');
      }
    });
  }
  /**
   * 校验
   */
  private checkOnly(): boolean {
    let flag = false;
    for (let i = 0; i < this.tableFormColumn.length; i++) {
      if (this.tableFormColumn[i].key !== 'name') {
        flag = this.tableFormStatus.getValid(this.tableFormColumn[i].key);
        if (!flag) {
          break;
        }
      }
    }
    return flag;
  }
  /**
   * 表单初始化
   */
  private initTemplateColumn(): void {
    this.tableFormColumn = [
      { // 名称
        label: this.productLanguage.sensorName, key: 'sensorName',
        type: 'input', require: true,
        rule: [
          {required: true},
          RuleUtil.getNameMaxLengthRule(),
          RuleUtil.getAlarmNamePatternRule(this.commonLanguage.nameCodeMsg)
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          {
            asyncRule: (control: FormControl) => {
              if (control.value) {
                return control.valueChanges.pipe(
                  distinctUntilChanged(),
                  debounceTime(1000),
                  mergeMap(() => this.checkName(control.value.trim())),
                  mergeMap(res => {
                    if (res === '1') {
                      this.canCommit = this.checkOnly();
                      return of(null);
                    } else {
                      this.canCommit = false;
                      return of({error: true, duplicated: true});
                    }
                  }),
                  first()
                );
              } else {
                return of(null);
              }
            },
            asyncCode: 'duplicated', msg: this.commonLanguage.nameExists
          }
        ],
        modelChange: (controls, event, key, formOperate) => {}
      },
      { // 类型
        label: this.productLanguage.sensorType, key: 'sensorType',
        require: true, type: 'select',
        rule: [{required: true}],
        selectInfo: {
          data: CommonUtil.codeTranslate(SensorConfigEnum, this.$nzI18n, null, LanguageEnum.product),
          label: 'label', value: 'code',
        },
      },
      { // 型号
        label: this.productLanguage.sensorModel, key: 'typeCode',
        type: 'input', require: true,
        rule: [
          {required: true},
          RuleUtil.getNameMaxLengthRule(),
          RuleUtil.getCodeRule(this.commonLanguage.nameCodeMsg)
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
      { // 类型
        label: this.productLanguage.portsType, key: 'portType',
        require: true, type: 'select',
        rule: [{required: true}],
        selectInfo: {
          data: CommonUtil.codeTranslate(PortConfigEnum, this.$nzI18n, null, LanguageEnum.product),
          label: 'label', value: 'code',
        },
      },
      { // 端口号
        label: this.productLanguage.portNumber, key: 'portCode',
        type: 'input', require: true,
        rule: [
          {required: true},
          this.$ruleUtil.getSensorPortRule(),
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
    ];
  }
}
