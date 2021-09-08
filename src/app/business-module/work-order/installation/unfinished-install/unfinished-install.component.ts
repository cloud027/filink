import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {SliderCardConfigModel} from '../../share/model/slider-card-config-model';
import {WorkOrderClearInspectUtil} from '../../share/util/work-order-clear-inspect.util';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {WorkOrderLanguageInterface} from '../../../../../assets/i18n/work-order/work-order.language.interface';
import {InstallationTableComponent} from '../installation-table/installation-table.component';
import {WorkOrderPageTypeEnum} from '../../share/enum/work-order-page-type.enum';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {InstallWorkOrderService} from '../../share/service/installation';
import {WorkOrderStatisticalModel} from '../../share/model/clear-barrier-model/work-order-statistical.model';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';

/**
 * 未完工安装工单列表
 */
@Component({
  selector: 'app-unfinished-install',
  templateUrl: './unfinished-install.component.html',
  styleUrls: ['./unfinished-install.component.scss']
})
export class UnfinishedInstallComponent implements OnInit, OnDestroy {

  // 状态模板
  @ViewChild('installTable') installTable: InstallationTableComponent;
  // 国际化
  public workOrderLanguage: WorkOrderLanguageInterface;
  // 页面类型
  public orderPageType = WorkOrderPageTypeEnum.unfinished;
  // 卡片配置
  public sliderConfig: SliderCardConfigModel[] = [];
  // 卡片切换时数据 （外部组件暂无模型）
  private slideShowChangeData;

  constructor(
    private $nzI18n: NzI18nService,
    private $installService: InstallWorkOrderService,
    public $message: FiLinkModalService,
  ) { }

  public ngOnInit(): void {
    this.workOrderLanguage = this.$nzI18n.getLocaleData(LanguageEnum.workOrder);
    // 获取卡片数据
    this.getCardList();
  }
  public ngOnDestroy(): void {
    this.installTable = null;
  }

  /**
   * 滑块变化
   */
  public slideShowChange(event): void {
    this.slideShowChangeData = event;
  }
  /**
   * 选中卡片查询相应的类型
   */
  public sliderChange(event): void {
    if (event.code) {
      if (event.code && event.code !== 'all') {
        this.installTable.workTableTemp.tableService.resetFilterConditions(this.installTable.workTableTemp.queryTerm);
        this.installTable.workTableTemp.handleSetControlData('status', [event.code]);
        this.installTable.workTableTemp.handleSearch();
      } else if (event.code === 'all') {
        this.installTable.queryCondition.bizCondition = {};
        this.installTable.queryCondition.filterConditions = [];
        this.installTable.workTableTemp.handleSetControlData('status', null);
      }
      this.installTable.refreshData();
    }
  }

  /**
   * 卡片数据
   */
  public getCardList(): void {
    let toDayTotal = 0;
    const that = this;
    this.$installService.installStatusAdd().subscribe((res: ResultModel<any>) => {
      if (res.code === ResultCodeEnum.success) {
        toDayTotal = res.data;
        that.$installService.installStatusStatistics().subscribe((result: ResultModel<WorkOrderStatisticalModel[]>) => {
          if (res.code === ResultCodeEnum.success) {
            const list = result.data || [];
            const dataList = [];
            const isStatus = ['assigned', 'processing', 'pending', 'singleBack', 'turnProcess'];
            list.forEach(item => {
              if (isStatus.indexOf(item.status) > -1) {
                dataList.push({
                  orderCount: item.count,
                  status: item.status,
                  statusName: that.workOrderLanguage[item.status],
                  orderPercent: 0.0
                });
              }
            });
            WorkOrderClearInspectUtil.initStatisticsList(that, dataList, toDayTotal);
          } else {
            WorkOrderClearInspectUtil.initStatisticsList(this, WorkOrderClearInspectUtil.defaultCardList(), 0);
          }
        }, () => {
          WorkOrderClearInspectUtil.initStatisticsList(this, WorkOrderClearInspectUtil.defaultCardList(), 0);
        });
      } else {
        WorkOrderClearInspectUtil.initStatisticsList(this, WorkOrderClearInspectUtil.defaultCardList(), 0);
      }
    }, error => {
      WorkOrderClearInspectUtil.initStatisticsList(this, WorkOrderClearInspectUtil.defaultCardList(), 0);
    });
  }

}
