import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzI18nService, NzModalService } from 'ng-zorro-antd';
import { CommonLanguageInterface } from '../../../../../assets/i18n/common/common.language.interface';
import { EnergyLanguageInterface } from '../../../../../assets/i18n/energy/energy.language.interface';
import { LanguageEnum } from '../../../../shared-module/enum/language.enum';
import { ExportRequestModel } from '../../../../shared-module/model/export-request.model';
import {
    FilterCondition,
    QueryConditionModel,
    SortCondition
} from '../../../../shared-module/model/query-condition.model';
import { TableConfigModel } from '../../../../shared-module/model/table-config.model';
import { OperatorEnum } from '../../../../shared-module/enum/operator.enum';

@Component({
    selector: 'app-electric-strategy-info',
    templateUrl: './electric-strategy-info.component.html',
    styleUrls: ['./electric-strategy-info.component.scss']
})
export class ElectricStrategyInfoComponent implements OnInit {
    strategyInfoData = {
        startTime: new Date(),
        endTime: new Date()
    };
    strategyTableSet = [];
    // 表格配置
    public strategyTableConfig: TableConfigModel;
    // 列表查询条件
    public queryCondition: QueryConditionModel = new QueryConditionModel();
    language: EnergyLanguageInterface;
    // 通用的提示语句 国际化组件
    private commonLanguage: CommonLanguageInterface;
    constructor(
        private $nzI18n: NzI18nService,
        private $modalService: NzModalService,
        private router: Router
    ) {
        this.commonLanguage = $nzI18n.getLocaleData(LanguageEnum.common);
    }

    ngOnInit() {
        this.language = this.$nzI18n.getLocaleData(LanguageEnum.energy);
        this.initTableConfig();
    }
    // 删除操作
    public handleDelete(): void {
        this.$modalService.confirm({
            nzTitle: this.language.strategyInfo.deleteHandle,
            nzContent: `<span>${this.language.strategyInfo.confirmDelete}?</span>`,
            nzOkText: this.commonLanguage.cancel,
            nzOkType: 'danger',
            nzMaskClosable: false,
            nzOnOk: () => {
                console.log(123, '123');
            },
            nzCancelText: this.commonLanguage.confirm,
            nzOnCancel: () => console.log(123444, '123')
        });
    }
    // 编辑
    handleEdit() {
        this.router.navigate(
            ['/business/energy/energy-statistics/electric-strategy/electric-strategy-update'],
            { queryParams: { id: 11111 } }
        ).then();
    }
    // 初始化表格配置
    private initTableConfig(): void {
        this.strategyTableConfig = {
            isDraggable: true,
            isLoading: false,
            outHeight: 108,
            showSizeChanger: true,
            showSearchSwitch: true,
            primaryKey: '03-1',
            scroll: { x: '1804px', y: '340px' },
            noIndex: true,
            showSearchExport: true,
            columnConfig: [
                // 区域名称
                {
                    title: this.language.strategyInfo.areaName,
                    searchConfig: { type: 'input' },
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    key: 'areaName',
                    width: 300
                },
                // 所属区域
                {
                    title: this.language.strategyInfo.region,
                    searchConfig: { type: 'input' },
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    key: 'region',
                    width: 300
                },
                // 区域级别
                {
                    title: this.language.strategyInfo.regionalLevel,
                    searchConfig: { type: 'input' },
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    key: 'regionalLevel',
                    width: 100
                },
                // 详细地址
                {
                    title: this.language.strategyInfo.detailedAddress,
                    searchConfig: { type: 'input' },
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    key: 'detailedAddress',
                    width: 300
                },
                // 责任单位
                {
                    title: this.language.strategyInfo.responsibleUnit,
                    searchConfig: { type: 'input' },
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    key: 'responsibleUnit',
                    width: 300
                },
                // 备注
                {
                    title: this.language.strategyInfo.remarks,
                    searchConfig: { type: 'input' },
                    configurable: true,
                    searchable: true,
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
            },
            handleExport: (event) => {
                // 处理参数
                const body = new ExportRequestModel(
                    event.columnInfoList,
                    event.excelType,
                    new QueryConditionModel()
                );
                body.columnInfoList.forEach((item) => {
                    // 安装时间需要转换字段，后台方便处理
                    // if (item.propertyName === 'installationDate') {
                    //     item.propertyName = 'instDate'
                    // }
                    // if (
                    //     ['instDate', 'businessStatus', 'deviceType', 'deviceStatus', 'deployStatus'].includes(
                    //         item.propertyName
                    //     )
                    // ) {
                    //     // 后台处理字段标示
                    //     item.isTranslation = IS_TRANSLATION_CONST
                    // }
                });
                // 处理选择的项目
                if (event.selectItem.length > 0) {
                    const ids = event.selectItem.map((item) => item.deviceId);
                    const filter = new FilterCondition('deviceId', OperatorEnum.in, ids);
                    body.queryCondition.filterConditions.push(filter);
                } else {
                    // 处理查询条件
                    body.queryCondition.filterConditions = event.queryTerm;
                }
                // this.$facilityService.exportDeviceList(body).subscribe((res: Result) => {
                //     if (res.code === 0) {
                //         this.$message.success(this.language.exportFacilitySuccess)
                //     } else {
                //         this.$message.error(res.msg)
                //     }
                // })
            }
        };
    }
    refreshData() {}
}
