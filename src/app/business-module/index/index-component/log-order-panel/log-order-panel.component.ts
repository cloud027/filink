import {Component, Input, OnInit} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {IndexTable} from '../../util/index.table';
import {MapCoverageService} from '../../../../shared-module/service/index/map-coverage.service';
import {DetailCode} from '../../shared/enum/index-enum';
import {MapTypeEnum} from '../../../../core-module/enum/index/index.enum';

/**
 * 日志和工单组件
 */
@Component({
  selector: 'app-log-order-panel',
  templateUrl: './log-order-panel.component.html',
  styleUrls: ['./log-order-panel.component.scss']
})
export class LogOrderPanelComponent extends IndexTable implements OnInit {
  // 设施id
  @Input() facilityId: string;
  // 设施name
  @Input() facilityName: string;
  // 设施设备id对象集合
  @Input() idData: string;
  // 设施设备类型id
  @Input() facilityType: string;
  // 权限code
  @Input() facilityPowerCode = [];
  // 工单权限
  @Input() workOrderRole;
  // 设施日志权限
  @Input() deviceLogRole;
  操作日志权限;
  @Input() operationLogRole;
  // 权限码
  public powerCode = DetailCode;
  // 日志title
  public logTitleName: string;
  // 地图设施/设备类型
  public mapTypeEnum = MapTypeEnum;
  // 当前图层
  private indexType = this.$mapCoverageService.showCoverage;

  constructor(
    public $nzI18n: NzI18nService,
    private $router: Router,
    private $mapCoverageService: MapCoverageService,
  ) {
    super($nzI18n);
  }

  public ngOnInit(): void {
    // 日志名称初始化
    this.logTitleName = this.indexLanguage.equipmentLog;
  }

  /**
   * 跳转
   */
  navigatorTo(url) {
    this.$router.navigate([url], {queryParams: {id: this.facilityId}}).then();
  }

  /**
   * 跳转至设施日志列表
   */
  goToFacilityLogList() {
    if (this.$mapCoverageService.showCoverage === this.mapTypeEnum.facility) {
      this.$router.navigate([`/business/facility/facility-log`], {queryParams: {id: this.facilityId}}).then();
    } else {
      this.$router.navigate([`/business/facility/facility-log`], {queryParams: {equipmentId: this.facilityId}}).then();
    }
  }

}
