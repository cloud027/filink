import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import * as _ from 'lodash';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../enum/language.enum';
import {ResultModel} from '../../../model/result.model';
import {ResultCodeEnum} from '../../../enum/result-code.enum';
import {PerformDataModel} from '../../../../core-module/model/group/perform-data.model';
import {EquipmentSensorModel} from '../../../../core-module/model/equipment/equipment-sensor.model';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';

/**
 * 设备上报状态信息
 * created by PoHe
 */
@Component({
  selector: 'app-equipment-status-information',
  templateUrl: './equipment-status-information.component.html',
  styleUrls: ['./equipment-status-information.component.scss']
})
export class EquipmentStatusInformationComponent implements OnInit, OnChanges {
  // 设备列表里面的音量和亮度值传给信息屏作为回写值
  @Output()
  public equipmentDetails = new EventEmitter<PerformDataModel>();
  // 传入设备id
  @Input()
  public equipmentId: string;
  // 传入设备类型
  @Input()
  public equipmentType: string;
  // 传入参数设备型号
  @Input()
  public equipmentModel: string;
  // 整个容器的宽度默认给60% 首页给90%
  @Input() containerWidth: string = '60%';
  @Input() containerLineHeight: string;
  @Input() containerHeight: string;
  @Input() containerMaxWidth: string;
  // 设备管理国际化
  public language: FacilityLanguageInterface;
  // 性能结果集
  public performanceList: EquipmentSensorModel[] = [];

  /**
   * 构造器
   */
  constructor(
    private $nzI18n: NzI18nService,
    private $facilityCommonService: FacilityForCommonService
  ) {
  }

  /**
   * 组件初始化
   */
  public ngOnInit() {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
  }

  public ngOnChanges(): void {
    if (this.equipmentId && this.equipmentType) {
      // 根据设备型号查询设备的传感值
      this.getSensor();
      this.queryPerformData();
    }
  }

  /**
   * 查询设备的传感值value
   */
  private queryPerformData(): void {
    const queryBody = new PerformDataModel();
    queryBody.equipmentId = this.equipmentId;
    queryBody.equipmentType = this.equipmentType;
    // queryBody.equipmentId = 'Vc7i1Z6w8IsrABbbQtF';
    // queryBody.equipmentType = '003';
    this.$facilityCommonService.getEquipmentDataByType(queryBody).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        const statusData = result.data ? result.data.performanceData : null;
        const data = statusData ? JSON.parse(statusData) : null;
        // 这里的值应用系统里面的设备详情里面需要
        this.equipmentDetails.emit(result.data);
        if (data && !_.isEmpty(this.performanceList)) {
          this.performanceList.forEach(item => {
            if (data[item.id] !== null && !item.defaultVal) {
              item.statusValue = typeof data[item.id] === 'number'
              && String(data[item.id]).indexOf('.') !== -1 ? data[item.id].toFixed(2) : data[item.id];
            } else if (data[item.id] !== null && item.defaultVal) {
              item.statusValue = data[item.id] === 0 ? item.val0 : item.val1;
            }
          });
        }
      }
    });
  }

  /**
   * 查询当前设备型号的传感值字段
   */
  private getSensor(): void {
    // this.equipmentId = '01WEif28Jc1ndTQVteD';
    this.$facilityCommonService.getSensor({equipmentId: this.equipmentId}).subscribe(
      (result: ResultModel<EquipmentSensorModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.performanceList = result.data || [];
          this.performanceList.forEach(item => item.statusValue = '');
        }
      });
  }
}
