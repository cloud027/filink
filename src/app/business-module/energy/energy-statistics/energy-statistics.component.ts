import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import _ from 'lodash';

import { NzI18nService } from 'ng-zorro-antd';

import { LanguageEnum } from '../../../shared-module/enum/language.enum';
import { EnergyLanguageInterface } from '../../../../assets/i18n/energy/energy.language.interface';

import { TreeSelectorConfigModel } from '../../../shared-module/model/tree-selector-config.model';
import { statictisRangeTypeEnum } from '../share/enum/energy-config.enum';
import { CommonUtil } from '../../../shared-module/util/common-util';
import { ResultCodeEnum } from '../../../shared-module/enum/result-code.enum';
import { EnergyApiService } from '../share/service/energy/energy-api.service';

import { EnergyStatisticsQueryDataModel } from '../share/model/energy-statistic-query-data.model';

import { StatisticEchartsComponent } from './components/statistic-echarts/statistic-echarts.component';
import { AnalysisEchartsComponent } from './components/analysis-echarts/analysis-echarts.component';
import { FiLinkModalService } from '../../../shared-module/service/filink-modal/filink-modal.service';
import { FacilityForCommonUtil } from '../../../core-module/business-util/facility/facility-for-common.util';
import { FacilityForCommonService } from '../../../core-module/api-service/facility/facility-for-common.service';
import { AlarmLanguageInterface } from '../../../../assets/i18n/alarm/alarm-language.interface';
import { ResultModel } from '../../../shared-module/model/result.model';
import { AreaModel } from '../../../core-module/model/facility/area.model';
import { ProjectSelectorConfigModel } from '../../../shared-module/model/project-selector-config.model';


// tslint:disable-next-line: class-name
interface cardList {
    data: string;
    title: string;
    key: string;
    color: string;
}

@Component({
    selector: 'app-energy-statistics',
    templateUrl: './energy-statistics.component.html',
    styleUrls: ['./energy-statistics.component.scss'],
})
export class EnergyStatisticsComponent implements OnInit, OnDestroy {
    @ViewChild('statisticEcharts') statisticEcharts: StatisticEchartsComponent;
    @ViewChild('analysisEcharts') analysisEcharts: AnalysisEchartsComponent;
    // 能耗统计卡片
    energyStatisticsCardList: cardList[];
    // 统计范围下拉框
    energyStatisticsSelectRangeList: any = [];

    // 统计的时间范围下拉框数组
    statisticsSelectTimeList: any = [];

    // 统计项目
    energyProjectList = [];

    /** 传递给两个 Ecahrts组件 的条件 */
    searchContainer: any = [];

    /** 统计提交的数据 */
    submitData: EnergyStatisticsQueryDataModel = new EnergyStatisticsQueryDataModel();

    /** 统计范围的枚举 */
    statictisRangeType = statictisRangeTypeEnum;

    /** 重新渲染范围选择器 处理重置的时候出现的bug */
    selectFlag: boolean = true;

    // 区域选择器显示控制
    isVisible = false;
    // 区域树数据
    public treeNodes: AreaModel[];
    // 区域名称
    areaName = '';
    // 区域ids
    areaIds = [];
    // 区域树配置
    treeSelectorConfig: TreeSelectorConfigModel;

    /** 项目 ids */
    projectIds: string[] = [];
    // 项目选择器显示控制
    public projectSelectVisible: boolean = false;

    // 选择的项目
    public selectSelectProject: any = {};
    public checkProject: ProjectSelectorConfigModel = new ProjectSelectorConfigModel;
    public selectProjectName: string;

    // 统计按钮
    btnLoading: boolean = false;

    /** 判断是否是首次进入页面 */
    public isFirstPage: boolean = true;
    /** 传递给 table 的数据 */
    tranStatisticTableData;
    private treeNodesOriList = [];
    language: EnergyLanguageInterface;
    // 国际化
    public alarmLanguage: AlarmLanguageInterface;

    constructor(
        private $nzI18n: NzI18nService,
        private router: Router,
        private $energyApiService: EnergyApiService,
        public $message: FiLinkModalService,
        private $facilityForCommonService: FacilityForCommonService,
    ) {
        this.energyStatisticsSelectRangeList = CommonUtil.codeTranslate(
            statictisRangeTypeEnum,
            $nzI18n,
            null,
            'energy.config',
        );

    }

    ngOnInit() {
        this.language = this.$nzI18n.getLocaleData(LanguageEnum.energy);
        this.alarmLanguage = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
        this.init_queryTotalEnergy();
        // this.init_projectData();

        this.$facilityForCommonService.queryAreaList().subscribe((data) => {
            if (data.code === ResultCodeEnum.success) {
                // 递归设置区域的选择情况
                FacilityForCommonUtil.setAreaNodesStatus(data.data, null, null);
                this.treeNodes = data.data;
                this.addName(this.treeNodes);
                FacilityForCommonUtil.setAreaNodesMultiStatus(this.treeNodes, this.submitData.areaIds);
            }
            /** 页面初始进入 调用 请求接口 */
            this.statistical();
        });
        this.initTreeSelectorConfig();
    }

    ngOnDestroy() {
        this.analysisEcharts = null;
        this.statisticEcharts = null;
    }

    // 统计项目下拉框改变事件
    statisticProjectChange(value) {
        console.log(value, 'value');
        this.energyProjectList.forEach((item) => {
            if (item.projectId === value) { this.projectIds += item.projectName; }
        });
    }

    /** 初始化区域选择器 */
    initTreeSelectorConfig() {
        const treeSetting = {
            check: {
                enable: true,
                chkStyle: 'checkbox',
                chkboxType: { Y: '', N: '' },
            },
            data: {
                simpleData: {
                    enable: false,
                    idKey: 'areaId',
                },
                key: {
                    name: 'areaName',
                    children: 'children',
                },
            },
            view: {
                showIcon: false,
                showLine: false,
            },
        };
        this.treeSelectorConfig = {
            title: this.alarmLanguage.selectArea,
            width: '1000px',
            height: '300px',
            treeNodes: this.treeNodes,
            treeSetting: treeSetting,
            onlyLeaves: false,
            selectedColumn: [
                {
                    title: this.alarmLanguage.areaNames,
                    key: 'areaName',
                    width: 100,
                },
                {
                    title: this.alarmLanguage.areaLevel,
                    key: 'areaLevel',
                    width: 100,
                },
            ],
        };
    }
    /** 打开区域选择器 */
    showAreaSelect() {
        if (this.treeNodes && this.treeNodes.length) {
            this.treeSelectorConfig.treeNodes = this.treeNodes;
            this.isVisible = true;
        } else {
            this.getAreaData().then(() => {
                this.treeSelectorConfig.treeNodes = this.treeNodes;
                this.isVisible = true;
            });
        }
    }
    /**
     * 获取区域数据
     */
    public getAreaData(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.$facilityForCommonService.queryAreaList().subscribe(
                (result: ResultModel<AreaModel[]>) => {
                    if (result.code === ResultCodeEnum.success) {
                        const data = result.data;
                        // 递归设置区域的选择情况
                        FacilityForCommonUtil.setAreaNodesStatus(data, null, null);
                        this.treeNodes = data;
                        this.addName(this.treeNodes);
                        this.areaListRecursive(this.treeNodes);
                        resolve();
                    } else {
                        reject();
                    }
                },
                () => {
                    reject();
                },
            );
        });
    }
    /**
     * 扁平化区域数据
     * param list
     */
    areaListRecursive(list) {
        list.forEach((item) => {
            this.treeNodesOriList.push(item);
            if (item.children) {
                this.areaListRecursive(item.children);
            }
        });
    }
    // 区域选择 弹出框 点击确认按钮
    selectDataChange(event) {
        let selectArr = [];
        const areaNameList = [];
        if (event.length > 0) {
            selectArr = event.map((item) => {
                areaNameList.push(item.areaName);
                return item.areaId;
            });
            this.areaName = areaNameList.join();
        } else {
            this.areaName = '';
        }
        this.submitData.areaIds = selectArr;
        FacilityForCommonUtil.setAreaNodesMultiStatus(this.treeNodes, selectArr);
    }
    addName(data) {
        const areaNameList = [];
        data.forEach((item) => {
            item.id = item.areaId;
            item.value = item.areaId;
            item.areaLevel = item.level;
            this.submitData.areaIds.push(item.areaId);
            areaNameList.push(item.areaName);
            if (item.children && item.children) {
                this.addName(item.children);
            }
        });
        this.areaName = areaNameList.join();
    }
    /** 获取头部 card-list */
    init_queryTotalEnergy() {
        this.$energyApiService.queryTotalEnergy_API().subscribe((result) => {
            if (result.code === ResultCodeEnum.success) {
                if (result.data) {
                    this.energyStatisticsCardList = result.data.map((item) => {
                        return {
                            title: `${item.statisticsType}EnergyConsumption`,
                            data: item.energyConsumption.toFixed(2),
                            color: `${item.statisticsType}-color`,
                        };
                    });
                }
            }
        });
    }
    /** 获取所属项目 */
    init_projectData() {
        this.$energyApiService.getProjectList_API().subscribe((result) => {
            if (result.code === ResultCodeEnum.success) {
                if (result.data) {
                    this.energyProjectList = result.data.map((item) => {
                        return {
                            label: item.projectName,
                            value: item.projectId,
                        };
                    });
                }
            }
        });
    }

    disabledResources() {
        let disabled: boolean = false;
        if (
            (this.submitData.scope === statictisRangeTypeEnum.statisticsRegion &&
                this.submitData.areaIds.length > 0) ||
            (this.submitData.scope === statictisRangeTypeEnum.statisticsProject &&
                this.submitData.projects.length > 0 &&
                this.statisticEcharts.timeSelectISValue())
        ) {
            disabled = false;
        } else { disabled = true; }
        return disabled;
    }

    /** 统计按钮 */
    statistical() {
        if (this.disabledResources() && !this.isFirstPage) {
            return this.$message.warning(this.language.picInfo.pleacrChooseTimeRange);
        }
        this.statisticEcharts.statistical();
        this.analysisEcharts.EchartsAnalysis();
        this.isFirstPage = false;
    }

    /** 重置按钮 */
    resetBtn() {
        this.submitData.scope = null;
        this.submitData.projects = [];
        this.submitData.areaIds = [];
        this.areaName = null;
        this.areaIds = [];
        this.selectProjectName = ''
        this.selectSelectProject = {};

        FacilityForCommonUtil.setAreaNodesMultiStatus(this.treeNodes, []);
        this.selectFlag = false;
        this.analysisEcharts.EchartsResetBtn();
        this.statisticEcharts.resetBtn();
        setTimeout(() => {
            this.selectFlag = true;
        });
    }

    /** 接收 app-statistic-echarts 的 排名数据 */
    statisticRankData(event) {
        this.tranStatisticTableData = { data: event, type: this.submitData.scope };
    }

    powerRateBtn() {
        this.router.navigateByUrl('/business/energy/energy-statistics/electric-strategy');
    }

    /** 打开项目选择器 */
    showProjectSelect() {
        this.projectSelectVisible = true;
    }

    /**
 * 项目选择器结果
 * param data
 */
    public projectSelectChange(data): void {
        console.log(data, 'data');
        if (data && data.length > 0) {
            this.selectSelectProject = data;
            /*this.checkProject = new ProjectSelectorConfigModel(
                data.map(v => v.projectName).join(',') || '',  data.map(v => v.projectId) || [])
            data.forEach(i => { this.submitData.projects.push(i.projectId) });
            this.selectProjectName = this.checkProject.projectName*/
        } else {
            this.selectProjectName = ''
            this.selectSelectProject = data;
            this.checkProject = new ProjectSelectorConfigModel()
            this.submitData.projects = [];
        }
    }
}
