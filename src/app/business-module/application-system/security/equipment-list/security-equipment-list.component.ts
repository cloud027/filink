import {Component, OnInit} from '@angular/core';
import {ApplicationInterface} from '../../../../../assets/i18n/application/application.interface';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {NzI18nService} from 'ng-zorro-antd';
import {SecurityEnum} from '../../share/enum/auth.code.enum';

@Component({
  selector: 'app-security-equipment-list',
  templateUrl: './security-equipment-list.component.html',
  styleUrls: ['./security-equipment-list.component.scss']
})
export class SecurityEquipmentListComponent implements OnInit {
  // 是否显示地图下表格
  public isShowTable: boolean = true;
  // 安防设备列表控制table按钮的显隐
  public isSecurity: boolean = true;
  // 应用系统的多语言
  public languageTable: ApplicationInterface;

  public securityEnum =  SecurityEnum;

  constructor(
    private $nzI18n: NzI18nService
  ) {
    // 多语言
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
  }

  /**
   * 地图下设备列表是否展示
   */
  public onShowEquipmentTable(event: boolean): void {
    this.isShowTable = event;
  }
}
