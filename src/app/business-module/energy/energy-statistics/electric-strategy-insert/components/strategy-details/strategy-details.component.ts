import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output} from '@angular/core';
import { NzI18nService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { FiLinkModalService } from '../../../../../../shared-module/service/filink-modal/filink-modal.service';
import { EnergyLanguageInterface } from '../../../../../../../assets/i18n/energy/energy.language.interface';
import { LanguageEnum } from '../../../../../../shared-module/enum/language.enum';
import { CommonLanguageInterface } from '../../../../../../../assets/i18n/common/common.language.interface';
import { AssetManagementLanguageInterface } from '../../../../../../../assets/i18n/asset-manage/asset-management.language.interface';
import {
    StrategyListModel,
    StepSecondInsertElectricModel
} from '../../../../share/model/electric-strategy-model';
import {
    StepSecondInsertStrategyTypeEnum,
    StepSecondRangTypeEnum,
    timeSelectTypeEnum
} from '../../../../share/enum/energy-config.enum';

@Component({
    selector: 'app-strategy-details',
    templateUrl: './strategy-details.component.html',
    styleUrls: ['./strategy-details.component.scss']
})
export class StrategyDetailsComponent implements OnInit {
    @Input() setpsComponentInfo: StrategyListModel;
    @Output()
    strategyDetailValidChange = new EventEmitter<boolean>();

    // 基础电价
    electricityPrice = 1;
    /** 添加策略的禁用 */
    disabledInsertBtn: StepSecondInsertStrategyTypeEnum =
        StepSecondInsertStrategyTypeEnum.insertStrategy;
    // 新增策略
    insertPolicy: StepSecondInsertElectricModel = new StepSecondInsertElectricModel();
    /** 策略的类型 */
    StepSecondInsertStrategyTypeEnum = StepSecondInsertStrategyTypeEnum;
    // 策略弹框
    isAddPolicy: boolean = false;
    // 添加策略的 type
    insertType: StepSecondInsertStrategyTypeEnum;
    // 日期选择器 联动-------------
    timeSelectType = timeSelectTypeEnum;

    mapOfExpandData: { [key: string]: boolean } = {};

    // 表格多语言
    public language: EnergyLanguageInterface;
    public commonLanguage: CommonLanguageInterface;
    // 资产管理语言包
    public assetsLanguage: AssetManagementLanguageInterface;
    constructor(
        // 多语言
        private $nzI18n: NzI18nService,
        // 提示
        private $message: FiLinkModalService,
        // 路由
        public $router: Router    ) {
        // 多语言
        this.language = this.$nzI18n.getLocaleData(LanguageEnum.energy);
        this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
        this.assetsLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);
    }

    ngOnInit() {
        this.strategyDetailValid();
    }

    /** 添加策略 按钮 */
    handleAddProgram(type: StepSecondInsertStrategyTypeEnum) {
        console.log(type, 'type');
        if (this.disabledInsertBtn === type) {
            this.insertType = type;
            this.isAddPolicy = true;
        }
    }

    // 添加策略弹框 点击保存按钮
    handleSave() {
        if (!this.vailiter()) { return; }
        // 添加策略
        if (this.insertType === StepSecondInsertStrategyTypeEnum.insertStrategy) {
            const item: StepSecondInsertElectricModel[] = [
                {
                    id: new Date().getTime(),
                    range: StepSecondRangTypeEnum.powerRange,
                    startPower: this.insertPolicy.startPower,
                    endPower: this.insertPolicy.endPower,
                    price: this.insertPolicy.price
                }
            ];
            this.setpsComponentInfo.listOfData.push(item);
        }
        // 添加月策略
        // 添加小时策略
        this.isAddPolicy = false;
        this.resultData();
    }

    /** 清空 新增策略 的数据 */
    resultData() {
        this.insertPolicy.startPower = null;
        this.insertPolicy.endPower = null;
        this.insertPolicy.price = null;
    }
    /** 校验 新增策略 数据 必须全部填写 */
    vailiter(): boolean {
        let flag = false;
        if (this.insertPolicy.startPower && this.insertPolicy.endPower && this.insertPolicy.price) {
            flag = true;
        }
        return flag;
    }
    // 电量范围 结束范围 选择器
    rangeChange() {
        // console.log(this.listOfData, '')
    }
    editTimeRange(timeList, dataItem, currentIndex) {
        console.log(timeList, dataItem, currentIndex, 'timeList, dataItem, currentIndex');
        if (this.timeRangeIsValid()) {
            dataItem.playStartTime = timeList[0];
            dataItem.playEndTime = timeList[1];
            dataItem.showTimePicker = false;
        } else {
            this.$message.warning(this.language.timePeriodCrossingErrTip);
        }
    }
    /**
     * 时间段重复校验
     */
    private timeRangeIsValid() {
        // 查找是否有重复的时间段 flag有值，则表示有重复的时间段
        const flag = false;
        return !flag;
    }

    // 时间范围选择器改变事件
    selectedTimeValue(time: Array<Date>) {
        console.log(time);
    }

    // 删除添加的策略
    // type == 1 说明删除的是 电量范围和月份范围  type == 2 说明删除的是时间范围
    tableDeleteClick(type, index, tableIndex) {
        if (type === 1) {
            if (index === 0) {
                this.setpsComponentInfo.listOfData[tableIndex] = [];
            } else if (index === 1) {
                const getList = JSON.parse(
                    JSON.stringify(this.setpsComponentInfo.listOfData[tableIndex])
                );
                getList.splice(1, 1);
                this.setpsComponentInfo.listOfData[tableIndex] = getList;
            }
        } else if (type === 2) {
            this.setpsComponentInfo.listOfData[tableIndex][1].children.splice(index, 1);
        }
    }

    /** 表格的选择框选中的回调 */
    nzCheckedChange(event: boolean, data: StepSecondInsertElectricModel) {
        console.log(event, data);

        // 说明是 电量范围选中
        if (data.range === StepSecondRangTypeEnum.powerRange) {
            if (event) { this.disabledInsertBtn = StepSecondInsertStrategyTypeEnum.insertMonthStrategy; } else { this.disabledInsertBtn = StepSecondInsertStrategyTypeEnum.insertStrategy; }
        }
    }
    // refreshStatus(): void {
    //     this.isAllDisplayDataChecked = this.listOfDisplayData
    //         .every((item) => this.mapOfCheckedId[item.id])
    //     this.isIndeterminate =
    //         this.listOfDisplayData
    //             .filter((item) => !item.disabled)
    //             .some((item) => this.mapOfCheckedId[item.id]) && !this.isAllDisplayDataChecked
    //     this.numberOfChecked = this.listOfAllData.filter(
    //         (item) => this.mapOfCheckedId[item.id]
    //     ).length
    // }
    // 表单验证校验
    public strategyDetailValid(): void {
        const valid = false;
        // if (this.setpsComponentInfo.listOfData.length) {
        //     valid = true
        // } else {
        //     valid = false
        // }
        this.strategyDetailValidChange.emit(valid);
    }
}
