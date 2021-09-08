import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SliderValueConst} from '../../share/const/slider.const';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {NzI18nService} from 'ng-zorro-antd';
import {ApplicationInterface} from '../../../../../assets/i18n/application/application.interface';
import {Router} from '@angular/router';
import {ApplicationFinalConst} from '../../share/const/application-system.const';

@Component({
  selector: 'app-slider-model',
  templateUrl: './slider-model.component.html',
  styleUrls: ['./slider-model.component.scss']
})
export class SliderModelComponent implements OnInit {
  // 滑块默认值
  @Input() public dimmingLightValue: number;
  @Output() public sliderNotify = new EventEmitter<number>();
  // 滑块值的常量
  public sliderValue = SliderValueConst;
  // 滑块最大值
  public lightMax: number = SliderValueConst.lightMax;
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
    this.dimmingLightValue = this.dimmingLightValue || 0;
    const url = this.$router.url;
    if (url.includes(ApplicationFinalConst.release)) {
      this.lightMax = SliderValueConst.max;
    }
  }

  /**
   * 触发滑块事件
   */
  public handleConvenientChange() {
    this.sliderNotify.emit(this.dimmingLightValue);
  }
}
