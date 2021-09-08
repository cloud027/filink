import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NzI18nService, NzMessageService } from 'ng-zorro-antd';

import { LanguageEnum } from '../../../../shared-module/enum/language.enum';
import { RuleUtil } from '../../../../shared-module/util/rule-util';
import { CommonLanguageInterface } from '../../../../../assets/i18n/common/common.language.interface';

@Component({
    selector: 'app-table-search-model',
    templateUrl: './table-search-model.component.html',
    styleUrls: ['./table-search-model.component.scss']
})

/**
 * 表格搜索 设施 设备 回路 时候的弹出框
 */
export class TableSearchModelComponent implements OnInit {
    @Input() tableCheckModalTitle;
    @Input()
    set tableSearchVisible(params) {
        this._tableSearchVisible = params;
        this.tableSearchVisibleChange.emit(this._tableSearchVisible);
    }
    // 获取modal框显示状态
    get tableSearchVisible() {
        return this._tableSearchVisible;
    }

    // 显示隐藏变化
    @Output() public tableSearchVisibleChange = new EventEmitter<any>();
    // 显示隐藏
    public _tableSearchVisible = false;

    languageEnum: CommonLanguageInterface;
    constructor(
        private $nzI18n: NzI18nService,
        private $message: NzMessageService,
        private $ruleUtil: RuleUtil,
    ) {}

    ngOnInit() {

        this.languageEnum = this.$nzI18n.getLocaleData(LanguageEnum.common);
    }
}
