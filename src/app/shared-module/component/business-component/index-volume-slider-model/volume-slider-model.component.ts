import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IndexSliderValueConst} from '../../../const/index-volume-const';
import {NzI18nService} from 'ng-zorro-antd';
import {ApplicationInterface} from '../../../../../assets/i18n/application/application.interface';
import {Router} from '@angular/router';
import {LanguageEnum} from '../../../enum/language.enum';
@Component({
  selector: 'app-index-volume-slider-model',
  templateUrl: './volume-slider-model.component.html',
  styleUrls: ['./volume-slider-model.component.scss']
})
export class IndexVolumeSliderModelComponent implements OnInit {
  // 滑块默认值
  @Input() public volumeValue: number;
  @Output() public sliderNotify = new EventEmitter<number>();
  // 滑块值的常量
  public sliderValue = IndexSliderValueConst;
  // 滑块最大值
  public volumeMax: number = IndexSliderValueConst.volumeMax;
  // 设备列表多语言
  public languageTable: ApplicationInterface;

  constructor(
    // 路由
    public $router: Router,
    // 多语言配置
    private $nzI18n: NzI18nService,
  ) {
    // 表格多语言配置
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
  }

  ngOnInit() {
    this.volumeValue = this.volumeValue || 0;
    const url = this.$router.url;
    if (url.includes('broadcast')) {
      this.volumeMax = IndexSliderValueConst.volumeMax;
    }
  }

  /**
   * 触发滑块事件
   */
  public handleConvenientChange() {
    this.sliderNotify.emit(this.volumeValue);
  }
}
