import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../enum/language.enum';
import * as lodash from 'lodash';

declare const MAP_TYPE;

/**
 * 地图左上角搜索组件
 */
@Component({
  selector: 'app-map-search',
  templateUrl: './map-search.component.html',
  styleUrls: ['./map-search.component.scss']
})
export class MapSearchComponent implements OnInit {
  // 搜素结果选项
  @Input()
  public options: any[] = [];
  // 输入框变化事件
  @Output() inputChange = new EventEmitter<any>();
  // 选中设施点
  @Output() selectMarker = new EventEmitter();
  // 定位用于谷歌地图定位
  @Output() locationEvent = new EventEmitter();
  // 搜素框vale
  public inputValue;
  // 首页语言包
  public indexLanguage: IndexLanguageInterface;
  // 搜素类型名称
  public searchTypeName;
  // 搜素类型显示隐藏
  public IndexObj = {
    facilityNameIndex: 1,
    bMapLocationSearch: -1,
    gMapLocationSearch: -1,
  };
  // 搜索key
  public searchKey;
  // 搜索防抖
  searchDebounce = lodash.debounce((value) => {
    this.inputChange.emit(value);
  }, 500);

  constructor(private $i18n: NzI18nService) {
  }

  ngOnInit() {
    this.indexLanguage = this.$i18n.getLocaleData(LanguageEnum.index);
    this.searchTypeName = this.indexLanguage.searchDeviceName;
  }

  /**
   * 设施名称搜索
   */
  public searchFacilityName() {
    this.searchTypeName = this.indexLanguage.searchDeviceName;
    this.IndexObj = {
      facilityNameIndex: 1,
      bMapLocationSearch: -1,
      gMapLocationSearch: -1,
    };
  }

  /**
   * 地址搜索
   */
  public searchAddress() {
    this.searchTypeName = this.indexLanguage.searchAddress;
    if (MAP_TYPE === 'baidu') {
      this.IndexObj = {
        facilityNameIndex: -1,
        bMapLocationSearch: 1,
        gMapLocationSearch: -1,
      };
    } else if (MAP_TYPE === 'google') {
      this.IndexObj = {
        facilityNameIndex: -1,
        bMapLocationSearch: -1,
        gMapLocationSearch: 1,
      };
    }
  }

  /**
   * 搜索input事件
   * param value
   */
  public onInput(value: string): void {
    const _value = value.trim();
    this.searchDebounce(_value);
  }

  /**
   * 键盘按下事件
   * param event
   */
  public keyDownEvent(event): void {
    if (event.key === 'Enter') {
      const option = this.options.find(item => item.pointId === this.inputValue);
      this.selectMarker.emit(option);
    }
  }

  /**
   * 选择搜索框值变化
   * param event
   * param data
   */
  public optionChange(event, option): void {
    this.selectMarker.emit(option);
  }

  /**
   * 定位
   */
  public location(): void {
    const key = this.searchKey.trimLeft().trimRight();
    if (!key) {
      return;
    }
    this.locationEvent.emit(key);
  }

}
