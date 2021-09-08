import { Component, Input, OnInit } from '@angular/core';
import {FaultLanguageInterface} from '../../../../../../assets/i18n/fault/fault-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {ColumnTableModel} from "../../../share/model/column-table.model";
import {ColumnListModel} from "../../../share/model/column-list..model";

/**
 * 故障详情物料信息
 */
@Component({
  selector: 'app-material-list',
  templateUrl: './material-list.component.html',
  styleUrls: ['./material-list.component.scss']
})
export class MaterialListComponent implements OnInit {
  // 传递过来的数据
  @Input() spreadData: ColumnTableModel[] = [];
  // 传递过来的表格列
  @Input() columnConfig: ColumnListModel[] = [];
  // 总数
  public total: number = 0;
  // 当前页
  public pageIndex: number = 1;
  // 每页条数
  public pageSize: number = 5;
  // 展示的数据
  public curData: ColumnTableModel[] = [];
  // 告警国际化引用
  public language: FaultLanguageInterface;
  constructor(
    private $nzI18n: NzI18nService,
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.fault);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.getData(this.pageIndex, this.pageSize);
  }

  /**
   * 翻页
   */
  public changePageIndex(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.getData(pageIndex, this.pageSize);
  }

  /**
   * 获取分页数据
   */
  public getData(page: number, size: number): void {
    const data = this.spreadData;
    this.total = data.length;
    this.curData = data.slice(((page - 1) * size), ((page - 1) * size ) + size);
  }
}
