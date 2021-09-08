import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApplicationInterface } from '../../../../../../../assets/i18n/application/application.interface';
import { LanguageEnum } from '../../../../../../shared-module/enum/language.enum';
import { NzI18nService } from 'ng-zorro-antd';
import { CommonLanguageInterface } from '../../../../../../../assets/i18n/common/common.language.interface';
import { FinalValueEnum } from '../../../../../../core-module/enum/step-final-value.enum';

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
    // 上一步
    @Output() public prevNotify = new EventEmitter<number>();
    // 下一步
    @Output() public nextNotify = new EventEmitter<number>();
    // 改变步骤
    @Output() public changeSteps = new EventEmitter<number>();
    // 提交
    @Output() public submitNotify = new EventEmitter();
    // 取消
    @Output() public cancelNotify = new EventEmitter();
    // 是否禁用
    @Input() public isDisabled: boolean = true;
    // 选中的步骤数
    @Input() public isActiveSteps = FinalValueEnum.STEPS_FIRST;
    @Input()
    isLoading: boolean = false;
    // 步骤条的步骤枚举
    public finalValueEnum = FinalValueEnum;
    // 设备列表多语言
    public languageTable: ApplicationInterface;
    // 公共国际化
    public commonLanguage: CommonLanguageInterface;

    constructor(
        // 多语言配置
        private $nzI18n: NzI18nService
    ) {
        // 表格多语言配置
        this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
        this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    }

    public ngOnInit(): void {}

    // 上一步
    public handPrevSteps(val: number): void {
        this.isActiveSteps = val - 1;
        this.changeSteps.emit(this.isActiveSteps);
    }

    // 下一步
    public handNextSteps(val: number): void {
        this.isActiveSteps = val + 1;
        this.changeSteps.emit(this.isActiveSteps);
    }

    // 提交
    public handStepsSubmit(): void {
        this.submitNotify.emit();
    }

    // 取消
    public handCancelSteps(): void {
        this.cancelNotify.emit();
    }
}
