import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';
import {FormLanguageInterface} from '../../../../assets/i18n/form/form.language.interface';
import {NzI18nService, NzSelectComponent} from 'ng-zorro-antd';
import {SystemForCommonService} from '../../../core-module/api-service/system-setting';
import {ResultModel} from '../../model/result.model';
import {LanguageEnum} from '../../enum/language.enum';

/**
 * 城市信息实体
 */
export class CityInfo {
  areaCode: string;
  areaId: number;
  areaName: string;
  boundary: any;
  center: string;
  cityCode: string;
  level: number;
  parentId: number;
}

/**
 * 城市选择器组件
 */
@Component({
  selector: 'xc-city-picker',
  templateUrl: './city-picker.component.html',
  styleUrls: ['./city-picker.component.scss']
})
export class CityPickerComponent implements OnInit, OnChanges, AfterViewInit {
  // 传入已选数据
  @Input()
  selectCityInfo = {
    cityName: '',
    districtName: '',
    provinceName: ''
  };
  // 传入禁用状态
  @Input() disabled = false;
  // 选择器值变化
  @Output() cityInfoChange = new EventEmitter<any>();
  // 佐罗select实例
  @ViewChildren(NzSelectComponent) nzSelectComps: QueryList<NzSelectComponent>;
  // 已选省的值
  public provinceValue: number = null;
  // 已选市的值
  public cityValue: number = null;
  // 已选区(县)的值
  public districtValue: number = null;
  // 省数据
  public provinceData: CityInfo[] = [];
  // 市数据
  public cityData: CityInfo[] = [];
  // 区数据
  public districtData: CityInfo[] = [];
  // 表单语言包
  public language: FormLanguageInterface;
  // 所有的城市
  private allCityInfo: any[] = [];

  constructor(private $systemService: SystemForCommonService, private i18n: NzI18nService) {
  }

  ngOnInit() {
    this.language = this.i18n.getLocaleData(LanguageEnum.form);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.selectCityInfo && changes.selectCityInfo.currentValue) {
      if (this.selectCityInfo.provinceName && this.selectCityInfo.cityName && this.selectCityInfo.districtName) {
        // 当没有获取到城市信息 请求接口
        if (!this.allCityInfo.length) {
          this.getAllCityInfo().then(() => {
            this.setCityInfoValue();
          });
        } else {
          this.setCityInfoValue();
        }
      }
    }
    // 第一次进来请求接口
    if (changes && changes.selectCityInfo && changes.selectCityInfo.firstChange) {
      this.getAllCityInfo().then();
    }
  }

  ngAfterViewInit(): void {
    // 由于佐罗组件select的bug这里拿到组件进行修改其内部逻辑
    this.nzSelectComps.forEach((nzSelectComp: NzSelectComponent) => {
      nzSelectComp.onKeyDown = function (event) {
        if (!nzSelectComp.nzDisabled) {
          nzSelectComp.nzSelectService['onKeyDown'](event);
        }
      };
    });
  }

  /**
   * 省选择框值改变
   * param event
   */
  public provinceNameChange(event: number): void {
    this.cityValue = null;
    this.cityData = this.getCityDataByParentId(event);
    this.cityValue = this.cityData[0] && this.cityData[0].areaId;
    this.cityNameChange(this.cityValue);
  }

  /**
   * 市选择框值改变
   * param event
   */
  public cityNameChange(event: number): void {
    this.districtValue = null;
    this.districtData = this.getCityDataByParentId(event);
    this.districtValue = this.districtData[0] && this.districtData[0].areaId;
    this.cityChange();
  }

  /**
   * 区选择框值改变
   * param event
   */
  public districtNameChange(event): void {
    this.cityChange();
  }

  /**
   * 获取所有城市信息
   */
  private getAllCityInfo(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.$systemService.getAllCityInfo().subscribe((result: ResultModel<CityInfo[]>) => {
        if (result.code === 0) {
          this.allCityInfo = result.data;
          this.provinceData = this.getProvinceData();
          resolve();
        } else {
          reject();
        }
      });
    });
  }

  /**
   * 获取所有的省
   * returns {any[]}
   */
  private getProvinceData(): CityInfo[] {
    return this.allCityInfo.filter(item => item.level === 1);
  }

  /**
   * 通过parentId 获取对应的数据集合
   * param parentId
   * returns {any[]}
   */
  private getCityDataByParentId(parentId: number): CityInfo[] {
    return this.allCityInfo.filter(item => item.parentId === parentId);
  }

  /**
   * 通过属性获取对应的cityInfo
   * param {string} field
   * param value
   * returns {CityInfo}
   */
  private getCityItemByField(field: string, value: any): CityInfo {
    return this.allCityInfo.find(item => item[field] === value);
  }

  /**
   * 城市信息改变发送给子组件
   */
  private cityChange(): void {
    const cityInfo = {
      provinceName: this.getCityItemByField('areaId', this.provinceValue).areaName,
      cityName: this.getCityItemByField('areaId', this.cityValue).areaName,
      districtName: this.getCityItemByField('areaId', this.districtValue).areaName
    };
    this.cityInfoChange.emit(cityInfo);
  }

  /**
   * 将值转换为select可用的areaId
   */
  private setCityInfoValue(): void {
    this.provinceValue = this.getCityItemByField('areaName', this.selectCityInfo.provinceName).areaId;
    this.cityData = this.getCityDataByParentId(this.provinceValue);
    this.cityValue = this.getCityItemByField('areaName', this.selectCityInfo.cityName).areaId;
    this.districtData = this.getCityDataByParentId(this.cityValue);
    this.districtValue = this.getCityItemByField('areaName', this.selectCityInfo.districtName).areaId;
  }
}


