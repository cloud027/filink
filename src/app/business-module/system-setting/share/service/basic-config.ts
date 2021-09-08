import {NzI18nService} from 'ng-zorro-antd';
import {Injectable} from '@angular/core';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';

@Injectable()
export class BasicConfig {
  // 国际化
  public language: any = {};
  // 加载圈
  public submitLoading = false;
  // 表单状态
  public formStatus: FormOperate;
  // 表单行
  public formColumn: FormItem[] = [];
  // 表格通用配置
  public _dataSet = [];
  // 表格通用分页配置
  public pageBean: PageModel = new PageModel(10, 1, 1);
  // 表格配置
  public tableConfig: TableConfigModel;
  // 确定按钮的状态
  public isSystemDisabled: boolean = false;
  // 表格通用查询条件
  public queryConditions = {
    pageCondition: {},
    filterConditions: [],
    sortCondition: {},
    bizCondition: {}
  };

  constructor(public $nzI18n: NzI18nService) {
    this.language = $nzI18n.getLocale();
  }

  /**
   * 通用表单方法
   * 获取form表单对象
   * @param event 表单
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    // 校验表单
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isSystemDisabled = this.formStatus.getRealValid();
    });
  }

  /**
   * 确定
   */
  formHandleOk() {
  }

  /**
   * 取消
   */
  formHandleCancel() {
  }

  /**
   * 恢复默认
   */
  formHandleReset() {
  }

  /**
   * 通用查询
   */
  searchList() {
  }

  /**
   * 通用查询表单数据
   */
  searchFromData() {
  }

  /**
   * 监听页面切换
   * param event
   */
  pageChange(event) {
    this.pageBean.pageIndex = event.pageIndex;
    this.pageBean.pageSize = event.pageSize;
    this.searchList();
  }

  /**
   * 手動查詢
   * param event
   */
  handleSearch(event) {
    this.queryConditions.filterConditions = event;
    this.pageBean = new PageModel(this.pageBean.pageSize, 1, this.pageBean.Total);
    this.searchList();
  }
}
