import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzI18nService } from 'ng-zorro-antd';
import * as _ from 'lodash';
import { ColumnConfig, TableConfigModel } from '../../../../../shared-module/model/table-config.model';
import { FacilityLanguageInterface } from 'src/assets/i18n/facility/facility.language.interface';
import { CommonLanguageInterface } from '../../../../../../assets/i18n/common/common.language.interface';
import { WorkOrderLanguageInterface } from '../../../../../../assets/i18n/work-order/work-order.language.interface';
import { FilterCondition, QueryConditionModel, SortCondition } from '../../../../../shared-module/model/query-condition.model';
import { LanguageEnum } from '../../../../../shared-module/enum/language.enum';
import { WorkOrderResourceEnum } from '../../../../../core-module/enum/work-order/work-order.enum';

@Component({
    selector: 'app-details-tab',
    templateUrl: './details-tab.component.html',
    styleUrls: ['./details-tab.component.scss']
})
export class DetailsTabComponent implements OnInit {
    @Input() deviceId: string;
    @Input() type: number;
    @Input() tableData = [];
    // 工单状态模版实例
    @ViewChild('statusTemp') statusTemp: TemplateRef<HTMLDocument>;
    // 数据来源
    @ViewChild('dataResource') dataResource: TemplateRef<HTMLDocument>;
    // 工单列表参数
    public tableConfig: TableConfigModel;
    // 设备国际化
    public language: FacilityLanguageInterface;
    // 工单国际化
    public workOrderLanguage: WorkOrderLanguageInterface;
    //  公共国际化
    public commonLanguage: CommonLanguageInterface;
    // 公共列表配置
    public commonConfig: ColumnConfig[];
    // 数据来源枚举
    public dataSourceEnum = WorkOrderResourceEnum;
    // 巡检查询条件
    private queryCondition: QueryConditionModel = new QueryConditionModel();
    // 消障工单查询条件
    private queryClearCondition: QueryConditionModel = new QueryConditionModel();
    constructor(
        private $nzI18n: NzI18nService
    ) {}

    ngOnInit() {
        this.language = this.$nzI18n.getLocaleData(LanguageEnum.energy);
        this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
        this.initTableConfig();
    }

    initTableConfig() {
        // 采集设施
        const tableCon = [
            //  序号
            {
                type: 'serial-number',
                width: 62,
                title: this.language.serialNumber,
                fixedStyle: { fixedLeft: true, style: { left: '0' } }
            },
            {
                // 设施名称
                title: this.language.nodesDetails.facilityName,
                key: 'facilityName',
                width: 250,
                isShowSort: true,
                searchable: true,
                searchConfig: { type: 'input' }
            },
            {
                // 设施类型
                title: this.language.nodesDetails.facilityType,
                key: 'facilityType',
                width: 200,
                isShowSort: true,
                searchable: true,
                searchConfig: { type: 'input' },
                type: 'render',
                renderTemplate: this.statusTemp
            },
            {
                // 型号
                title: this.language.nodesDetails.model,
                key: 'model',
                width: 250,
                isShowSort: true,
                searchable: true,
                searchConfig: { type: 'input' }
            },
            {
                // 设备数量
                title: this.language.nodesDetails.numberOfEquipment,
                key: 'numberOfEquipment',
                width: 250,
                isShowSort: true,
                searchable: true,
                searchConfig: { type: 'input' }
            },
            {
                // 设施状态
                title: this.language.nodesDetails.facilityStatus,
                key: 'facilityStatus',
                width: 150,
                isShowSort: true,
                searchable: true,
                searchConfig: { type: 'input' }
            },
            {
                // 详细地址
                title: this.language.nodesDetails.detailedAddress,
                key: 'detailedAddress',
                width: 250,
                isShowSort: true,
                searchable: true,
                searchConfig: { type: 'input' }
            }
        ];
        // 采集设备

        // 采集回路
        this.tableConfig = {
            isDraggable: true,
            isLoading: false,
            scroll: { x: '1000px', y: '400px' },
            noIndex: true,
            columnConfig: tableCon,
            showPagination: false,
            showSearchSwitch: true,
            bordered: false,
            showSearch: false,
            showSearchExport: false,
            notShowPrint: true,
            operation: [],
            topButtons: [],
            // 右上角按钮
            rightTopButtons: [],
            // 过滤
            sort: (event: SortCondition) => {
                this.queryCondition.sortCondition.sortField = event.sortField;
                this.queryCondition.sortCondition.sortRule = event.sortRule;
                this.refreshData();
            },
            //   重置按钮
            handleSearch: (event: FilterCondition[]) => {
                this.queryCondition.pageCondition.pageNum = 1;
                this.queryCondition.filterConditions = event;
                this.refreshData();
            }
        };
    }
    refreshData() {}
}
