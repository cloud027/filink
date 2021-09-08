import {Component, Input, OnInit} from '@angular/core';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {LanguageEnum} from '../../../../enum/language.enum';
import {NzI18nService} from 'ng-zorro-antd';
import {MapService} from '../../../../../core-module/api-service/index/map';
import {ExecuteInstructionsModel} from '../../../../../business-module/index/shared/model/execute-instructions.model';
import {FiLinkModalService} from '../../../../service/filink-modal/filink-modal.service';
import {IndexLanguageInterface} from '../../../../../../assets/i18n/index/index.language.interface';
import {
  IndexBroadcastOperatePermission,
  IndexCameraOperatePermission,
  IndexIlluminationOperatePermission,
  IndexInformationScreenOperatePermission
} from '../../../../../core-module/enum/index-batch-operate-permission';
import {DynamicComponentCommon} from '../dynamic-component-common';
import {ControlInstructEnum} from '../../../../../core-module/enum/instruct/control-instruct.enum';
import {FacilityForCommonService} from '../../../../../core-module/api-service/facility';

@Component({
  selector: 'app-button-control',
  templateUrl: './button-control.component.html',
  styleUrls: ['./button-control.component.scss']
})
export class ButtonControlComponent extends DynamicComponentCommon implements OnInit {
  @Input()
  id;
  @Input()
  buttonList: any[] = [];
  // 公共模块国际化
  public commonLanguage: CommonLanguageInterface;
  // 首页国际化
  public indexLanguage: IndexLanguageInterface;

  constructor(
    private $nzI18n: NzI18nService,
    public $mapService: MapService,
    public $message: FiLinkModalService,
    public $facilityCommonService: FacilityForCommonService
  ) {
    super($mapService, $message, $facilityCommonService);
  }

  ngOnInit() {
    this.buttonList.forEach((item, index) => {
      let enumCode;
      if (item.showType === 'E004') {
        enumCode = IndexInformationScreenOperatePermission;
      } else if (item.showType === 'E005') {
        enumCode = IndexCameraOperatePermission;
      } else if (item.showType === 'E006') {
        enumCode = IndexBroadcastOperatePermission;
      } else {
        enumCode = IndexIlluminationOperatePermission;
      }
      Object.keys(enumCode).forEach(_item => {
        if (item.id === _item) {
          item.code = enumCode[_item];
        }
      });
    });
    // 国际化翻译
    this.indexLanguage = this.$nzI18n.getLocaleData(LanguageEnum.index);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
  }

  operate(evt: string) {
    const body: ExecuteInstructionsModel<{}> = new ExecuteInstructionsModel<{}>(evt, this.id, {});
    if (body.commandId === ControlInstructEnum.turnOn || body.commandId === ControlInstructEnum.turnOff) {
      // 指令为灯的开和关时 查询指令下发模式
      this.executeInstructions(body , true);
    } else {
      this.executeInstructions(body);
    }
  }

}
