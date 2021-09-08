import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NzI18nService } from 'ng-zorro-antd';

import { EnergyLanguageInterface } from '../../../../../assets/i18n/energy/energy.language.interface';
import { LanguageEnum } from '../../../../shared-module/enum/language.enum';

@Component({
    selector: 'app-energy-date-picker-select-tag',
    templateUrl: './energy-date-picker-select-tag.component.html',
    styleUrls: ['./energy-date-picker-select-tag.component.scss']
})
export class EnergyDatePickerSelectTagComponent implements OnInit {
    @ViewChild('nzRenderExtraFooterTemp') nzRenderExtraFooterTemp: TemplateRef<HTMLDocument>;

    /** 日期选择器的 model  */
    datePickerModel;
    /** 日期选择器的 open */
    datePickerOpen: boolean = false;
    /** 日期选择器 tag 的list */
    datePickTagList: string[] = [];

    language: EnergyLanguageInterface;
    constructor(private $nzI18n: NzI18nService) {}

    ngOnInit() {
        this.language = this.$nzI18n.getLocaleData(LanguageEnum.energy);
    }

    /** 时间选择器 时间改变触发 */
    onChange(time) {
        console.log(time, 'time');
        const getTime = new Date(time);
        const getYear = getTime.getFullYear();
        const getMonth = getTime.getMonth() + 1;
        const getDay = getTime.getDate();
        const setTime = `${getYear}-${getMonth}-${getDay}`;
        if (this.datePickTagList.find((item) => item === setTime)) { return; }
        this.datePickTagList.push(setTime);
        console.log(this.datePickTagList, 'this.datePickTagList');
    }

    /** tag 标签关闭事件 */
    nzOnClose(event: Event, tagItem) {
        console.log(tagItem, event);
        event.stopPropagation();
    }
}
