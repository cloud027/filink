import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {NzI18nService} from 'ng-zorro-antd';
import {CodingStandardApiService} from '../../share/service/coding-standard/coding-standard-api.service';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {FinalValueEnum} from '../../../../core-module/enum/step-final-value.enum';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {CodingStandardSecondInfoModel} from '../../share/model/coding-standard-info.model';
import {AssetEntryDateRange, OptionalFieldCustomizeEnum, OptionalFieldEnum} from '../../share/enum/coding-standard.enum';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import * as _ from 'lodash';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';

@Component({
    selector: 'app-new-coding-step-second',
    templateUrl: './new-coding-step-second.component.html',
    styleUrls: ['./new-coding-step-second.component.scss']
})
export class NewCodingStepSecondComponent implements OnInit, OnChanges {
    // 编码内容模版
    @ViewChild('codingContentTemp') public codingContentTemp: TemplateRef<HTMLDocument>;
    // 编码示例模版
    @ViewChild('codingExampleTemp') public codingExampleTemp: TemplateRef<HTMLDocument>;
    // 新增编码当前执行步骤
    @Input() public isActiveSteps = FinalValueEnum.STEPS_FIRST;
    // 第二步表单的值回显
    @Input() public formValue;
    // 第二步表单的值回显
    @Input() public newQueryData;
    @Output()
    public codingStandardValidChange = new EventEmitter<any>();
    // 设施语言包
    public language: FacilityLanguageInterface;
    // 公共国际化
    public commonLanguage: CommonLanguageInterface;
    // 表单参数
    public formColumn: FormItem[] = [];
    // 表单状态
    public formInstance: FormOperate;
    // 确定按钮是否可点击
    public isDisabled: boolean = true;
    // 编码内容
    public codingContent: string;
    // 编码示例
    public codingExample: string;
    // 可选字段接口调用获取全部字段信息，用作编码内容和编码示例值得拼接
    private emitOptionalField: any = [];
    // 第二步5级下拉框全部可选字段
    private optionalFields: any = [];
    // 第二步5级下拉框全部可选字段完整信息
    private optionalFieldsInformation: any = [];
    // 第二步5级下拉框当前可选字段
    private currentOptionalFields: any = [];
    // 保存第二步表单信息
    private saveSecondInformation: any[] = [];
    // 标准编码最大长度
    private maxLength: number;
    // 判断是否为新增或编辑
    private isEdit: boolean = false;
    // 存放前四级选择的数据完整信息
    private selectAllData: any[] = [];
    // 一级下拉框可选字段数据
    private firstLevelSelectInfo: any = [];
    // 二级下拉框可选字段数据
    private secondLevelSelectInfo: any = [];
    // 三级下拉框可选字段数据
    private thirdLevelSelectInfo: any = [];
    // 四级下拉框可选字段数据
    private fourthLevelSelectInfo: any = [];
    // 获取禁用下拉框数据
    private disableData = [];
    // 判断第二步选中可选字段是否存在不可用字段
    private isDisabledField: boolean = true;

    constructor(
        public $nzI18n: NzI18nService,
        public $ruleUtil: RuleUtil,
        public $CodingStandardApiService: CodingStandardApiService,
        public $message: FiLinkModalService
    ) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.formValue && changes.formValue.currentValue && this.formInstance && this.formValue.firstLevel && this.newQueryData) {
            this.setFormData();
        }
    }


    ngOnInit() {
        // 国际化
        this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
        this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
        this.queryCodingRuleField();
        this.initColumn();

    }

    /**
     * 表单实例校验
     */
    public newCodingFormInstance(event: { instance: FormOperate }): void {
        this.formInstance = event.instance;
        this.formInstance.group.statusChanges.subscribe(() => {
            this.isDisabled = this.formInstance.getRealValid();
            if (this.formColumn.length) {
                this.codingContent = this.formInstance.getData('codingRuleContent');
                const codingExample = this.formInstance.getData('codingRuleExample');
                const secondStepParam = {
                    codingRuleContent: this.codingContent,
                    codingRuleExample: codingExample,
                    fieldCodeList: this.saveSecondInformation,
                    maxLength: String(this.maxLength + 7),
                };
                const emitInformation = {
                    isDisabled: this.isDisabled,
                    secondStepParam: secondStepParam,
                    isDisabledField: this.isDisabledField
                };
                this.codingStandardValidChange.emit(emitInformation);
            }
        });
        if (this.formValue && this.formValue.firstLevel && this.newQueryData) {
            this.setFormData();
        }
    }

    /**
     * 自动生成名称，获取第二步表单数据
     */
    public getAutoName(): void {
        // 编辑回显直接用接口返回数据进行编码内容和示例拼接
        if (this.isEdit) {
            this.newQueryData = _.sortBy(this.newQueryData, 'fieldOrder');
            this.selectAllData = this.newQueryData;
        }
        this.emitOptionalField = this.selectAllData;
        let codingContent: string = '';
        let codingExample: string = '';
        this.maxLength = 0;
        this.saveSecondInformation = [];
        this.emitOptionalField.forEach(item => {
            if (item.fieldCode) {
                if (item.fieldCode === '7') {
                    if (item.fieldText) {
                        codingContent = `${codingContent}+${item.fieldText}`;
                    }
                } else {
                    codingContent = `${codingContent}+${item.fieldName}`;
                }
                if (item.example) {
                    codingExample = `${codingExample}${item.example}`;
                }
                this.maxLength += Number(item.fieldMaxLength);
                this.saveSecondInformation.push(item);
            }
        });
        codingContent = `${codingContent}+${this.language.codingStandard.fixedSerialNumber}(7)`;
        codingExample = `${codingExample}0000001`;
        codingContent = codingContent.substr(1);
        this.codingContent = codingContent;
        this.codingExample = codingExample;
        this.isDisabledField = Boolean(this.saveSecondInformation.every(item => !this.disableData.includes(item.fieldCode)));
        this.formInstance.resetControlData('codingRuleContent', codingContent);
        this.formInstance.resetControlData('codingRuleExample', codingExample);
    }

    public resetFormColumn() {
        this.formColumn.forEach(item => {
            if (item.key === OptionalFieldEnum.secondLevel) {
                item.selectInfo.data = this.secondLevelSelectInfo;
            }
            switch (item.key) {
                case OptionalFieldEnum.firstLevel:
                    item.selectInfo.data = this.firstLevelSelectInfo;
                    break;
                case OptionalFieldEnum.secondLevel:
                    item.selectInfo.data = this.secondLevelSelectInfo;
                    break;
                case OptionalFieldEnum.thirdLevel:
                    item.selectInfo.data = this.thirdLevelSelectInfo;
                    break;
                case OptionalFieldEnum.fourthLevel:
                    item.selectInfo.data = this.fourthLevelSelectInfo;
                    break;
                default:
                    break;
            }
        });
    }

    /**
     * 获第二步1至5级可选字段下拉框选项
     */
    private queryCodingRuleField() {
        this.$CodingStandardApiService.queryCodingRuleField().subscribe((result: ResultModel<any>) => {
            if (result.code === ResultCodeEnum.success) {
                this.optionalFieldsInformation = CommonUtil.deepClone(result.data);
                result.data.forEach(item => {
                    if (item.status === '0') {
                        this.disableData.push(item.fieldCode);
                    }
                });
                result.data.forEach(item => {
                    this.optionalFields.push({
                        label: item.fieldShowText,
                        code: item.fieldCode,
                    });
                    this.firstLevelSelectInfo.push({
                        label: item.fieldShowText,
                        code: item.fieldCode,
                    });
                    this.secondLevelSelectInfo.push({
                        label: item.fieldShowText,
                        code: item.fieldCode,
                    });
                    this.thirdLevelSelectInfo.push({
                        label: item.fieldShowText,
                        code: item.fieldCode,
                    });
                    this.fourthLevelSelectInfo.push({
                        label: item.fieldShowText,
                        code: item.fieldCode,
                    });
                });
                this.removeDisabledSelectData();
                if (this.newQueryData && this.newQueryData.length) {
                    this.newQueryData = _.sortBy(this.newQueryData, 'fieldOrder');
                    this.newQueryData.forEach((item, index) => {
                        this.handleSelectData(item.fieldCode, index);
                        this.getAutoName();
                    });
                }
            } else {
                this.$message.error(result.msg);
            }
        }, () => {
        });
    }

    /**
     * 初始化表单
     */
    private initColumn(): void {
        this.formColumn = [
            {
                // 一级
                label: this.language.codingStandard.firstLevel,
                key: OptionalFieldEnum.firstLevel,
                type: 'select',
                placeholder: this.language.pleaseChoose,
                allowClear: true,
                selectInfo: {
                    data: this.firstLevelSelectInfo,
                    label: 'label',
                    value: 'code',
                },
                modelChange: (controls, $event) => {
                    if (!controls[OptionalFieldEnum.firstLevel].dirty) {
                        return;
                    } else {
                        this.isEdit = false;
                    }
                    this.selectAllData[0] = CommonUtil.deepClone(this.optionalFieldsInformation.find(item => $event === item.fieldCode));
                    this.selectAllData[0].fieldOrder = '1';
                    this.handleSelectData($event, 1);
                    const firstLevelCustomizeColumn = this.formColumn.find(item => item.key === 'firstLevelCustomize');
                    if ($event === '7') {
                        firstLevelCustomizeColumn.hidden = false;
                        this.selectAllData[0].fieldText = this.formInstance.getData('firstLevelCustomize');
                        this.selectAllData[0].example = this.formInstance.getData('firstLevelCustomize');
                    } else {
                        firstLevelCustomizeColumn.hidden = true;
                    }
                    this.formInstance.group.updateValueAndValidity();
                    this.getAutoName();
                },
                require: true,
                rule: [{required: true}],
            },
            { // 一级自定义
                label: '', key: 'firstLevelCustomize',
                type: 'input',
                col: 24,
                hidden: true,
                rule: [{required: true}, this.$ruleUtil.getCustomizeMaxLengthRule(), RuleUtil.getCurrentNameRule(this.commonLanguage.nameCodeMsg)],
                customRules: [this.$ruleUtil.getNameCustomRule()],
                modelChange: (controls, $event) => {
                    if (!controls['firstLevelCustomize'].dirty) {
                        return;
                    }
                    this.selectAllData[0].fieldText = $event;
                    this.selectAllData[0].example = $event;
                    this.getAutoName();
                }
            },
            {
                // 二级
                label: this.language.codingStandard.secondLevel,
                key: OptionalFieldEnum.secondLevel,
                type: 'select',
                placeholder: this.language.pleaseChoose,
                allowClear: true,
                selectInfo: {
                    data: this.secondLevelSelectInfo,
                    label: 'label',
                    value: 'code',
                },
                modelChange: (controls, $event) => {
                    if (!controls[OptionalFieldEnum.secondLevel].dirty) {
                        return;
                    } else {
                        this.isEdit = false;
                    }
                    this.selectAllData[1] = CommonUtil.deepClone(this.optionalFieldsInformation.find(item => $event === item.fieldCode));
                    this.selectAllData[1].fieldOrder = '2';
                    this.handleSelectData($event, 2);
                    const secondLevelCustomizeColumn = this.formColumn.find(item => item.key === 'secondLevelCustomize');
                    if ($event === '7') {
                        secondLevelCustomizeColumn.hidden = false;
                        this.selectAllData[1].fieldText = this.formInstance.getData('secondLevelCustomize');
                        this.selectAllData[1].example = this.formInstance.getData('secondLevelCustomize');
                    } else {
                        secondLevelCustomizeColumn.hidden = true;
                    }
                    this.formInstance.group.updateValueAndValidity();
                    this.getAutoName();
                },
                require: true,
                rule: [{required: true}],
            },
            { // 二级自定义
                label: '', key: 'secondLevelCustomize',
                type: 'input',
                col: 24,
                hidden: true,
                rule: [{required: true}, this.$ruleUtil.getCustomizeMaxLengthRule(), RuleUtil.getCurrentNameRule(this.commonLanguage.nameCodeMsg)],
                customRules: [this.$ruleUtil.getNameCustomRule()],
                modelChange: (controls, $event) => {
                    if (!controls['secondLevelCustomize'].dirty) {
                        return;
                    }
                    this.selectAllData[1].fieldText = $event;
                    this.selectAllData[1].example = $event;
                    this.getAutoName();
                }
            },
            {
                // 三级
                label: this.language.codingStandard.thirdLevel,
                key: OptionalFieldEnum.thirdLevel,
                type: 'select',
                placeholder: this.language.pleaseChoose,
                allowClear: true,
                selectInfo: {
                    data: this.thirdLevelSelectInfo,
                    label: 'label',
                    value: 'code',
                },
                modelChange: (controls, $event) => {
                    if (!controls[OptionalFieldEnum.thirdLevel].dirty) {
                        return;
                    } else {
                        this.isEdit = false;
                    }
                    this.selectAllData[2] = CommonUtil.deepClone(this.optionalFieldsInformation.find(item => $event === item.fieldCode));
                    this.selectAllData[2].fieldOrder = '3';
                    this.handleSelectData($event, 3);
                    const thirdLevelCustomizeColumn = this.formColumn.find(item => item.key === 'thirdLevelCustomize');
                    if ($event === '7') {
                        thirdLevelCustomizeColumn.hidden = false;
                        this.selectAllData[2].fieldText = this.formInstance.getData('thirdLevelCustomize');
                        this.selectAllData[2].example = this.formInstance.getData('thirdLevelCustomize');
                    } else {
                        thirdLevelCustomizeColumn.hidden = true;
                    }
                    this.formInstance.group.updateValueAndValidity();
                    this.getAutoName();
                },
                rule: [],
            },
            { // 三级自定义
                label: '', key: 'thirdLevelCustomize',
                type: 'input',
                col: 24,
                hidden: true,
                rule: [{required: true}, this.$ruleUtil.getCustomizeMaxLengthRule(), RuleUtil.getCurrentNameRule(this.commonLanguage.nameCodeMsg)],
                customRules: [this.$ruleUtil.getNameCustomRule()],
                modelChange: (controls, $event) => {
                    if (!controls['thirdLevelCustomize'].dirty) {
                        return;
                    }
                    this.selectAllData[2].fieldText = $event;
                    this.selectAllData[2].example = $event;
                    this.getAutoName();
                }
            },
            {
                // 四级
                label: this.language.codingStandard.fourthLevel,
                key: OptionalFieldEnum.fourthLevel,
                type: 'select',
                placeholder: this.language.pleaseChoose,
                allowClear: true,
                selectInfo: {
                    data: this.fourthLevelSelectInfo,
                    label: 'label',
                    value: 'code',
                },
                modelChange: (controls, $event) => {
                    if (!controls[OptionalFieldEnum.fourthLevel].dirty) {
                        return;
                    } else {
                        this.isEdit = false;
                    }
                    this.selectAllData[3] = CommonUtil.deepClone(this.optionalFieldsInformation.find(item => $event === item.fieldCode));
                    this.selectAllData[3].fieldOrder = '4';
                    this.handleSelectData($event, 4);
                    const fourthLevelCustomizeColumn = this.formColumn.find(item => item.key === 'fourthLevelCustomize');
                    if ($event === '7') {
                        fourthLevelCustomizeColumn.hidden = false;
                        this.selectAllData[3].fieldText = this.formInstance.getData('fourthLevelCustomize');
                        this.selectAllData[3].example = this.formInstance.getData('fourthLevelCustomize');
                    } else {
                        fourthLevelCustomizeColumn.hidden = true;
                    }
                    this.formInstance.group.updateValueAndValidity();
                    this.getAutoName();
                },
                rule: [],
            },
            { // 四级自定义
                label: '', key: 'fourthLevelCustomize',
                type: 'input',
                col: 24,
                hidden: true,
                rule: [{required: true}, this.$ruleUtil.getCustomizeMaxLengthRule(), RuleUtil.getCurrentNameRule(this.commonLanguage.nameCodeMsg)],
                customRules: [this.$ruleUtil.getNameCustomRule()],
                modelChange: (controls, $event) => {
                    if (!controls['fourthLevelCustomize'].dirty) {
                        return;
                    }
                    this.selectAllData[3].fieldText = $event;
                    this.selectAllData[3].example = $event;
                    this.getAutoName();
                }
            },
            {
                // 五级
                label: this.language.codingStandard.fifthLevel,
                key: 'fifthLevel',
                type: 'input',
                placeholder: this.language.codingStandard.fixedSerialNumber,
                disabled: true,
                rule: []
            },
            {
                // 编码内容
                label: this.language.codingStandard.codingContent,
                key: 'codingRuleContent',
                type: 'custom',
                template: this.codingContentTemp,
                disabled: true,
                rule: [
                    {required: true},
                ],
            },
            { // 编码示例
                label: this.language.codingStandard.codingExample,
                key: 'codingRuleExample',
                type: 'custom',
                template: this.codingExampleTemp,
                disabled: true,
                rule: [],
            },
        ];
    }

    /**
     * 前一级已选择的字段在下一级选择时不在显示，对下拉框的值进行处理
     */
    private handleSelectData(code: string, index: number): void {
        // 存放表单前四级勾选的数据code信息
        const selectData = [];
        // 获取表单真实数据
        const formData: CodingStandardSecondInfoModel = this.formInstance.getRealData();
        // 资产录入年，资产录入年月，资产录入年月日，如果三个选项需要选中，只能出现一次
        // 深拷贝一份数据用作当前下拉框初始值
        this.currentOptionalFields = CommonUtil.deepClone(this.optionalFields);
        // 前四级表单列key值集合
        const keyList: string[] = [OptionalFieldEnum.firstLevel, OptionalFieldEnum.secondLevel, OptionalFieldEnum.thirdLevel, OptionalFieldEnum.fourthLevel];
        // 资产录入日期范围集合
        const assetEntryList: string[] = [AssetEntryDateRange.AssetEntryYear, AssetEntryDateRange.AssetEntryYearAndMonth, AssetEntryDateRange.AssetEntryYearMonthAndDay];
        for (const key in formData) {
            if (keyList.includes(key)) {
                selectData.push(formData[key]);
            }
        }
        selectData.forEach(item => {
            if (item && item !== '7') {
                this.currentOptionalFields = this.currentOptionalFields.filter(data => {
                    if (assetEntryList.includes(item)) {
                        return !assetEntryList.includes(data.code);
                    } else {
                        return item !== data.code;
                    }
                });
            }
        });
        this.firstLevelSelectInfo = CommonUtil.deepClone(this.currentOptionalFields.concat(this.showSelectSelf(formData['firstLevel'])));
        this.secondLevelSelectInfo = CommonUtil.deepClone(this.currentOptionalFields.concat(this.showSelectSelf(formData['secondLevel'])));
        this.thirdLevelSelectInfo = CommonUtil.deepClone(this.currentOptionalFields.concat(this.showSelectSelf(formData['thirdLevel'])));
        this.fourthLevelSelectInfo = CommonUtil.deepClone(this.currentOptionalFields.concat(this.showSelectSelf(formData['fourthLevel'])));
        this.firstLevelSelectInfo = _.sortBy(this.firstLevelSelectInfo, 'code');
        this.secondLevelSelectInfo = _.sortBy(this.secondLevelSelectInfo, 'code');
        this.thirdLevelSelectInfo = _.sortBy(this.thirdLevelSelectInfo, 'code');
        this.fourthLevelSelectInfo = _.sortBy(this.fourthLevelSelectInfo, 'code');
        this.resetFormColumn();
    }

    // 编辑回显给form表单赋值
    private setFormData(): void {
        const customizeList: string[] = [OptionalFieldCustomizeEnum.firstLevelCustomize, OptionalFieldCustomizeEnum.secondLevelCustomize,
            OptionalFieldCustomizeEnum.thirdLevelCustomize, OptionalFieldCustomizeEnum.fourthLevelCustomize];
        Object.keys(this.formValue).forEach(item => {
            if (customizeList.includes(item) && this.formValue[item]) {
                this.formInstance.setColumnHidden([item], false);
            }
        });
        this.formInstance.resetData(this.formValue);
        this.isEdit = true;
        this.getAutoName();
        this.removeDisabledSelectData();
        if (this.newQueryData && this.newQueryData.length) {
            this.newQueryData = _.sortBy(this.newQueryData, 'fieldOrder');
            this.newQueryData.forEach((item, index) => {
                this.handleSelectData(item.fieldCode, index);
            });
        }
    }

    // 下拉框拼接自己勾选值
    private showSelectSelf(code): any {
        // 返回当前表单勾选值
        let data = [];
        // 全部可选字段处理成下拉选框数据格式
        const allData = [];
        // 资产录入日期范围集合
        const assetEntryList: string[] = [AssetEntryDateRange.AssetEntryYear, AssetEntryDateRange.AssetEntryYearAndMonth, AssetEntryDateRange.AssetEntryYearMonthAndDay];
        this.optionalFieldsInformation.forEach(item => {
            allData.push({label: item.fieldShowText, code: item.fieldCode});
        });
        if (code && code !== '7') {
            const disabledDateType = this.disableData.filter(item => (assetEntryList.includes(item) && (item !== code)));
            data = allData.filter(item => {
                // 如果当前级别下拉框数据为资产录入日期范围集合中的数据，当前级别下拉框数据拼接自己的同时还要拼接另外非禁用的日期范围类型
                if (assetEntryList.includes(code)) {
                    return (assetEntryList.includes(item.code) && !disabledDateType.includes(item.code));
                } else {
                    return item.code === code;
                }
            });
        }
        return data;
    }

    /**
     * 筛选状态为可用的可选字段
     */
    private removeDisabledSelectData(): void {
        this.optionalFields = this.optionalFields.filter(item => !this.disableData.includes(item.code));
        // 新增时直接筛选可用选字段
        if (!this.isEdit) {
            this.firstLevelSelectInfo = this.firstLevelSelectInfo.filter(item => !this.disableData.includes(item.code));
            this.secondLevelSelectInfo = this.secondLevelSelectInfo.filter(item => !this.disableData.includes(item.code));
            this.thirdLevelSelectInfo = this.thirdLevelSelectInfo.filter(item => !this.disableData.includes(item.code));
            this.fourthLevelSelectInfo = this.fourthLevelSelectInfo.filter(item => !this.disableData.includes(item.code));
        } else {
            // 如果当前回显得值状态变为不可用，回显时如果直接筛选，回显不成功，找不到当前回显的下拉框值
            this.firstLevelSelectInfo = this.firstLevelSelectInfo.filter(item => (!this.disableData.includes(item.code) || (item.code === this.formValue.firstLevel)));
            this.secondLevelSelectInfo = this.secondLevelSelectInfo.filter(item => (!this.disableData.includes(item.code) || (item.code === this.formValue.secondLevel)));
            this.thirdLevelSelectInfo = this.thirdLevelSelectInfo.filter(item => (!this.disableData.includes(item.code) || (item.code === this.formValue.thirdLevel)));
            this.fourthLevelSelectInfo = this.fourthLevelSelectInfo.filter(item => (!this.disableData.includes(item.code) || (item.code === this.formValue.fourLevel)));
        }
        this.resetFormColumn();
    }
}
