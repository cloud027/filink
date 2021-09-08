import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { EquipmentListModel } from '../../../share/model/equipment.model';
import { PageModel } from '../../../../../shared-module/model/page.model';
import { TableConfigModel } from '../../../../../shared-module/model/table-config.model';
import {
    FilterCondition,
    QueryConditionModel,
    SortCondition
} from '../../../../../shared-module/model/query-condition.model';
import { ApplicationInterface } from '../../../../../../assets/i18n/application/application.interface';
import { LanguageEnum } from '../../../../../shared-module/enum/language.enum';
import { NzI18nService, NzModalService } from 'ng-zorro-antd';
import { FacilityLanguageInterface } from '../../../../../../assets/i18n/facility/facility.language.interface';
import {
    EquipmentStatusEnum,
    EquipmentTypeEnum
} from '../../../../../core-module/enum/equipment/equipment.enum';
import { FacilityForCommonUtil } from '../../../../../core-module/business-util/facility/facility-for-common.util';
import { IndexLanguageInterface } from '../../../../../../assets/i18n/index/index.language.interface';
import { MapStoreService } from '../../../../../core-module/store/map.store.service';
import { MapCoverageService } from '../../../../../shared-module/service/index/map-coverage.service';
import { PositionService } from '../../../share/service/position.service';
import { FiLinkModalService } from '../../../../../shared-module/service/filink-modal/filink-modal.service';

@Component({
    selector: 'app-monitor-follow',
    templateUrl: './monitor-follow.component.html',
    styleUrls: ['./monitor-follow.component.scss']
})
export class MonitorFollowComponent implements OnInit {
    // 设备类型
    @ViewChild('equipmentTypeTemp') equipmentTypeTemp: TemplateRef<HTMLDocument>;
    // 列表数据
    public dataSet = [];
    // 设备列表分页
    public pageBean: PageModel = new PageModel(5, 1, 0);
    // 设备列表表格配置
    public tableConfig: TableConfigModel;
    // 设备类型枚举
    public equipmentTypeEnum = EquipmentTypeEnum;
    // 设备状态集合
    public equipmentTypeList = [];
    // 设备查询条件
    public queryCondition: QueryConditionModel = new QueryConditionModel();
    // 国际化
    public language: ApplicationInterface;
    // 设施语言包
    public equipmentLanguage: FacilityLanguageInterface;
    // 国际化前缀枚举
    public languageEnum = LanguageEnum;
    public indexLanguage: IndexLanguageInterface;

    constructor(
        private $nzI18n: NzI18nService,
        private $modalService: NzModalService,
        private $mapStoreService: MapStoreService,
        private $mapCoverageService: MapCoverageService,
        private $positionService: PositionService,
        private $message: FiLinkModalService
    ) {}

    ngOnInit() {
        this.language = this.$nzI18n.getLocaleData(LanguageEnum.application);
        this.equipmentLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
        this.indexLanguage = this.$nzI18n.getLocaleData('index');
        this.initTableConfig();
    }
    // 初始化表格配置
    private initTableConfig(): void {
        this.equipmentTypeList = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n).filter(
            (item) => item.code === 'E013'
        );
        this.tableConfig = {
            isDraggable: true,
            isLoading: false,
            notShowPrint: true,
            simplePageTotalShow: true,
            showSearchSwitch: false,
            showRowSelection: false,
            showSizeChanger: true,
            showSearchExport: false,
            searchReturnType: 'object',
            scroll: { x: '600', y: '400px' },
            noIndex: true,
            showPagination: true,
            simplePage: true,
            bordered: false,
            showSearch: true,
            columnConfig: [
                {
                    // 名称
                    title: this.language.strategyList.alarmDeviceName,
                    key: 'equipmentName',
                    width: 100,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' }
                },
                {
                    // 资产编码
                    title: this.equipmentLanguage.deviceCode,
                    key: 'equipmentCode',
                    width: 100,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: { type: 'input' }
                },
                {
                    // 类型
                    title: this.equipmentLanguage.type,
                    key: 'equipmentType',
                    isShowSort: true,
                    type: 'render',
                    searchable: true,
                    renderTemplate: this.equipmentTypeTemp,
                    searchConfig: {
                        type: 'select',
                        selectType: 'multiple',
                        selectInfo: this.equipmentTypeList,
                        label: 'label',
                        value: 'code'
                    }
                },
                {
                    title: this.equipmentLanguage.operate,
                    searchable: true,
                    searchConfig: { type: 'operate' },
                    key: '',
                    width: 80,
                    fixedStyle: { fixedRight: true, style: { right: '0px' } }
                }
            ],
            topButtons: [],
            // 更多操作
            moreButtons: [],
            operation: [
                {
                    // 定位
                    text: this.indexLanguage.location,
                    permissionCode: '',
                    className: 'fiLink-location',
                    handle: (currentIndex) => {
                        let by: boolean = false;
                        if (
                            this.$mapStoreService.showFacilityTypeSelectedResults &&
                            this.$mapStoreService.showFacilityTypeSelectedResults.length
                        ) {
                            this.$mapStoreService.showFacilityTypeSelectedResults.forEach(
                                (item) => {
                                    console.log(item);
                                    if (item === currentIndex.cloneDeviceType) {
                                        by = true;
                                    }
                                }
                            );
                            if (this.$mapCoverageService.showCoverage === 'facility') {
                                if (by) {
                                    this.$positionService.eventEmit.emit(currentIndex);
                                } else {
                                    this.$message.warning('当前设施类型不存在地图分层类型之中');
                                }
                            } else {
                                this.$message.warning(
                                    this.indexLanguage.theCurrentLayerIsAEquipmentLayer
                                );
                            }
                        }
                    }
                },
                {
                    // 取消关注
                    text: this.indexLanguage.unsubscribe,
                    permissionCode: '',
                    needConfirm: true,
                    confirmContent: this.language.MonitorWorkbench.cancelFollow,
                    className: 'fiLink-collected red-icon',
                    handle: (currentIndex) => {
                        const data = {
                            deviceId: currentIndex.deviceId
                        };
                        // this.$indexApiService
                        //     .deviceDelCollectingById(data)
                        //     .subscribe((result: ResultModel<any>) => {
                        //         if (result.code === ResultCodeEnum.success) {
                        //             this.$message.success('取消关注成功！')
                        //             this.getFacilityListTable()
                        //         }
                        //     })
                    }
                }
            ],
            // 排序
            sort: (event: SortCondition) => {
                this.queryCondition.sortCondition.sortField = event.sortField;
                this.queryCondition.sortCondition.sortRule = event.sortRule;
                this.refreshData();
            },
            // 搜索
            handleSearch: (event: FilterCondition[]) => {
                this.queryCondition.pageCondition.pageNum = 1;
                this.queryCondition.filterConditions = event;
                this.refreshData();
            }
        };
    }

    // 表格分页
    pageChange(event) {
        this.queryCondition.pageCondition.pageNum = event.pageIndex;
        this.queryCondition.pageCondition.pageSize = event.pageSize;
        this.refreshData();
    }
    refreshData() {}
}
