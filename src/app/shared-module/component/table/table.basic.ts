import {PageModel} from '../../model/page.model';
import {TableConfigModel} from '../../model/table-config.model';
import {QueryConditionModel} from '../../model/query-condition.model';
import {CommonLanguageInterface} from '../../../../assets/i18n/common/common.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {ExportRequestModel} from '../../model/export-request.model';

export class TableBasic {
  // 表格通用配置
  _dataSet = [];
  // 表格通用分页配置
  pageBean: PageModel = new PageModel(10, 1, 0);
  public tableConfig: TableConfigModel;
  // 表格通用查询条件
  queryCondition: QueryConditionModel = new QueryConditionModel();
  commonLanguage: CommonLanguageInterface;
  exportParams: ExportRequestModel = new ExportRequestModel();

  constructor(
    public $nzI18n: NzI18nService
  ) {
    this.commonLanguage = $nzI18n.getLocaleData('common');
  }

  /**
   * 初始化表格配置
   */
  initTableConfig() {
  }

  /**
   * 数据获取
   */
  refreshData() {
  }

  /**
   * 监听页面切换
   * param event
   */
  pageChange(event) {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 手动查询
   * param event
   */
  handleSearch(event) {
    this.queryCondition.filterConditions = event;
    this.setPageCondition(event);
    this.refreshData();
  }

  /**
   * 设置查询条件
   */
  setPageCondition(event) {
    // this.pageBean = new PageModel(this.pageBean.pageSize, 1, 0);
    this.queryCondition.pageCondition.pageNum = 1;
    // this.queryCondition.pageCondition.pageSize = event.pageSize;
  }

  /**
   * 删除等操作后查询条件修改
   */
  resetPageCondition() {
    this.pageBean.pageIndex = 1;
    this.queryCondition.pageCondition.pageNum = 1;
  }

  /**
   * 排序
   * param event
   */
  handleSort(event) {
    console.log(event);
    this.queryCondition.sortCondition.sortField = event.sortField;
    this.queryCondition.sortCondition.sortRule = event.sortRule;
    this.refreshData();
  }

  /**
   * 导出
   * param event
   */
  handleExport(event) {
    console.log(event);
  }

  /**
   * 打印
   * param event
   */
  handlePrint(event) {
    console.log(event);
  }
}
