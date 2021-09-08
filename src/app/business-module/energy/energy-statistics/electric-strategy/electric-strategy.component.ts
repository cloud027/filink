import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzI18nService } from 'ng-zorro-antd';

import { LanguageEnum } from '../../../../shared-module/enum/language.enum';
import { EnergyLanguageInterface } from '../../../../../assets/i18n/energy/energy.language.interface';
import { CommonLanguageInterface } from '../../../../../assets/i18n/common/common.language.interface';
import { TableConfigModel } from '../../../../shared-module/model/table-config.model';
import { PageModel } from '../../../../shared-module/model/page.model';
import {
    FilterCondition,
    QueryConditionModel,
    SortCondition
} from '../../../../shared-module/model/query-condition.model';
import { ExportRequestModel } from '../../../../shared-module/model/export-request.model';
import { OperatorEnum } from '../../../../shared-module/enum/operator.enum';

@Component({
    selector: 'app-electric-strategy',
    templateUrl: './electric-strategy.component.html',
    styleUrls: ['./electric-strategy.component.scss']
})
export class ElectricStrategyComponent implements OnInit {
    language: EnergyLanguageInterface;
    // 通用的提示语句 国际化组件
    private commonLanguage: CommonLanguageInterface;
    dataSet = [{
        energyConsumptionName: 'ceshi',
        remarks: '1222'
    }];
    // 表格配置
    public tableConfig: TableConfigModel;
    // 表格翻页对象
    public pageBean: PageModel = new PageModel();
    // 查询条件
    private queryCondition: QueryConditionModel = new QueryConditionModel();

    constructor(private $nzI18n: NzI18nService, private router: Router) {
        this.commonLanguage = $nzI18n.getLocaleData(LanguageEnum.common);
    }

    ngOnInit() {
        this.language = this.$nzI18n.getLocaleData(LanguageEnum.energy);
        this.initTableConfig();
    }

    // 初始化表格配置
    private initTableConfig(): void {
        this.tableConfig = {
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
                {
                    type: 'select',
                    fixedStyle: { fixedLeft: true, style: { left: '0px' } },
                    width: 62
                },
                {
                    type: 'serial-number',
                    width: 62,
                    title: this.language.serialNumber,
                    fixedStyle: { fixedLeft: true, style: { left: '62px' } }
                },
                {
                    // 名称
                    title: this.language.energyConsumptionName,
                    key: 'energyConsumptionName',
                    width: 150,
                    fixedStyle: { fixedLeft: true, style: { left: '124px' } },
                    isShowSort: true,
                    searchable: true,
                    searchConfig: { type: 'input' }
                },
                {
                    // 备注
                    title: this.language.remarks,
                    key: 'remarks',
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    hidden: true,
                    width: 150,
                    searchConfig: { type: 'input' }
                },
                {
                    title: this.language.operate,
                    searchable: true,
                    searchConfig: { type: 'operate' },
                    key: '',
                    width: 210,
                    fixedStyle: { fixedRight: true, style: { right: '0px' } }
                }
            ],
            showPagination: true,
            bordered: false,
            showSearch: false,
            topButtons: [
                {
                    // 新增
                    text: this.language.add,
                    iconClassName: 'fiLink-add-no-circle',
                    handle: () => {
                        this.router
                            .navigate([
                                'business/energy/energy-statistics/electric-strategy/electric-strategy-insert'
                            ])
                            .then();
                    }
                },
                {
                    // 删除
                    text: this.commonLanguage.deleteBtn,
                    btnType: 'danger',
                    needConfirm: true,
                    canDisabled: true,
                    className: 'table-top-delete-btn',
                    iconClassName: 'fiLink-delete',
                    confirmContent: this.language.deleteFacilityMsg,
                    handle: (currentIndex) => {
                        this.deleteDeviceByIds([currentIndex.deviceId]);
                    }
                }
            ],
            operation: [
                // 详情
                {
                    text: this.language.viewDetail,
                    className: 'fiLink-view-detail',
                    handle: (currentIndex) => {
                        this.router.navigate(
                            [
                                'business/energy/energy-statistics/electric-strategy/electric-strategy-info'
                            ],
                            {
                                queryParams: {
                                    id: currentIndex.deviceId,
                                    deviceType: currentIndex._deviceType,
                                    serialNum: currentIndex.serialNum
                                }
                            }
                        );
                    },
                    permissionCode: '03-1-5'
                },
                // 编辑
                {
                    text: this.language.updateHandle,
                    permissionCode: '03-1-3',
                    className: 'fiLink-edit',
                    handle: (currentIndex) => {
                        this.router.navigate(
                            [
                                'business/energy/energy-statistics/electric-strategy/electric-strategy-update'
                            ],
                            {
                                queryParams: { id: currentIndex.deviceId }
                            }
                        );
                    }
                },
                {
                    // 删除设施
                    text: this.language.deleteHandle,
                    className: 'fiLink-delete red-icon',
                    permissionCode: '03-1-4',
                    btnType: 'danger',
                    iconClassName: 'fiLink-delete',
                    needConfirm: true,
                    canDisabled: false,
                    confirmContent: this.language.deleteElectricStrategrMsg,
                    handle: (currentIndex) => {
                        this.deleteDeviceByIds([currentIndex.deviceId]);
                    }
                }
            ],
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
    pageChange(value) {}
    deleteDeviceByIds(ids: string[]) {}
}
