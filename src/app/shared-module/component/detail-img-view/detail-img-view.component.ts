import {Component, Input, OnInit} from '@angular/core';
import {ImageViewService} from '../../service/picture-view/image-view.service';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../enum/language.enum';
import {FaultLanguageInterface} from '../../../../assets/i18n/fault/fault-language.interface';

@Component({
  selector: 'app-detail-img-view',
  templateUrl: './detail-img-view.component.html',
  styleUrls: ['./detail-img-view.component.scss']
})
export class DetailImgViewComponent implements OnInit {
  @Input() transmitData;
  // 告警国际化引用
  public language: FaultLanguageInterface;
  constructor(
    public $nzI18n: NzI18nService,
    private $imageViewService: ImageViewService,
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.fault);
  }

  ngOnInit() {
  }
  /**
   * 点击图片
   * param currentImage
   */
  public clickImage(currentImage): void {
    this.$imageViewService.showPictureView(this.transmitData, currentImage);
  }
}
