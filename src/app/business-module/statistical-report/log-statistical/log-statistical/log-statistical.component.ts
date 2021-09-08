import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {NzI18nService, NzModalService, DateHelperService} from 'ng-zorro-antd';
import {ChartUtil} from '../../../../shared-module/util/chart-util';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {getLogStatisticalType, getAllType} from '../log-statistical.config';
import {Router} from '@angular/router';
import {LogStatisticalInterface} from '../../../../../assets/i18n/log-statistical/log-statistical-language.interface';
import {DateFormatStringEnum} from '../../../../shared-module/enum/date-format-string.enum';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {LogStatisticalService} from '../../share/service/log-statistical.service';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {LogTemplateDetailModel} from '../../share/model/log/log-template-detail.model';
import {EditLogTemplateModel} from '../../share/model/log/edit-log-template.model';
import {LogResultModel} from '../../share/model/log/log-result.model';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';

@Component({
  selector: 'app-log-statistical',
  templateUrl: './log-statistical.component.html',
  styleUrls: ['./log-statistical.component.scss']
})
export class LogStatisticalComponent implements OnInit {
  // 国际化
  public language: LogStatisticalInterface;
  // 模板选择点击确定保存的value
  public selectValue;
  // 模板表格数据
  public _dataSet = [];
  public isLoading = true;
  // 模板表格分页配置
  public pageBean: PageModel = new PageModel(10, 1, 1);
  // 模板表格配置
  public tableConfig: TableConfigModel;
  // 模板查询条件
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // 统计表格数据
  public _dataList = [];
  // 默认统计表格数据 筛选用
  private _dataSetMain = [];
  // 统计表格分页配置
  public logPageBean: PageModel = new PageModel(10, 1, 1);
  // 统计表格配置
  public logTableConfig: TableConfigModel;
  // 表格统计查询条件
  private logQueryCondition: QueryConditionModel = new QueryConditionModel();
  public hide = true;
  // 枚举工具
  // 饼图实例
  private barChartInstance;
  // 柱状图实例
  private ringChartInstance;
  // 日志统计类型(默认是日志类型)
  public logStatisticalData: string = 'logType';
  // 日志统计LIst
  public logStatisticalList = [];
  // 时间范围
  public dateRange = [];
  // 起始时间
  private startTime;
  // 终止时间
  private endTime;
  // 选择的区域信息
  // modal框
  private modal: any;
  // 操作用户
  public optUser = null;
  // 操作终端
  public optTerminal = null;
  // 操作对象
  public optObject = null;
  // 选择的模板ID
  public selectedTempId = null;
  private filterValue: any;
  // 列表导出数据
  public exportData = [];
  // 进度条
  public ProgressShow = false;
  // 模板统计
  @ViewChild('logTemplate') logTemplate: TemplateRef<any>;
  // 单选按钮
  @ViewChild('radioTemp') radioTemp: TemplateRef<any>;

  constructor(
    private $nzI18n: NzI18nService,
    private $logStatistical_Service: LogStatisticalService,
    private $router: Router,
    private $modal: NzModalService,
    private $dateHelper: DateHelperService,
    private $message: FiLinkModalService
  ) {
    this.logStatisticalList = getLogStatisticalType(this.$nzI18n);
  }

  public ngOnInit() {
    this.language = this.$nzI18n.getLocaleData('logStatistical');
    this.queryCondition.filterConditions = [
      {
        filterField: 'isDeleted', operator: 'eq', filterValue: '0'
      }
    ];
    this.initTableConfig();
    this.firstStatistical();
    this.statistical();
  }

  /**
   * 翻页
   * param event
   */
  public pageChange(event) {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 统计数据翻页
   * param event
   */
  public logPageChange(event) {
    this.logQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.logQueryCondition.pageCondition.pageSize = event.pageSize;
  }

  /**
   * 初始化模板选择表格配置
   */
  initTableConfig() {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      noIndex: true,
      notShowPrint: true,
      scroll: {x: '600px', y: '300px'},
      columnConfig: [
        {
          title: '',
          type: 'render',
          renderTemplate: this.radioTemp,
          fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 42
        },
        {type: 'serial-number', width: 62, title: this.language.serialNumber},
        {title: this.language.name, key: 'name', width: 200, isShowSort: true, searchable: true, searchConfig: {type: 'input'}},
        {
          title: this.language.createTime,
          key: 'createTime',
          width: 200,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'dateRang'}
        },
        {title: this.language.createUser, key: 'createName', width: 200, isShowSort: true, searchable: true, searchConfig: {type: 'input'}},
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 100, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      bordered: false,
      showSearch: false,
      searchReturnType: 'Object',
      topButtons: [
        {
          text: '+ ' + this.language.add,
          handle: (currentIndex) => {
            this.$router.navigate(['/business/statistical-report/log-statistical/template-details/add']).then();
            this.modal.destroy();
          }
        }
      ],
      operation: [
        {
          text: this.language.update,
          className: 'fiLink-edit',
          handle: (currentIndex) => {
            this.$router.navigate(['/business/statistical-report/log-statistical/template-details/update'],
              {queryParams: {id: currentIndex.id}}).then();
            this.modal.destroy();
          }
        },
        {
          text: this.language.delete,
          needConfirm: true,
          className: 'fiLink-delete red-icon',
          handle: (currentIndex) => {
            const param = new EditLogTemplateModel();
            param.id = currentIndex.id;
            param.name = currentIndex.name;
            this.$logStatistical_Service.deleteLogTemplate(param).subscribe((res: ResultModel<string>) => {
              if (res.code === 0) {
                this.$message.success(res.msg);
                this.refreshData();
              } else {
                this.$message.info(res.msg);
              }
            });
          }
        },
      ],
      leftBottomButtons: [],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      handleSearch: (event) => {
        event.push({filterField: 'isDeleted', operator: 'eq', filterValue: '0'});
        this.queryCondition.filterConditions = event;
        this.refreshData();
      }
    };
  }

  /**
   * 初始化日志表格配置
   */
  initLogTableConfig() {
    let columnConfigs = [];
    if (this.logStatisticalData === 'logType') {
      columnConfigs = [
        {
          title: getAllType(this.$nzI18n, 'operateLog'), key: 'operateLog', width: 350,
          searchable: true, searchConfig: {type: 'input'}
        },
        // {
        //   title: getAllType(this.$nzI18n, 'systemLog'), key: 'systemLog', width: 350,
        //   searchable: true, searchConfig: {type: 'input'}
        // },
        {
          title: getAllType(this.$nzI18n, 'securityLog'), key: 'securityLog', width: 300,
          searchable: true, searchConfig: {type: 'input'}
        },
      ];
      columnConfigs.push({
        title: '', searchable: true,
        searchConfig: {type: 'operate'}, key: '', width: 120
      });
    } else if (this.logStatisticalData === 'operationalType') {
      columnConfigs = [
        {
          title: getAllType(this.$nzI18n, 'web'), key: 'web', width: 500,
          searchable: true, searchConfig: {type: 'input'}
        },
        {
          title: getAllType(this.$nzI18n, 'pda'), key: 'pda', width: 300,
          searchable: true, searchConfig: {type: 'input'}
        }
      ];
      columnConfigs.push({
        title: '', searchable: true,
        searchConfig: {type: 'operate'}, key: '', width: 120
      });
    } else if (this.logStatisticalData === 'dangerLevelType') {
      columnConfigs = [
        {
          title: getAllType(this.$nzI18n, '1'), key: '1', width: 350,
          searchable: true, searchConfig: {type: 'input'}
        },
        {
          title: getAllType(this.$nzI18n, '2'), key: '2', width: 350,
          searchable: true, searchConfig: {type: 'input'}
        },
        {
          title: getAllType(this.$nzI18n, '3'), key: '3', width: 300,
          searchable: true, searchConfig: {type: 'input'}
        }
      ];
      columnConfigs.push({
        title: '', searchable: true,
        searchConfig: {type: 'operate'}, key: '', width: 120
      });
    }
    this.logTableConfig = {
      noIndex: true,
      showSearchSwitch: false,
      showSearch: false,
      notShowPrint: true,
      noExportHtml: true,
      showSearchExport: true,
      scroll: {x: '800', y: '325px'},
      columnConfig: columnConfigs,
      handleSearch: (event) => {
        this._dataList = this._dataSetMain;  // 重置到原始数据
        if (event.length > 0) {    // 数据过滤
          event.forEach(item => {
            this._dataList = this._dataList.filter(_item => {
              const index = (_item[item.filterField] + '').indexOf(item.filterValue);
              return index !== -1;
            });
          });
        } else {    // 重置
          this._dataList = this._dataSetMain;
        }
      },
      handleExport: (event) => {
        const columnInfoList = event.columnInfoList;
        if (this.logStatisticalData === 'operationalType') {
          columnInfoList.forEach(item => {
            if (item.propertyName === 'web') {
              item.propertyName = 'webOperate';
            }
            if (item.propertyName === 'pda') {
              item.propertyName = 'pdaOperate';
            }
          });
          this.exportData.forEach(item => {
            Object.keys(item).forEach(key => {
              if (key === 'web') {
                item['webOperate'] = item[key];
                delete item['web'];
              }
              if (key === 'pda') {
                item['pdaOperate'] = item[key];
                delete item['pda'];
              }
            });
          });
        } else if (this.logStatisticalData === 'dangerLevelType') {
          columnInfoList.forEach(item => {
            if (item.propertyName === '1') {
              item.propertyName = 'prompt';
            }
            if (item.propertyName === '2') {
              item.propertyName = 'general';
            }
            if (item.propertyName === '3') {
              item.propertyName = 'danger';
            }
          });
          this.exportData.forEach(item => {
            Object.keys(item).forEach(key => {
              if (key === '1') {
                item['prompt'] = item[key];
                delete item['1'];
              }
              if (key === '2') {
                item['general'] = item[key];
                delete item['2'];
              }
              if (key === '3') {
                item['danger'] = item[key];
                delete item['3'];
              }
            });
          });
        }

        // 导出参数
        const body = new ExportRequestModel(columnInfoList, event.excelType, new QueryConditionModel());
        body.objectList = this.exportData;
        let reqUrl = '';
        if (this.logStatisticalData === 'logType') {
          reqUrl = 'logTypeExport';
        } else if (this.logStatisticalData === 'operationalType') {
          reqUrl = 'operateTypeExport';
        } else if (this.logStatisticalData === 'dangerLevelType') {
          reqUrl = 'securityLevelExport';
        }
        this.$logStatistical_Service[reqUrl](body).subscribe((res: ResultModel<string>) => {
          if (res.code === 0) {
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    };

  }

  /**
   * 统计
   */
  public statistical() {
    this.ProgressShow = true;
    this.initLogTableConfig();
    this.searchLogInfo();
  }


  /**
   * 设置图表数据
   */
  setChartData(data, typeData) {
    const ringName = [];
    const ringData = [];
    const barName = [];
    const barData = [];
    for (const key in data) {
      if (data) {
        ringData.push({
          value: data[key],
          name: getAllType(this.$nzI18n, key)
        });
        barData.push(data[key]);
        ringName.push(getAllType(this.$nzI18n, key));
        barName.push(getAllType(this.$nzI18n, key));
      }
    }
    setTimeout(() => this.ringChartInstance.setOption(ChartUtil.setRingChartOption(ringData, ringName)));
    setTimeout(() => this.barChartInstance.setOption(ChartUtil.setBarChartOption(barData, barName)));
  }


  /**
   * 获取饼图实例
   */
  public getRingChartInstance(event) {
    this.ringChartInstance = event;
  }

  /**
   * 获取柱状图实例
   */
  public getBarChartInstance(event) {
    this.barChartInstance = event;
  }


  public onChange(timeResults) {
    this.startTime = CommonUtil.getTimeStamp(timeResults[0]);
    this.endTime = CommonUtil.getTimeStamp(timeResults[1]);
  }


  /**
   * 请求数据
   */
  refreshData() {
    this.tableConfig.isLoading = true;
    this.$logStatistical_Service.queryLogTemplateList(this.queryCondition).subscribe((res: ResultModel<LogTemplateDetailModel[]>) => {
      if (res.code === 0) {
        this.pageBean.Total = res.totalCount;
        this.pageBean.pageIndex = res.pageNum;
        this.pageBean.pageSize = res.size;
        this.tableConfig.isLoading = false;
        this._dataSet = res.data || [];
        this._dataSet.forEach(item => {
          if (item.createTime) {
            item.createTime = this.$dateHelper.format(new Date(item.createTime), DateFormatStringEnum.dateTimeType );
          }
        });
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 输入时去掉守卫空格
   */
  public inputValue(event, type): void {
    event.target.value = CommonUtil.trim(event.target.value);
    if (type === 1) {
      this.optUser = CommonUtil.trim(event.target.value);
    } else if (type === 2) {
      this.optTerminal = CommonUtil.trim(event.target.value);
    } else {
      this.optObject = CommonUtil.trim(event.target.value);
    }
  }

  /**
   * 打开统计模板
   */
  public templateHandle() {
    this.initTableConfig();
    this.queryCondition.filterConditions = [
      {
        filterField: 'isDeleted', operator: 'eq', filterValue: '0'
      }
    ];
    this.selectedTempId = null;
    const modal = this.$modal.create({
      nzTitle: this.language.logStatisticalTemplate,
      nzContent: this.logTemplate,
      nzOkText: this.language.cancel,
      nzCancelText: this.language.confirm,
      nzOkType: 'danger',
      nzClassName: 'custom-create-modal',
      nzWidth: '1000',
      nzFooter: [
        {
          label: this.language.confirm,
          disabled: () => {
            if (!this.selectedTempId) {
              return true;
            } else {
              return false;
            }
          },
          onClick: () => {
            this.filterValue = CommonUtil.deepClone(this.selectValue);
            if (this.filterValue) {
              this.logStatisticalData = this.filterValue.statisticalType;
              this.optUser = this.filterValue.createUser;
              this.optTerminal = this.filterValue.optTerminal;
              this.optObject = this.filterValue.optObj;
              this.dateRange = this.filterValue.optTime;
              this.dateRange = [this.timeChange(this.filterValue.optTime[0]), this.timeChange(this.filterValue.optTime[1])];
            }
            this.onChange(this.dateRange);
            modal.destroy();
          }
        },
        {
          label: this.language.cancel,
          type: 'danger',
          onClick: () => {
            this.selectValue = null;
            modal.destroy();
          }
        },
      ]
    });
    this.modal = modal;
    this.refreshData();
  }


  /**
   * 时间转换
   * @ param time
   */
  private timeChange(time: number) {
    return new Date(time);
  }

  /**
   * 单选框，选择用户
   */
  public selectedTempChange(event, data) {
    this.selectedTempId = data.id;
    this.selectValue = JSON.parse(data.filterValue);
  }

  /**
   * 创建统计查询条件
   */
  private createQueryConditions() {
    // 查询前先清空filterConditions历史记录
    this.logQueryCondition.filterConditions = [];
    // 操作用户
    if (this.optUser) {
      const optUser = {filterValue: this.optUser, filterField: 'optUserName', operator: 'like'};
      this.logQueryCondition.filterConditions.push(optUser);
    }
    // 操作终端
    if (this.optTerminal) {
      const optTerminal = {filterValue: this.optTerminal, filterField: 'optTerminal', operator: 'like'};
      this.logQueryCondition.filterConditions.push(optTerminal);
    }
    // 操作对象
    if (this.optObject) {
      const optObj = {filterValue: this.optObject, filterField: 'optObj', operator: 'like'};
      this.logQueryCondition.filterConditions.push(optObj);
    }
    // 操作时间
    const gteTime = {filterValue: this.startTime, filterField: 'optTime', operator: 'gte', extra: 'LT_AND_GT'};
    const lteTime = {filterValue: this.endTime, filterField: 'optTime', operator: 'lte', extra: 'LT_AND_GT'};
    this.logQueryCondition.filterConditions.push(gteTime, lteTime);

  }

  /**
   * 查询日志统计信息
   */
  private searchLogInfo() {
    this.createQueryConditions();
    if (this.logStatisticalData === 'logType') {   // 日志类型
      this.logTableConfig.isLoading = true;
      this.$logStatistical_Service.queryLogTypeCount(this.logQueryCondition).subscribe((result: ResultModel<LogResultModel>) => {
        const {operateLog, securityLog} = result.data;
        this.setChartsData({operateLog, securityLog}, 'logType');
      }, () => {
        this.logTableConfig.isLoading = false;
      });

    } else if (this.logStatisticalData === 'operationalType') {   // 操作类型
      this.logTableConfig.isLoading = true;
      this.$logStatistical_Service.queryOperateTypeCount(this.logQueryCondition).subscribe((result: ResultModel<LogResultModel>) => {
        this.setChartsData(result.data, 'operationalType');
      }, () => {
        this.logTableConfig.isLoading = false;
      });

    } else if (this.logStatisticalData === 'dangerLevelType') {  // 危险级别
      this.logTableConfig.isLoading = true;
      this.$logStatistical_Service.querySecurityTypeCount(this.logQueryCondition).subscribe((result: ResultModel<any>) => {
        this.setChartsData(result.data, 'dangerLevelType');
      }, () => {
        this.logTableConfig.isLoading = false;
      });
    }
  }


  /**
   * 日志统计类型回调禁用启用类型
   */

  public logChange(event) {
  }

  /**
   * 进入页面默认一个月查询
   */
  private firstStatistical() {
    const data = new Date();
    this.dateRange = [new Date(CommonUtil.funDate(-30)), data];
    this.onChange(this.dateRange);
  }

  private setChartsData(data, e) {
    this.logTableConfig.isLoading = false;
    this._dataList = [data];
    this._dataSetMain = [data];
    this.hide = false;
    this.setChartData(data, e);
    this.exportData = CommonUtil.deepClone(this._dataList);
    this.ProgressShow = false;
  }
}
