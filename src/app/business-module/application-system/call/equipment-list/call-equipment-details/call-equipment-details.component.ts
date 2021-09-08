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

@Component({
  selector: 'app-call-equipment-details',
  templateUrl: './call-equipment-details.component.html',
  styleUrls: ['./call-equipment-details.component.scss']
})
export class CallEquipmentDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('programBroadcast') programBroadcast;
  // 设备id
  public equipmentId: string = '';
  public equipmentName: string = '';
  public equipmentModel: string = '';
  public equipmentModelType: string = '';
  public sequenceId: string = '';
  public operationList = [];
  public sliderList = [];
  public callData: any;
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
  public releaseTableEnum = ReleaseTableEnum;
  public boxWidth = 500;

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
  }

  public ngOnInit(): void {
    this.$activatedRoute.queryParams.subscribe(queryParams => {
      this.callData = JSON.parse(sessionStorage.getItem('callData'));
      if (this.callData) {
        this.equipmentName = this.callData.equipmentName;
      }
      this.equipmentId = queryParams.equipmentId;
      this.equipmentModel = queryParams.equipmentModel;
      this.equipmentModelType = queryParams.equipmentModelType;
      this.sequenceId = queryParams.sequenceId;
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
      this.$message.warning('您暂无操作权限！');
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
      });
    }
  }
}
