import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';

/**
 * 设备详细信息
 * created by PoHe
 */
@Component({
  selector: 'app-equipment-detail-page-info',
  templateUrl: './equipment-view-detail.component.html',
  styleUrls: ['./equipment-view-detail.component.scss']
})
export class EquipmentViewDetailComponent implements OnInit {

  // 设备管理国际化实例
  public language: FacilityLanguageInterface;
  // 设备id
  public equipmentId: string = '';
  // 设施id
  public deviceId: string = '';
  // 序列号
  public serialNum: string = '';
  // 设施类型
  public deviceType: string = '';
  /**
   * 构造器
   */
  constructor(
    private $nzI18n: NzI18nService,
    private $active: ActivatedRoute,
  ) {
  }

  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    // 获取参数
    this.$active.queryParams.subscribe(params => {
      this.equipmentId = params.equipmentId;
    });
  }
}
