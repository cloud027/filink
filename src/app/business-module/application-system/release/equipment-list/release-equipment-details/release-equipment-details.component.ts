import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApplicationService} from '../../../share/service/application.service';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {ApplicationInterface} from '../../../../../../assets/i18n/application/application.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {InstructConfig} from '../../../share/config/instruct.config';
import {OnlineLanguageInterface} from '../../../../../../assets/i18n/online/online-language.interface';
import {SessionUtil} from '../../../../../shared-module/util/session-util';
import {ReleaseTableEnum} from '../../../share/enum/auth.code.enum';
import {ControlInstructEnum} from '../../../../../core-module/enum/instruct/control-instruct.enum';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';

@Component({
  selector: 'app-release-equipment-details',
  templateUrl: './release-equipment-details.component.html',
  styleUrls: ['./release-equipment-details.component.scss']
})
export class ReleaseEquipmentDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('programBroadcast') programBroadcast;
  // 设备id
  public equipmentId: string = '';
  public equipmentModel: string = '';
  public operationList = [];
  public sliderList = [];
  // 亮度值
  public lightValue: number = 0;
  // 音量值
  public volumeValue: number = 0;
  // 是否显示
  public isShow: boolean = true;
  // 多语言配置
  public language: OnlineLanguageInterface;
  // 节目名称
  public programName: string = '';
  // 应用系统详情显示
  public isShowApplication: boolean = true;
  // 设备列表多语言
  public languageTable: ApplicationInterface;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  public releaseTableEnum = ReleaseTableEnum;

  constructor(
    // 路由传参
    private $activatedRoute: ActivatedRoute,
    // 提示
    private $message: FiLinkModalService,
    // 多语言配置
    private $nzI18n: NzI18nService,
    // 接口服务
    private $applicationService: ApplicationService,
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.online);
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
  }

  public ngOnInit(): void {
    this.$activatedRoute.queryParams.subscribe(queryParams => {
      this.equipmentId = queryParams.equipmentId;
      this.equipmentModel = queryParams.equipmentModel;
    });
  }

  /**
   * 销毁
   */
  public ngOnDestroy(): void {
    this.programBroadcast = null;
  }

  /**
   * 设备操作按钮
   * @ param data
   */
  public handleEquipmentOperation(id: ControlInstructEnum, code?: string): void {
    if (code && !SessionUtil.checkHasRole(code)) {
      this.$message.warning(this.commonLanguage.permissionMsg);
      return;
    }
    const params = {
      commandId: id,
      equipmentIds: [this.equipmentId],
      param: {}
    };
    const instructConfig = new InstructConfig(this.$applicationService, this.$nzI18n, this.$message);
    instructConfig.instructDistribute(params);
  }

  /**
   * 开，关，上电，下电
   * @ param data
   */
  public handleOperationEvent(data): void {
    this.operationList = data;
  }

  /**
   * 亮度和音量回写
   * @ param data
   */
  public handleEquipmentDetails(data): void {
    if (data && data.volume) {
      this.programBroadcast.volumeValue = data.volume;
      this.sliderDefault(data);
    }
    if (data && data.brightness) {
      this.programBroadcast.lightValue = data.brightness;
      this.sliderDefault(data);
    }
  }

  /**
   * 滑块默认值赋值
   * @ param data
   */
  private sliderDefault(data): void {
    if (this.programBroadcast.sliderList && this.programBroadcast.sliderList.length) {
      this.programBroadcast.sliderList.forEach(item => {
        if (item.id === ControlInstructEnum.setVolume) {
          item.value = data.volume;
        }
        if (item.id === ControlInstructEnum.dimming) {
          item.value = data.brightness;
        }
      });
    }
  }
}
