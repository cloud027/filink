import {Component, Input, OnDestroy} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {CommonLanguageInterface} from '../../../../assets/i18n/common/common.language.interface';

/**
 * 进度条组件
 */
@Component({
  selector: 'xc-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnDestroy {
  // 是否显示加载进度条
  @Input() set isProgressBar(value: boolean) {
    if (value) {
      this.showProgressBar();
    } else {
      this.hideProgressBar();
    }
  }
  // 国际化
  public commonLanguage: CommonLanguageInterface;
  // 进度条的定时器
  public timer;
  // 进度条增长百分比
  public increasePercent;
  // 进度条初始进度
  public percent;
  // 默认关闭遮罩
  public isShowProgressBar = false;
  // 结构化
  constructor(public $nzI18n: NzI18nService ) {
    this.commonLanguage = $nzI18n.getLocaleData('common');
  }

  /**
   * 页面销毁
   */
  ngOnDestroy() {
    // 清除加载条的定时器
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  /**
   * 显示加载进度条
   */
  public showProgressBar(): void {
    this.percent = 0;
    this.increasePercent = 5;
    this.isShowProgressBar = true;
    this.timer = setInterval(() => {
      if (this.percent >= 100) {
        clearInterval(this.timer);
      } else {
        this.percent += this.increasePercent;
        if (this.percent === 50) {
          this.increasePercent = 2;
        } else if (this.percent === 80) {
          this.increasePercent = 1;
        } else if (this.percent === 99) {
          this.increasePercent = 0;
        }
      }
    }, 500);
  }

  /**
   * 隐藏加载进度条
   */
  public hideProgressBar(): void {
    this.percent = 100;
    setTimeout(() => {
      this.isShowProgressBar = false;
    }, 1000);
  }
}
