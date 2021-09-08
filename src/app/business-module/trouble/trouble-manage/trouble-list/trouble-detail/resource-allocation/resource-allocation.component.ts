import {Component, OnInit, Input} from '@angular/core';
import {FaultLanguageInterface} from '../../../../../../../assets/i18n/fault/fault-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../../../shared-module/enum/language.enum';
import {PersonModel} from '../../../../share/model/person.model';
import {CarModel} from '../../../../share/model/car.model';
import {MaterielModel} from '../../../../share/model/materiel.model';
import {ColumnListModel} from '../../../../share/model/column-list..model';
import {ColumnTableModel} from '../../../../share/model/column-table.model';

/**
 * 物料信息
 */
@Component({
  selector: 'app-resource-allocation',
  templateUrl: './resource-allocation.component.html',
  styleUrls: ['./resource-allocation.component.scss']
})
export class ResourceAllocationComponent implements OnInit {
  // 人员数据
  @Input() person: PersonModel[];
  // 车辆数据
  @Input() car: CarModel[];
  // 设备数据
  @Input() materiel: MaterielModel[];
  // 告警国际化引用
  public language: FaultLanguageInterface;
  // 人员数据
  public personData: ColumnTableModel[] = [];
  // 表格配置
  public columnPersonConfig: ColumnListModel[] = [];
  // 车辆数据
  public carData: ColumnTableModel[] = [];
  // 表格配置
  public columnCarConfig: ColumnListModel[] = [];
  // 申请设备数据
  public applyData: ColumnTableModel[] = [];
  // 表格配置
  public columnApplyConfig: ColumnListModel[] = [];

  constructor(
    public $nzI18n: NzI18nService,
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.fault);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.getResultData(this.person, this.car, this.materiel);
  }

  /**
   * 组装数据
   */
  private getResultData(person: PersonModel[], car: CarModel[], materiel: MaterielModel[]): void {
    // 人员表格配置
    this.columnPersonConfig = [{title: this.language.serialNumber}, {title: this.language.personName}];
    // 车辆表格配置
    this.columnCarConfig = [{title: this.language.serialNumber}, {title: this.language.carName}];
    // 设备表格配置
    this.columnApplyConfig = [{title: this.language.serialNumber}, {title: this.language.equipmentName}];
    // 人员
    if (person && person.length > 0) {
      this.personData = person.map(item => ({name: item.staffName})) || [];
    }
    // 车辆
    if (car && car.length > 0) {
      this.carData = car.map(item => ({name: item.carName})) || [];
    }
    // 设备
    if (materiel && materiel.length > 0) {
      this.applyData = materiel.map(item => ({name: item.materielName})) || [];
    }
  }
}
