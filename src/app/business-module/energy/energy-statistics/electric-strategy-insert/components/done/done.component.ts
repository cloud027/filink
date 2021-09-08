import { Component, OnInit, Input } from '@angular/core';
import { NzI18nService } from 'ng-zorro-antd';
import { LanguageEnum } from '../../../../../../shared-module/enum/language.enum';
import { EnergyLanguageInterface } from '../../../../../../../assets/i18n/energy/energy.language.interface';
import { CommonLanguageInterface } from '../../../../../../../assets/i18n/common/common.language.interface';
import { TableConfigModel } from '../../../../../../shared-module/model/table-config.model';
import {
    FilterCondition,
    QueryConditionModel,
    SortCondition
} from '../../../../../../shared-module/model/query-condition.model';
@Component({
    selector: 'app-done',
    templateUrl: './done.component.html',
    styleUrls: ['./done.component.scss']
})
export class DoneComponent implements OnInit {
    @Input() setpsComponentInfo;
    strategyTableSet = [];
    // 表格配置
    public strategyTableConfig: TableConfigModel;
    // 列表查询条件
    public queryCondition: QueryConditionModel = new QueryConditionModel();
    language: EnergyLanguageInterface;
    // 通用的提示语句 国际化组件
    private commonLanguage: CommonLanguageInterface;
    constructor(private $nzI18n: NzI18nService) {
        this.commonLanguage = $nzI18n.getLocaleData(LanguageEnum.common);
    }

    ngOnInit() {
        this.language = this.$nzI18n.getLocaleData(LanguageEnum.energy);
        this.initTableConfig();
    }
    // 初始化表格配置
    private initTableConfig(): void {
        this.strategyTableConfig = {
            isDraggable: true,
            isLoading: false,
            showSearchSwitch: false,
            showSizeChanger: true,
            scroll: { x: '1800px', y: '600px' },
            noIndex: true,
            notShowPrint: true,
            columnConfig: [
                // 区域名称
                {
                    title: this.language.doneComponent.areaName,
                    isShowSort: true,
                    key: 'areaName',
                    width: 300
                },
                // 所属区域
                {
                    title: this.language.doneComponent.region,
                    isShowSort: true,
                    key: 'region',
                    width: 300
                },
                // 区域级别
                {
                    title: this.language.doneComponent.regionalLevel,
                    isShowSort: true,
                    key: 'regionalLevel',
                    width: 100
                },
                // 详细地址
                {
                    title: this.language.doneComponent.detailedAddress,
                    isShowSort: true,
                    key: 'detailedAddress',
                    width: 300
                },
                // 责任单位
                {
                    title: this.language.doneComponent.responsibleUnit,
                    isShowSort: true,
                    key: 'responsibleUnit',
                    width: 300
                },
                // 备注
                {
                    title: this.language.doneComponent.remarks,
                    isShowSort: true,
                    key: 'remarks',
                    width: 300
                }
            ],
            showPagination: true,
            bordered: false,
            showSearch: false,
            topButtons: [],
            operation: [],
            rightTopButtons: [],
            sort: (event: SortCondition) => {
                this.queryCondition.sortCondition.sortField = event.sortField;
                this.queryCondition.sortCondition.sortRule = event.sortRule;
                this.refreshData();
            },
            handleSearch: (event: FilterCondition[]) => {
                this.queryCondition.pageCondition.pageNum = 1;
                this.queryCondition.filterConditions = event;
                this.refreshData();
            }
        };
    }
    refreshData() {}
}
