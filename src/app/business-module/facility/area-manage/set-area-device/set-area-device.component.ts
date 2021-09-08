import {Component, OnInit} from '@angular/core';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {NzI18nService} from 'ng-zorro-antd';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {MapSelectorConfigModel} from '../../../../shared-module/model/map-selector-config.model';
import {ActivatedRoute, Router} from '@angular/router';
import {MapService} from '../../../../core-module/api-service/index/map';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';

/**
 * 关联设施组件
 */
@Component({
  selector: 'app-set-area-device',
  templateUrl: './set-area-device.component.html'
})
export class SetAreaDeviceComponent implements OnInit {
  // 地图显示隐藏
   public mapVisible: boolean = true;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 地图选择器配置
  public mapSelectorConfig: MapSelectorConfigModel;
  // 区域id
  public areaId: string = null;

  constructor(private $message: FiLinkModalService,
              private $nzI18n: NzI18nService,
              private $router: Router,
              private $active: ActivatedRoute,
              private $mapService: MapService,
              private $facilityCommonService: FacilityForCommonService) {
  }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.initMapSelectorConfig();
    this.areaId = this.$active.snapshot.queryParams.id;
    this.$active.queryParams.subscribe(params => {
      this.areaId = params.id;
    });
  }

  /**
   * 关联区域所选结果
   * param event
   * 需要选择器给数据类型
   */
  public mapSelectDataChange(event): void {
    const list = event.map(item => item.deviceId);
    const obj = {};
    obj[this.areaId] = list;
    this.setAreaDevice(obj);
  }

  /**
   * 弹框的显示隐藏
   * param event
   */
  public xcVisibleChange(event: boolean): void {
    if (!event) {
      this.$router.navigate(['/business/facility/area-list']).then();
    }
  }

  /**
   * 关联设施
   * param body
   * 此处不给数据类型是因为参数的key是动态的
   */
  private setAreaDevice(body: any): void {
    this.$facilityCommonService.setAreaDevice(body).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(result.msg);
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  private initMapSelectorConfig(): void {
    this.mapSelectorConfig = {
      title: this.language.setDevice,
      width: '1100px',
      height: '465px',
      showSearchSwitch: true,
      mapData: [],
      selectedColumn: [
        {
          title: this.language.deviceName, key: 'deviceName', width: 100, searchable: true, searchConfig: {type: 'input'}, isShowSort: true
        },
        {
          title: this.language.deviceCode, key: 'deviceCode', width: 100, searchable: true, searchConfig: {type: 'input'}, isShowSort: true
        },
        {
          title: this.language.deviceType, key: '_deviceType', width: 120, searchable: true,
          searchKey: 'deviceType',
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleFacility(this.$nzI18n),
            label: 'label',
            value: 'code'
          },
          isShowSort: true
        },
        {
          title: this.language.parentId, key: 'areaName', width: 100, searchable: true, searchConfig: {type: 'input'}, isShowSort: true
        }
      ]
    };
  }
}
