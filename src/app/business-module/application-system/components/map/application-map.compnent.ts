import {Component, Input, OnInit} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {MapStoreService} from '../../../../core-module/store/map.store.service';
import {Router} from '@angular/router';
import {FacilityService} from '../../../../core-module/api-service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {MapCoverageService} from '../../../../shared-module/service/index/map-coverage.service';
import {MapService} from '../../../../core-module/api-service';
import {SelectGroupService} from '../../../../shared-module/service/index/select-group.service';
import {AdjustCoordinatesService} from '../../../../shared-module/service/index/adjust-coordinates.service';
import {FacilityShowService} from '../../../../shared-module/service/index/facility-show.service';
import {OtherLocationService} from '../../../../shared-module/service/index/otherLocation.service';
import {CloseShowFacilityService} from '../../../../shared-module/service/index/close-show-facility.service';
import {MapLinePointUtil} from '../../../../shared-module/util/map-line-point-util';
import {MapGroupCommonComponent} from '../../../../shared-module/component/map/map-group-common.component';
import {SelectTableEquipmentChangeService} from '../../share/service/select-table-equipment-change.service';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {MapConfig as BMapConfig} from '../../../../shared-module/component/map/b-map.config';
import * as _ from 'lodash';
import {IndexApiService} from '../../../index/service/index/index-api.service';
import {SelectFacilityChangeService} from '../../share/service/select-facility-change.service';
import * as lodash from 'lodash';
import {ListTypeEnum} from '../../share/enum/list-type.enum';
import {takeUntil} from 'rxjs/operators';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';

/**
 * ??????????????????
 */
@Component({
  selector: 'app-application-map',
  templateUrl: '../../../../shared-module/component/map/map.component.html',
  styleUrls: ['../../../../shared-module/component/map/map.component.scss']
})
export class ApplicationMapComponent extends MapGroupCommonComponent implements OnInit {
  // ??????????????????, ????????????/????????????
  @Input() listType: ListTypeEnum;
  // ????????????????????????????????????????????????????????????????????????????????????????????????????????????
  public equipmentSelected;
  // ????????????
  public equipmentTypes: string[] = [];
  constructor(public $nzI18n: NzI18nService,
              public $mapStoreService: MapStoreService,
              public $router: Router,
              public $facilityService: FacilityService,
              public $modalService: FiLinkModalService,
              public $mapCoverageService: MapCoverageService,
              public $indexMapService: MapService,
              public $selectGroupService: SelectGroupService,
              public $adjustCoordinatesService: AdjustCoordinatesService,
              public $facilityShowService: FacilityShowService,
              public $message: FiLinkModalService,
              public $otherLocationService: OtherLocationService,
              public $closeShowFacilityService: CloseShowFacilityService,
              public $mapLinePointUtil: MapLinePointUtil,
              public $indexApiService: IndexApiService,
              private $selectTableEquipmentChangeService: SelectTableEquipmentChangeService,
              // ??????????????????????????????
              private $selectFacilityChangeService: SelectFacilityChangeService,
  ) {
    super($nzI18n, $mapStoreService, $router,
      $facilityService, $modalService, $mapCoverageService,
      $indexMapService, $selectGroupService, $adjustCoordinatesService, $facilityShowService, $message, $otherLocationService, $closeShowFacilityService, $mapLinePointUtil, $indexApiService);
  }

  /**
   * ????????????
   */
  dragEnd = lodash.debounce(() => {
    this.locationType = false;
    if (this.mapService.getZoom() > BMapConfig.areaZoom) {
      // ????????????????????????????????????????????????
      this.showProgressBar.emit();
      this.getWindowAreaDatalist().then( (resolve: any[]) => {
        if (this.facilityInGroup && this.listType === ListTypeEnum.groupList) {
          // ????????????????????????????????????
          this.selectedFacility(this.facilityInGroup);
        }
        if (this.equipmentSelected && this.listType === ListTypeEnum.equipmentList) {
          // ????????????????????????
          this.highLightEquipments(this.equipmentSelected, resolve);
        }
      });
      this.hideProgressBar.emit();
      this.locationId = null;
    }
  }, 100, {leading: false, trailing: true});
  public ngOnInit(): void {
    // ??????????????????
    this.indexLanguage = this.$nzI18n.getLocaleData(LanguageEnum.index);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.InspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    // ????????????
    this.typeLg = JSON.parse(localStorage.getItem('localLanguage'));
    // ??????????????????
    this.roleAlarm = SessionUtil.checkHasRole('02');
    this.searchTypeName = this.indexLanguage.equipmentName;
    this.mapTypeId = 'roadmap';
    this.title = this.indexLanguage.chooseFibre;
    this.indexType = this.$mapCoverageService.showCoverage;
    // ?????????????????????
    this.initFn();
    // ?????????????????????
    this.initAreaPoint();
    // ?????????????????????
    this.changChooseUtil();
    // ?????????????????????????????????
    this.adjustCoordinatesUtil();
    // ???????????????????????????????????????
    this.$selectTableEquipmentChangeService.eventEmit.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value.type === 'equipment') {
        // ??????????????????
        if (_.isEmpty(value.equipmentData)) {
          if (value.isFromTable === false) {
            return;
          }
          //  ????????????????????????????????????
          this.resetAllTargetMarker();
          //  ???????????????
          return;
        }
        this.targetMarkerArr = [];
        // ??????????????????????????????
        this.locationByIdFromTable(value.equipmentData);
        this.equipmentSelected = _.cloneDeep(value.equipmentData);
      }
    });
    // ??????????????????
    if (this.$router.url.indexOf('lighting') > -1) {
      this.equipmentTypes = [EquipmentTypeEnum.singleLightController, EquipmentTypeEnum.centralController];
    } else if (this.$router.url.indexOf('release') > -1) {
      this.equipmentTypes = [EquipmentTypeEnum.informationScreen];
    } else if (this.$router.url.indexOf('security') > -1) {
      this.equipmentTypes = [EquipmentTypeEnum.camera];
    }
  }

  /**
   * ?????????????????????????????????
   */
  public locationByIdFromTable(data) {
    // ???????????????????????????????????????????????????????????????
    const locationTarget = data[0];
    // ??????????????????????????????/??????ID
    this.locationId = locationTarget.equipmentId;
    // ?????????????????????
    this.locationType = true;
    // ??????????????????
    if (this.mapService.mapInstance) {
      this.mapService.mapInstance.clearOverlays();
    }
    if (this.mapService.markerClusterer) {
      this.mapService.markerClusterer.clearMarkers();
    }
    const position = locationTarget.positionBase.split(',');
    const item = {lng: parseFloat(position[0]), lat: parseFloat(position[1])};
    if (this.mapService.mapInstance) {
      this.mapService.setCenterAndZoom(item['lng'], item['lat'], BMapConfig.maxZoom);
    }

    this.getWindowAreaDatalist().then((resolve: any[]) => {
      this.highLightEquipments(data, resolve);
    });
  }

  /**
   * ?????????????????????
   * @param data ??????????????????
   * @param resolve ???????????????????????????????????????
   */
  public highLightEquipments (data, resolve: any[]) {
    data.forEach(dataItem => {
      if (resolve.length) {
        let equipmentId;
        resolve.forEach(resItem => {
          resItem.equipmentList.forEach(_item => {
            if (_item.equipmentId === dataItem.equipmentId) {
              equipmentId = resItem.equipmentList[0].equipmentId;
            }
          });
        });
        // ????????????????????????
        if (equipmentId) {
          this.selectMarkerId(equipmentId);
        }
      }
    });
  }
  /**
   * ????????????2??????????????????
   * param id
   * param data
   */
  multipleClick(id, data) {
    if (data.facilityType === this.mapTypeEnum.equipment && data.equipmentList.length > 1) {
      if (data.equipmentList && data.equipmentList.length > 0) {
        this.$selectFacilityChangeService.eventEmit.emit({equipmentIds: data.equipmentList.map(item => item.equipmentId)});
      }
      this.equipmentTableWindow(id, data);
    }
  }
  public queryDeviceByName(value): void {
    if (!value || value === '') {
      return;
    }
    const body = {
      filterConditions: [
        {
          filterField: 'equipmentName',
          operator: 'like',
          filterValue: value
        },
        {
          filterField: 'equipmentType',
          operator: 'in',
          filterValue: this.equipmentTypeArr
        }
      ]
    };
    this.$indexMapService.queryEquipmentByName(body).subscribe((result: ResultModel<any>) => {
      result.data.forEach(item => {
        const devicePoint = item.positionBase.split(',');
        item['facilityName'] = item.equipmentName;
        item['facilityId'] = item.equipmentId;
        item['facilityType'] = 'equipment';
        item['lng'] = +devicePoint[0];
        item['lat'] = +devicePoint[1];
        item['equipmentList'] = [];
        item['type'] = 'device';
        item['code'] = null;
        item['show'] = true;
      });
      this.options = result.data;
    });
  }
}
