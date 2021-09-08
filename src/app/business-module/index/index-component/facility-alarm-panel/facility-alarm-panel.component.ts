import {Component, Input} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {IndexTable} from '../../util/index.table';
import {FacilityAlarmTypeEnum} from '../../../../core-module/enum/alarm/alarm-type.enum';

/**
 * 设施告警组件
 */
@Component({
  selector: 'app-facility-alarm-panel',
  templateUrl: './facility-alarm-panel.component.html',
  styleUrls: ['./facility-alarm-panel.component.scss'],
})
export class FacilityAlarmPanelComponent extends IndexTable {
  // 设施id
  @Input() facilityId: string;
  // 设施设备id集合
  @Input() idData;
  // 当前告警权限
  @Input() currentAlarmRole;
  // 历史告警权限
  @Input() hisAlarmRole;

  // 告警类型枚举 当前和历史
  public facilityAlarmTypeEnum = FacilityAlarmTypeEnum;

  public constructor(public $nzI18n: NzI18nService,
                     private $router: Router
  ) {
    super($nzI18n);
  }

  /**
   * 根据告警类型跳转至当前告警或历史告警
   */
  public goToAlarmPage(event: FacilityAlarmTypeEnum): void {
    if (event === this.facilityAlarmTypeEnum.currentAlarm) {
      if (this.idData.equipmentId) {
        this.$router.navigate([`/business/alarm/current-alarm`], {
          queryParams: {
            equipmentId: this.idData.equipmentId,
            name: this.idData.name
          }
        }).then();
      }
      if (this.idData.deviceId) {
        this.$router.navigate([`/business/alarm/current-alarm`], {
          queryParams: {
            deviceId: this.idData.deviceId,
            name: this.idData.name
          }
        }).then();
      }
    } else {
      if (this.idData.equipmentId) {
        this.$router.navigate([`/business/alarm/history-alarm`], {
          queryParams: {
            equipmentId: this.idData.equipmentId,
            name: this.idData.name
          }
        }).then();
      }
      if (this.idData.deviceId) {
        this.$router.navigate([`/business/alarm/history-alarm`], {
          queryParams: {
            deviceId: this.idData.deviceId,
            name: this.idData.name
          }
        }).then();
      }
    }
  }
}
