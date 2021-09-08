import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SliderValueConst} from '../../../../business-module/application-system/share/const/slider.const';
import {NzI18nService} from 'ng-zorro-antd';
import {ApplicationInterface} from '../../../../../assets/i18n/application/application.interface';
import {Router} from '@angular/router';
import {ApplicationFinalConst} from '../../../../business-module/application-system/share/const/application-system.const';
import {LanguageEnum} from '../../../enum/language.enum';

@Component({
  selector: 'app-online-broadcast-model',
  templateUrl: './online-broadcast-model.component.html',
  styleUrls: ['./online-broadcast-model.component.scss']
})
export class OnlineBroadcastModelComponent implements OnInit {
  // 滑块默认值
  @Input() public onlineVolumeValue: number;
  @Input() public sourceId: string;
  @Input() public equipmentList;
  @Output() public sliderNotify = new EventEmitter<number>();
  @Output() public sourceNotify = new EventEmitter<string>();
  public sourceName: string;
  // 滑块值的常量
  public sliderValue = SliderValueConst;
  // 滑块最大值
  public volumeMax: number = SliderValueConst.volumeMax;
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

  ngOnInit(): void {
    this.onlineVolumeValue = this.onlineVolumeValue || 0;
    const url = this.$router.url;
    if (url.includes(ApplicationFinalConst.broadcast)) {
      this.volumeMax = SliderValueConst.volumeMax;
    }
  }

  /**
   * 触发滑块事件
   */
  public handleConvenientChange(): void {
    this.sliderNotify.emit(this.onlineVolumeValue);
  }

  changeProgram(): void {
    this.equipmentList.forEach(item => {
      if (item.sequenceId === this.sourceId) {
        this.sourceName = item.equipmentName;
        return;
      }
    });
    this.sourceNotify.emit(this.sourceId);
  }
}
