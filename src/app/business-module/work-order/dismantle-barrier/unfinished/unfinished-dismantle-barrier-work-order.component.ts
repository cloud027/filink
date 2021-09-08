import { Component, OnInit, ViewChild } from '@angular/core';
import { NzI18nService } from 'ng-zorro-antd';
import { Result } from '../../../../shared-module/entity/result';
import { DismantleBarrierWorkOrderService } from '../../share/service/dismantle-barrier';
import { FiLinkModalService } from '../../../../shared-module/service/filink-modal/filink-modal.service';
import { WorkOrderLanguageInterface } from '../../../../../assets/i18n/work-order/work-order.language.interface';
import { UnfinishedDismantleBarrierWorkOrderTableComponent } from './table';
import { ResultCodeEnum } from '../../../../shared-module/enum/result-code.enum';
import { WorkOrderStatusEnum } from '../../../../core-module/enum/work-order/work-order-status.enum';
import { CardStyleModel } from '../../share/model/clear-barrier-model/card-style.model';
import { WorkOrderStatusUtil } from '../../../../core-module/business-util/work-order/work-order-for-common.util';

/**
 * 未完工销账工单卡片
 */
@Component({
    selector: 'app-unfinished-dismantle-barrier-work-order',
    templateUrl: './unfinished-dismantle-barrier-work-order.component.html',
    styleUrls: ['./unfinished-dismantle-barrier-work-order.component.scss']
})
export class UnfinishedDismantleBarrierWorkOrderComponent implements OnInit {
    // 未完工销障列表
    @ViewChild('table') table: UnfinishedDismantleBarrierWorkOrderTableComponent;
    // 国际化
    public workOrderLanguage: WorkOrderLanguageInterface;
    // 卡片配置
    public sliderConfig = [];
    // 卡片数据
    public saveConfig = [];
    // 卡片切换时数据
    public slideShowChangeData;
    // 显示卡片
    public isNoData: boolean = false;
    // 全部未完成工单数目
    private totalCount: number;
    // 待指派工单数目
    private assignedCount: number = 0;
    // 待处理工单数目
    private pendingCount: number = 0;
    // 处理中工单数目
    private processingCount: number = 0;
    // 已退单工单数目
    private singleBackCount: number = 0;
    // 已转派工单数目
    private turnProcessingCount: number = 0;
    // 新增数目
    private increaseCount: number = 0;

    constructor(
        public $nzI18n: NzI18nService,
        private $dismantleBarrierWorkOrderService: DismantleBarrierWorkOrderService,
        private $message: FiLinkModalService
    ) {}

    ngOnInit() {
        this.workOrderLanguage = this.$nzI18n.getLocaleData('workOrder');
        this.getStatistics();
    }

    /**
     * 选中卡片查询相应的类型
     * param event
     */
    sliderChange(event) {
        if (this.isNoData) {
            return;
        }
        if (event.code) {
            this.filterByStatus(event.code);
        }
    }

    /**
     * 工单列表事件回传
     */
    workOrderEvent(event) {
        this.getStatistics();
    }

    /**
     * 获取统计信息
     */
    getStatistics() {
        this.getIncreaseCount().then((bool) => {
            if (bool === true) {
                this.getProcessingCount();
                this.isNoData = false;
            } else {
                this.isNoData = true;
                const resultData = this.defaultCardList();
                this.statisticsData(resultData);
            }
        });
    }

    /**
     * 卡片无数据统计默认样式
     */
    private defaultCardList() {
        const names = ['To be assigned', 'Pending', 'Processing', 'Transferred', 'Canceled'];
        const status = ['assigned', 'pending', 'processing', 'turnProcess', 'singleBack'];
        const list = [];
        for (let i = 0; i < status.length; i++) {
            list.push({
                orderCount: 0,
                status: status[i],
                statusName: names[i],
                orderPercent: 0.0
            });
        }
        return list;
    }

    filterByStatus(status?) {
        this.table.filterByStatus(status);
    }

    /**
     * 统计
     */
    private statisticsData(list: CardStyleModel[]): void {
        let sumCount = 0;
        list.forEach((item) => {
            switch (item.status) {
                case WorkOrderStatusEnum.assigned:
                    this.assignedCount = item.orderCount;
                    break;
                case WorkOrderStatusEnum.pending:
                    this.pendingCount = item.orderCount;
                    break;
                case WorkOrderStatusEnum.processing:
                    this.processingCount = item.orderCount;
                    break;
                case WorkOrderStatusEnum.singleBack:
                    this.singleBackCount = item.orderCount;
                    break;
                default:
                    this.turnProcessingCount = item.orderCount;
                    break;
            }
            sumCount += item.orderCount;
            this.saveConfig.push({
                label: this.workOrderLanguage[item.status],
                sum: item.orderCount,
                iconClass: WorkOrderStatusUtil.getWorkOrderIconClassName(item.status),
                textClass: this.getTextStatus(item.status),
                code: item.status
            });
        });
        this.totalCount = sumCount;
        this.saveConfig.unshift({
            label: this.workOrderLanguage.all,
            sum: this.totalCount,
            iconClass: 'iconfont fiLink-work-order-all statistics-all-color',
            textClass: 'statistics-all-color',
            code: 'all'
        });
        this.saveConfig.push({
            label: this.workOrderLanguage.addWorkOrderToday,
            sum: this.increaseCount,
            iconClass: 'iconfont fiLink-add-arrow statistics-add-color',
            textClass: 'statistics-add-color',
            code: null
        });
        this.sliderConfig = this.saveConfig;
    }

    private getTextStatus(status: string): string {
        return `statistics-${status}-color`;
    }

    /**
     * 获取工单状态数量
     */
    private getProcessingCount(): void {
        this.sliderConfig = [];
        this.saveConfig = [];
        const data = {};
        this.$dismantleBarrierWorkOrderService
            .queryDismantleBarrierCountByStatus_API(data)
            .subscribe((result: Result) => {
                if (result.code === ResultCodeEnum.success) {
                    let resultData = [];
                    const isStatus = [
                        'assigned',
                        'processing',
                        'pending',
                        'singleBack',
                        'turnProcess'
                    ];
                    if (result.data.length > 0) {
                        result.data.forEach((item) => {
                            if (isStatus.indexOf(item.status) > -1) {
                                resultData.push({
                                    orderCount: item.count,
                                    status: item.status,
                                    statusName: this.workOrderLanguage[item.status],
                                    orderPercent: 0.0
                                });
                            }
                        });
                    } else {
                        resultData = this.defaultCardList();
                    }
                    this.statisticsData(resultData);
                } else {
                    this.$message.error(result.msg);
                }
            });
    }
    /**
     * 获取新增工单数目
     */
    getIncreaseCount() {
        const data = {};
        return new Promise((resolve, reject) => {
            this.$dismantleBarrierWorkOrderService
                .getInsertDismantleBarrierCount_API(data)
                .subscribe(
                    (result: Result) => {
                        if (result.code === ResultCodeEnum.success) {
                            this.increaseCount = result.data;
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    },
                    (error) => {
                        reject(error);
                    }
                );
        });
    }

    /**
     * 滑块变化
     * param event
     */
    slideShowChange(event) {
        this.slideShowChangeData = event;
    }
}
