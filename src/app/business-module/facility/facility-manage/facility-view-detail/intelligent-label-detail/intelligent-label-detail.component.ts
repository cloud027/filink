import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {OdnDeviceService} from '../../../../../core-module/api-service/statistical/odn-device';
import {Result} from '../../../../../shared-module/entity/result';
import {SmartService} from '../../../../../core-module/api-service/facility/smart/smart.service';
import {StatisticalLanguageInterface} from '../../../../../../assets/i18n/statistical/statistical-language.interface';
import {BoxInfoModel} from '../../../share/model/box-info.model';
import {SmartLabelConfig} from '../../../share/const/smart-label.config';
import {DeviceChartUntil} from '../../../../../shared-module/util/device-chart-until';
import {DeviceTypeEnum} from '../../../../../core-module/enum/facility/facility.enum';

/**
 * 设施详情智能门禁组件
 */
@Component({
  selector: 'app-intelligent-label-detail',
  templateUrl: './intelligent-label-detail.component.html',
  styleUrls: ['./intelligent-label-detail.component.scss']
})
export class IntelligentLabelDetailComponent implements OnInit {
  // 设施id
  @Input()
  public deviceId: string;
  // 设施类型
  @Input()
  public deviceType: string;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 公共语言包
  public commonLanguage: CommonLanguageInterface;
  // 统计语言包
  public statisticalLanguage: StatisticalLanguageInterface;
  // 柱状图配置
  public barChartOption = {};
  // 饼图配置
  public pieChartOption = {};
  // 智能标签信息
  public smartLabelInfo = new BoxInfoModel();
  // 设施类型code
  DeviceTypeCode;

  constructor(private $nzI18n: NzI18nService,
              private $odnDeviceService: OdnDeviceService,
              private $smartService: SmartService,
              private $router: Router) {
  }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData('facility');
    this.commonLanguage = this.$nzI18n.getLocaleData('common');
    this.statisticalLanguage = this.$nzI18n.getLocaleData('statistical');
    // 设施类型code
    this.DeviceTypeCode = DeviceTypeEnum;
    this.getSmartLabelInfo();
    this.getFiberPortStatistics();
  }

  /**
   * 获取端口数量
   */
  public getFiberPortStatistics(): void {
    this.$odnDeviceService.queryDevicePortStatistics(this.deviceId).subscribe((result: Result) => {
      if (result.code === 0 && result.data) {
        this.setOption(result.data);
      }
    });
  }

  /**
   * 查询智能标签信息
   */
  public getSmartLabelInfo(): void {
    this.$smartService.queryFacilityBusInfoById(this.deviceId, this.deviceType).subscribe((result: Result) => {
      if (result.code === 0 && result.data.boxList && result.data.boxList.length > 0) {
        this.smartLabelInfo = result.data.boxList[0] as BoxInfoModel;
        this.translateProperty(this.smartLabelInfo);
      }
    });
  }

  /**
   * 跳转到实景图
   * param url
   */
  public navigatorTo(url): void {
    this.$router.navigate([url], {queryParams: {id: this.deviceId}, queryParamsHandling: 'preserve'}).then();
  }

  /**
   * 设置eCharts配置
   * param data
   */
  public setOption(data): void {
    const barXData = [this.statisticalLanguage.usedCount, this.statisticalLanguage.unusedCount, this.statisticalLanguage.exceptionCount,
      this.statisticalLanguage.advanceCount
      , this.statisticalLanguage.virtualCount];
    const barData = [data.usedCount, data.unusedCount, data.exceptionCount, data.advanceCount, data.virtualCount];
    // 端口统计柱形图
    this.barChartOption = DeviceChartUntil.setStatisticsBarChartOption(this.commonLanguage, barData, barXData);
    const pieData = [
      {
        value: (data.totalCount > 0 && data.usedCount === 0) ? null : data.usedCount,
        name: this.statisticalLanguage.usedCount
      },
      {
        value: (data.totalCount > 0 && data.unusedCount === 0) ? null : data.unusedCount,
        name: this.statisticalLanguage.unusedCount
      },
      {
        value: (data.totalCount > 0 && data.exceptionCount === 0) ? null : data.exceptionCount,
        name: this.statisticalLanguage.exceptionCount
      },
      {
        value: (data.totalCount > 0 && data.advanceCount === 0) ? null : data.advanceCount,
        name: this.statisticalLanguage.advanceCount
      },
      {
        value: (data.totalCount > 0 && data.virtualCount === 0) ? null : data.virtualCount,
        name: this.statisticalLanguage.virtualCount
      }
    ];
    // 设施详情智能标签端口占用统计
    this.pieChartOption = DeviceChartUntil.setStatisticsPieChartOption(this.commonLanguage, pieData);
  }

  /**
   * 智能标签属性值的翻译
   * param smartLabelInfo
   */
  private translateProperty(smartLabelInfo: BoxInfoModel) {
    // 直通 0 分歧 1
    if (smartLabelInfo.follow !== null) {
      smartLabelInfo.follow = SmartLabelConfig.getFollowEnum(this.$nzI18n, smartLabelInfo.follow) as string;
    }
    if (smartLabelInfo.standard !== null) {
      smartLabelInfo.standard = SmartLabelConfig.getStandardEnum(this.$nzI18n, smartLabelInfo.standard) as string;
    }
    if (smartLabelInfo.layMode !== null) {
      smartLabelInfo.layMode = SmartLabelConfig.getLayModeEnum(this.$nzI18n, smartLabelInfo.layMode) as string;
    }
    if (smartLabelInfo.sealMode !== null) {
      smartLabelInfo.sealMode = SmartLabelConfig.getSealModeEnum(this.$nzI18n, smartLabelInfo.sealMode) as string;
    }
    if (smartLabelInfo.installationMode !== null) {
      smartLabelInfo.installationMode = SmartLabelConfig.getInstallationModeEnum(this.$nzI18n, smartLabelInfo.installationMode) as string;
    }
    if (smartLabelInfo.deviceForm !== null) {
      smartLabelInfo.deviceForm = SmartLabelConfig.getDeviceFormEnum(this.$nzI18n, smartLabelInfo.deviceForm) as string;
    }
    if (smartLabelInfo.labelType !== null) {
      smartLabelInfo.labelType = SmartLabelConfig.getLabelTypeEnum(this.$nzI18n, smartLabelInfo.labelType) as string;
    }
    if (smartLabelInfo.labelState !== null) {
      smartLabelInfo.labelState = SmartLabelConfig.getLabelStateEnum(this.$nzI18n, smartLabelInfo.labelState) as string;
    }
  }
}
