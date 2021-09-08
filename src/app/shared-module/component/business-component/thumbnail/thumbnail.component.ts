import {AfterViewInit, Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import * as _ from 'lodash';
import {NzI18nService} from 'ng-zorro-antd';
import {FiLinkModalService} from '../../../service/filink-modal/filink-modal.service';
import {BMapBaseService} from '../../../service/map-service/b-map/b-map-base.service';
import {GMapBaseService} from '../../../service/map-service/g-map/g-map-base.service';
import {FacilityService} from '../../../../core-module/api-service/facility/facility-manage';
import {FilinkMapEnum} from '../../../enum/filinkMap.enum';
import {ThumbnailBaseInfoModel} from '../../../../core-module/model/equipment/thumbnail-base-info.model';
import {PointModel} from '../../../../core-module/model/point.model';
import {ObjectTypeEnum} from '../../../../core-module/enum/facility/object-type.enum';


/**
 * 设施设备缩略图组件
 */
@Component({
  selector: 'app-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.scss']
})
export class ThumbnailComponent implements AfterViewInit {
  @Input() public deviceId?: string = '';
  @Input() public equipmentId?: string = '';
  @Input() public type: ObjectTypeEnum = ObjectTypeEnum.facility;
  @Input() public baseInfo: ThumbnailBaseInfoModel = new ThumbnailBaseInfoModel();
  // 地图类型
  @Input() public mapType: string;
  // 地图服务
  private mapService: BMapBaseService;
  // 设施点位置
  private point: PointModel = new PointModel();

  constructor(private $facilityService: FacilityService,
              private $modalService: FiLinkModalService,
              private $nzI18n: NzI18nService,
              private $router: Router) {
  }

  public ngAfterViewInit(): void {
    this.initMap();
  }

  /**
   * 初始化地图
   */
  public initMap(): void {
    // 实例化地图服务类
    if (this.mapType === FilinkMapEnum.baiDu) {
      this.mapService = new BMapBaseService();
    } else {
      this.mapService = new GMapBaseService();
    }
    this.mapService.createBaseMap('thumbnail2');
    this.mapService.enableScroll();
    if (!_.isEmpty(this.baseInfo)) {
      this.commonHandler(this.baseInfo);
    }
  }


  /**
   * 添加地图悬多个浮点
   */
  public moreMakeMarKer(baseInfoList: ThumbnailBaseInfoModel[]) {
    if (!_.isEmpty(baseInfoList)) {
      baseInfoList.forEach(item => {
        this.commonHandler(item);
      });
    }
  }

  /**
   * 回路画线
   */
  public loopDrawLine(baseInfoList) {
    this.mapService.loopDrawLine(baseInfoList);
  }

  /**
   * 添加地图悬点公共方法
   */
  private commonHandler(baseInfo: ThumbnailBaseInfoModel) {
    if (baseInfo.positionBase) {
      const position = baseInfo.positionBase.split(',');
      this.point.lng = parseFloat(position[0]);
      this.point.lat = parseFloat(position[1]);
      baseInfo.point = this.point;
      const marker = this.mapService.createMarker(baseInfo, this.type , [{
        eventName: 'click',
        eventHandler: () => {
          let queryParams ;
          if (this.equipmentId) {
            queryParams = {equipmentId: this.equipmentId};
          }
          if (this.deviceId) {
            queryParams = {deviceId: this.deviceId};
          }
          if (this.equipmentId || this.deviceId) {
            this.$router.navigate(['/business/index'], {queryParams: queryParams}).then();
          }
        }
      }]);
      this.mapService.enableScroll();
      // 地图缩放12,切合高保真效果
      this.mapService.setCenterAndZoom(baseInfo.point.lng, baseInfo.point.lat, 14);
      this.mapService.addOverlay(marker);
    }
  }
}
