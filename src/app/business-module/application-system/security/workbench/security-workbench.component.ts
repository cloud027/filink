import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ApplicationInterface} from '../../../../../assets/i18n/application/application.interface';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {NzI18nService} from 'ng-zorro-antd';
import {CameraCodeEnum} from '../../share/enum/camera-permission.enum';

/**
 * 安防工作台页面
 */
@Component({
  selector: 'app-security-workbench',
  templateUrl: './security-workbench.component.html',
  styleUrls: ['./security-workbench.component.scss']
})
export class SecurityWorkbenchComponent implements OnInit, OnDestroy {
  /**
   * 分屏组件值
   */
  @ViewChild('splitScreen') splitScreen;
  /**
   * 国际化
   */
  public language: ApplicationInterface;
  /**
   * 权限枚举
   */
  public cameraCodeEnum = CameraCodeEnum;

  /**
   * @param $nzI18n 路由跳转服务
   */
  constructor(private $nzI18n: NzI18nService) {
  }

  ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.application);
  }

  /**
   * 页面销毁
   */
  ngOnDestroy(): void {
    this.splitScreen = null;
  }


}
