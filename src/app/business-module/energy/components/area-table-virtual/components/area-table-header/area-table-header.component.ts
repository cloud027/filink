import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import { NzI18nService } from 'ng-zorro-antd';
import { Operation, TableConfigModel } from '../../../../../../shared-module/model/table-config.model';
import * as lodash from 'lodash';
import { SessionUtil } from '../../../../../../shared-module/util/session-util';

declare const $;

@Component({
    selector: 'app-area-table-header',
    templateUrl: './area-table-header.component.html',
    styleUrls: ['./area-table-header.component.scss']
})
export class AreaTableHeaderComponent implements OnInit, AfterViewInit, OnDestroy {
    // 可配置列数组
    @Input()
    configurableColumn;
    // 表格配置
    @Input()
    tableConfig: TableConfigModel;
    // 所有的没选中
    @Input()
    allUnChecked: boolean;
    // 设置列显示隐藏
    @Input()
    setColumnVisible: boolean = false;
    // 打印显示隐藏
    @Input()
    printVisible: boolean;
    // 国际化
    language;
    // 下拉区域的占位符
    @Input()
    selectedPlaceHolder: string;
    // 下拉选项
    @Input()
    selectedOption: string;
    // 下拉选中值
    @Input()
    selectedValue;
    // 文件本地地址
    filePath: string;
    // 头部按钮处理事件回调
    @Output() topHandle = new EventEmitter();
    // 展开表格搜索
    @Output() openTableSearch = new EventEmitter();
    // 下拉改变事件
    @Output() dropDownChange = new EventEmitter();
    // 列表配置变化事件
    @Output() configurableColumnChange = new EventEmitter();
    // 保存列设置
    @Output() saveColumn = new EventEmitter();
    // 点击导出
    @Output() clickExport = new EventEmitter();
    // 点击导入
    @Output() clickImport = new EventEmitter();
    // 点击打印
    @Output() printList = new EventEmitter();
    // 展开事件回调
    @Output() openChildren = new EventEmitter();
    // 导入文件
    @ViewChild('file') file: ElementRef;
    @Output()
    public setColumnVisibleChange = new EventEmitter();
    public setColumnMaxHeight: number;
    public handleResize = lodash.debounce((event) => {
        this.calcHeight();
    }, 200);

    constructor(public i18n: NzI18nService) {}

    ngOnInit() {
        this.language = this.i18n.getLocale();
        window.addEventListener('resize', this.handleResize);
    }

    ngOnDestroy(): void {
        window.removeEventListener('resize', this.handleResize);
    }

    ngAfterViewInit(): void {
        Promise.resolve().then(() => {
            this.calcHeight();
        });
    }

    @HostListener('click', ['$event'])
    onClick(ev: Event): void {
        if (ev.target['id'] !== 'file') {
            return;
        }
        (this.file.nativeElement as HTMLInputElement).click();
    }

    /**
     * 导入.xlsx文件
     */
    importChange(file) {
        this.clickImport.emit(file);
    }

    nzVisibleChange(event) {
        this.setColumnVisible = event;
        this.setColumnVisibleChange.emit(this.setColumnVisible);
    }

    /**
     * 按钮点击事件
     * param operate
     */
    buttonClick(operate: Operation): void {
        let flag = false;
        // 判断按钮权限
        if (operate.permissionCode) {
            // 有权限按正常的逻辑返回
            if (SessionUtil.checkHasRole(operate.permissionCode)) {
                flag = operate.canDisabled && this.allUnChecked;
            } else {
                flag = true;
            }
        } else {
            flag = operate.canDisabled && this.allUnChecked;
        }
        if (flag) {
            return;
        }
        if (operate.canDisabled && this.allUnChecked) {
            return;
        }
        this.topHandle.emit(operate);
    }

    calcHeight() {
        const dom = document.getElementById('setColumn');
        if (dom) {
            this.setColumnMaxHeight = $(window).height() - dom.offsetTop - 100;
        }
    }
}
