import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    TemplateRef,
    ViewChild
} from '@angular/core';
import { FormItem } from '../../../../../../shared-module/component/form/form-config';
import { CommonUtil } from '../../../../../../shared-module/util/common-util';
import * as _ from 'lodash';
import { NzI18nService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { FormOperate } from '../../../../../../shared-module/component/form/form-operate.service';
import { ResultCodeEnum } from '../../../../../../shared-module/enum/result-code.enum';
import { EnergyLanguageInterface } from '../../../../../../../assets/i18n/energy/energy.language.interface';
import { strategyList } from '../../../../const';
import { LanguageEnum } from '../../../../../../shared-module/enum/language.enum';
import { RuleUtil } from '../../../../../../shared-module/util/rule-util';

import { CommonLanguageInterface } from '../../../../../../../assets/i18n/common/common.language.interface';
import { AssetManagementLanguageInterface } from '../../../../../../../assets/i18n/asset-manage/asset-management.language.interface';

import { TreeSelectorConfigModel } from '../../../../../../shared-module/model/tree-selector-config.model';
import { EquipmentAddInfoModel } from '../../../../../../core-module/model/equipment/equipment-add-info.model';
import { statictisRangeTypeEnum } from '../../../../share/enum/energy-config.enum';
import { EnergyApiService } from '../../../../share/service/energy/energy-api.service';
import { StrategyListModel } from '../../../../share/model/electric-strategy-model';
import { FacilityForCommonUtil } from '../../../../../../core-module/business-util/facility/facility-for-common.util';
import { FacilityForCommonService } from '../../../../../../core-module/api-service/facility/facility-for-common.service';
import { ResultModel } from '../../../../../../shared-module/model/result.model';
import { AreaModel } from '../../../../../../core-module/model/facility/area.model';

@Component({
    selector: 'app-basic-info',
    templateUrl: './basic-info.component.html',
    styleUrls: ['./basic-info.component.scss']
})
export class BasicInfoComponent implements OnInit {
    // ??????
    @ViewChild('areaSelector') areaSelectorTemp: TemplateRef<any>;
    // ??????
    @ViewChild('projectSelect') projectSelect: TemplateRef<any>;
    // ???????????????????????????
    @Input() basicInfo: string;
    @Input() linkageType: boolean = false;
    // ??????form??????
    @Input() setpsComponentInfo: StrategyListModel;
    // ????????????????????????
    @Input()
    public isScope: boolean = false;
    @Output()
    private formValid = new EventEmitter<boolean>();
    // ????????????
    @Output() public getExtraRequest = new EventEmitter<EquipmentAddInfoModel>();

    // form????????????
    public formColumn: FormItem[];
    // form??????
    public formStatus: FormOperate;
    /** ????????? list */
    projectSelectList: any[] = [];
    // ????????????
    public strategyStatus: boolean = false;
    // ?????????????????????
    public isDisabled: boolean = false;

    // ?????????????????????????????????
    public areaSelectVisible: boolean = false;
    // ???????????????
    treeNodes;
    // ??????ids
    areaIds = [];
    // ???????????????
    treeSelectorConfig: TreeSelectorConfigModel;

    // ????????????
    projectList = [];

    // ???????????????
    public language: EnergyLanguageInterface;
    // ??????id
    public strategyId: string = '';
    public languageEnum = LanguageEnum;
    public commonLanguage: CommonLanguageInterface;
    // ?????????????????????
    public assetsLanguage: AssetManagementLanguageInterface;
    strategyType = strategyList;
    // ?????????????????????flag
    private isFirstEnter: boolean = false;
    constructor(
        // ?????????
        private $nzI18n: NzI18nService,
        // ??????
        public $router: Router,
        // ??????
        private $ruleUtil: RuleUtil,
        private $energyApiService: EnergyApiService,
        private $facilityForCommonService: FacilityForCommonService
    ) {}
    ngOnInit() {
        // ?????????
        this.language = this.$nzI18n.getLocaleData(LanguageEnum.energy);
        this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
        this.assetsLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);
        // ??????????????????????????????????????????
        this.handelInit();
    }
    /**
     * ????????????????????????????????????????????????????????????
     */
    private handelInit(): void {
        // ???????????????
        this.initTreeSelectorConfig();
        // ???????????????
        this.initColumn();
    }
    /** ??????????????? */
    private initColumn(): void {
        this.formColumn = [
            // ??????????????????
            {
                label: this.language.basicInfoForm.tariffStrategyName,
                key: 'strategyName',
                type: 'input',
                require: true,
                rule: [{ required: true }, { maxLength: 64 }],
                asyncRules: []
            },
            // ????????????
            {
                label: this.language.basicInfoForm.scopeOfApplication,
                key: 'scope',
                type: 'select',
                selectInfo: {
                    data: CommonUtil.codeTranslate(
                        statictisRangeTypeEnum,
                        this.$nzI18n,
                        null,
                        'energy.config'
                    ),
                    label: 'label',
                    value: 'code'
                },
                require: true,
                rule: [{ required: true }],
                asyncRules: [],
                modelChange: (controls, $event) => {
                    this.handelTypeProjectChange($event);
                }
            },
            // ??????
            {
                label: this.language.basicInfoForm.region,
                key: 'area',
                type: 'custom',
                hidden: true,
                require: true,
                rule: [{ required: true }],
                asyncRules: [],
                template: this.areaSelectorTemp
            },
            // ??????
            {
                label: this.language.basicInfoForm.project,
                key: 'project',
                type: 'select',
                selectType: 'multiple',
                hidden: true,
                selectInfo: {
                    data: [],
                    label: 'projectName',
                    value: 'projectId'
                },
                require: true,
                rule: [{ required: true }],
                asyncRules: []
            },
            // ??????
            {
                label: this.language.basicInfoForm.remarks,
                disabled: false,
                key: 'remarks',
                type: 'textarea',
                rule: [this.$ruleUtil.getRemarkMaxLengthRule(), this.$ruleUtil.getNameRule()]
            }
        ];
    }

    formInstance(event: { instance: FormOperate }) {
        this.formStatus = event.instance;
        // ??????????????????
        const projectIdCol: FormItem = this.formStatus.getColumn('project').item;
        this.$energyApiService.getProjectList_API().subscribe((result) => {
            if (result.code === ResultCodeEnum.success) {
                if (result.data) {
                    projectIdCol.selectInfo.data = result.data || [];
                }
            }
        });

        this.formStatus.group.statusChanges.subscribe(() => {
            this.formValid.emit(this.formStatus.getRealValid());
        });
    }
    /** ????????????????????????????????? */
    private setColumnHidden(key: string, value: boolean): void {
        const formColumn = this.formColumn.find((item) => item.key === key);
        if (formColumn) {
            formColumn.hidden = value;
        }
    }
    /** ?????? ???????????? ??????????????????????????? */
    private resetData(key: string): void {
        this.formStatus.resetControlData(key, null);
    }

    /** ???????????? ????????????????????? */
    private handelTypeProjectChange(typeCode: statictisRangeTypeEnum): void {
        console.log(typeCode, 'typeCode');
        this.setColumnHidden('project', typeCode === statictisRangeTypeEnum.statisticsRegion);
        this.setColumnHidden('area', typeCode === statictisRangeTypeEnum.statisticsProject);
        this.resetData(typeCode === statictisRangeTypeEnum.statisticsRegion ? 'area' : 'project');
        this.setpsComponentInfo.areaIds = [];
        this.setpsComponentInfo.areaName = '';
    }

    /** ?????????????????? */
    public onClickShowArea(): void {
        this.treeSelectorConfig.treeNodes = this.treeNodes;
        this.areaSelectVisible = true;
    }

    // ????????????????????????
    initTreeSelectorConfig() {
        this.$facilityForCommonService
            .queryAreaList()
            .subscribe((res: ResultModel<AreaModel[]>) => {
                // ?????????????????????????????????
                FacilityForCommonUtil.setAreaNodesStatus(res.data, null, null);
                this.treeNodes = res.data;
            });
        const treeSetting = {
            check: {
                enable: true,
                chkStyle: 'checkbox',
                chkboxType: { Y: '', N: '' }
            },
            data: {
                simpleData: {
                    enable: false,
                    idKey: 'areaId'
                },
                key: {
                    name: 'areaName',
                    children: 'children'
                }
            },
            view: {
                showIcon: false,
                showLine: false
            }
        };
        this.treeSelectorConfig = {
            title: this.language.selectArea,
            width: '1000px',
            height: '300px',
            treeNodes: this.treeNodes,
            treeSetting: treeSetting,
            onlyLeaves: false,
            selectedColumn: [
                {
                    title: this.language.areaNames,
                    key: 'areaName',
                    width: 100
                },
                {
                    title: this.language.areaLevel,
                    key: 'areaLevel',
                    width: 100
                }
            ]
        };
    }
    // ???????????? ????????? ??????????????????
    selectDataChange(event) {
        let selectArr = [];
        const areaNameList = [];
        if (event.length > 0) {
            selectArr = event.map((item) => {
                areaNameList.push(item.areaName);
                return item.areaId;
            });
            this.setpsComponentInfo.areaName = areaNameList.join();
        } else {
            this.setpsComponentInfo.areaName = '';
        }
        this.setpsComponentInfo.areaIds = selectArr;
        FacilityForCommonUtil.setAreaNodesMultiStatus(this.treeNodes, selectArr);
        this.formStatus.resetControlData('area', true);
    }
    addName(data) {
        data.forEach((item) => {
            item.id = item.areaId;
            item.value = item.areaId;
            this.setpsComponentInfo.areaIds.push(item.areaId);
            this.setpsComponentInfo.areaName += item.areaName + ',';
            if (item.children && item.children) {
                this.addName(item.children);
            }
        });
    }

    /** ?????????????????? */
    onSelectedProjectChange(event) {}
    /**
     * ?????????
     */
    public handNextSteps() {
        const data = this.formStatus.group.getRawValue();
        this.setpsComponentInfo.tariffStrategyName = data.strategyName;
        this.setpsComponentInfo.scope = data.scope;
        this.setpsComponentInfo.projects = data.project;
    }
}
