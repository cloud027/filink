import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { NzI18nService } from 'ng-zorro-antd';

import { LanguageEnum } from '../../../../shared-module/enum/language.enum';
import { EnergyLanguageInterface } from '../../../../../assets/i18n/energy/energy.language.interface';
import { TableConfigModel } from '../../../../shared-module/model/table-config.model';
import { PageModel } from '../../../../shared-module/model/page.model';
import { FinalValueEnum } from '../../../../core-module/enum/step-final-value.enum';
import { BasicInfoComponent } from './components/basic-info/basic-info.component';
import { StrategyDetailsComponent } from './components/strategy-details/strategy-details.component';
import { applicationFinal, setData } from '../../const';
import { StrategyListModel } from '../../share/model/electric-strategy-model';
@Component({
    selector: 'app-electric-strategy-insert',
    templateUrl: './electric-strategy-insert.component.html',
    styleUrls: ['./electric-strategy-insert.component.scss']
})
export class ElectricStrategyInsertComponent implements OnInit, OnDestroy {
    // 获取基本信息
    @ViewChild('basicInfo') basicInfo: BasicInfoComponent;
    // 获取策略详情信息
    @ViewChild('strategyDetails') strategyDetails: StrategyDetailsComponent;
    // 获取完成页面
    @ViewChild('detailsInfo') detailsInfo;
    @Input() linkageType: boolean = false;
    // 标题
    public title: string;
    // 默认选中的步骤
    public isActiveSteps: number = FinalValueEnum.STEPS_SECOND;
    // 区分三个平台的常量
    public applicationFinal = applicationFinal;
    // 步骤条的步骤常量值
    public finalValueEnum = FinalValueEnum;
    // 策略id
    public strategyId: string = '';
    // 控制操作按钮的显隐
    public isOperation: boolean = false;
    // 步骤条的值
    public setData = setData;
    public nextButtonDisable: boolean = true;
    // 验证状态
    public validStatus = {
        first: false,
        second: false
    };
    // 提交loading
    public isSaveLoading = false;

    nzCurrent: number = 0;
    language: EnergyLanguageInterface;
    dataSet = [];
    // 表格配置
    public tableConfig: TableConfigModel;
    // 表格翻页对象
    public pageBean: PageModel = new PageModel();
    // 保存 三个步骤的基本信息
    public setpsComponentInfo: StrategyListModel = new StrategyListModel();

    constructor(
        private $nzI18n: NzI18nService    ) {
    }

    ngOnInit() {
        this.language = this.$nzI18n.getLocaleData(LanguageEnum.energy);
        this.changeStepsStyle(this.setData, this.isActiveSteps);
    }

    /**
     * 销毁
     */
    public ngOnDestroy(): void {
        this.basicInfo = null;
        this.strategyDetails = null;
        this.detailsInfo = null;
    }

    /**
     * 控制按钮显隐
     */
    public showHiddenNextSteps() {}

    /**
     * 上一步操作
     * @ param value
     */
    public handPrevSteps(): void {}

    /**
     * 下一步操作
     * @ param value
     */
    public handNextSteps(): void {
    }

    /**
     * 保存策略详情数据
     */
    public instructInfoProgram(): void {}

    /**
     * 数据提交
     */
    public handStepsSubmit(): void {
        this.isSaveLoading = true;
        if (this.strategyId) {
            this.setpsComponentInfo.strategyId = this.strategyId;
            this.modifyReleaseStrategy();
        } else {
            this.releasePolicyAdd();
        }
    }

    /**
     * 取消操作
     */
    public handCancelSteps(): void {
        window.history.go(-1);
    }

    /**
     * 点击步骤条切换
     * @ param value
     */
    public changeSteps(value: number): void {
        // 下一步
        if (value > this.isActiveSteps) {
            // 判断上一步有值
            if (value - 1 > 0) {
                // 上一步为第一步
                if (value - 1 === this.finalValueEnum.STEPS_FIRST) {
                    if (!this.validStatus.first) {
                        return;
                    }
                    // 上一步为第二步
                } else if (value - 1 === this.finalValueEnum.STEPS_SECOND) {
                    if (!this.validStatus.second) {
                        return;
                    }
                }
            }
        } else {
            // 后退不校验
        }
        if (value > this.finalValueEnum.STEPS_SECOND) {
            this.basicInfo.handNextSteps();
        }
        this.isActiveSteps = value;
        this.changeStepsStyle(this.setData, this.isActiveSteps);
        this.toggleButtonDisable();
        console.log(this.setpsComponentInfo, 'this.setpsComponentInfo');
    }
    toggleButtonDisable() {
        if (this.isActiveSteps === this.finalValueEnum.STEPS_FIRST) {
            this.nextButtonDisable = !this.validStatus.first;
        } else {
            this.nextButtonDisable = !this.validStatus.second;
        }
    }

    infoValid(valid, isActiveSteps) {
        this.nextButtonDisable = !valid;
        // 记录第一步第二步的校验状态
        if (isActiveSteps === this.finalValueEnum.STEPS_FIRST) {
            this.validStatus.first = valid;
        } else {
            this.validStatus.second = valid;
        }
    }




    /**
     * 新增策略
     * @ param params
     */
    private releasePolicyAdd(): void {}

    /**
     * 编辑信息发布
     * @ param params
     */
    private modifyReleaseStrategy(): void {}

    // 切换步骤条样式
    // tslint:disable-next-line: no-shadowed-variable
    changeStepsStyle(setData, isActiveSteps: number): void {
        const classStatus = {
            STEPS_FINISH: 'finish',
            STEPS_ACTIVE: 'active',
            DETAILS_ACTIVE: 'details-active'
        };
        setData.forEach((item) => {
            if (isActiveSteps > item.number) {
                item.activeClass = ` ${classStatus.STEPS_FINISH}`;
            } else if (isActiveSteps === item.number) {
                item.activeClass = ` ${classStatus.STEPS_ACTIVE}`;
            } else {
                item.activeClass = '';
            }
        });
    }
}
