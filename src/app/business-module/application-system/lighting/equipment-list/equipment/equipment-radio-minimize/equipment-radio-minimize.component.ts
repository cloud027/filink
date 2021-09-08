import {Component, OnInit} from '@angular/core';
import {ControlInstructEnum} from '../../../../../../core-module/enum/instruct/control-instruct.enum';
import {ResultModel} from '../../../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../../../shared-module/enum/result-code.enum';
import {ApplicationService} from '../../../../share/service/application.service';
import {FiLinkModalService} from '../../../../../../shared-module/service/filink-modal/filink-modal.service';
import {EnergyApiService} from '../../../../../energy/share/service/energy/energy-api.service';
import {ApplicationInterface} from '../../../../../../../assets/i18n/application/application.interface';
import {LanguageEnum} from '../../../../../../shared-module/enum/language.enum';
import {NzI18nService} from 'ng-zorro-antd';

@Component({
  selector: 'app-equipment-radio-minimize',
  templateUrl: './equipment-radio-minimize.component.html',
  styleUrls: ['./equipment-radio-minimize.component.scss']
})
export class EquipmentRadioMinimizeComponent implements OnInit {
  // 最小化
  minimize: boolean = false;
  // 设备ID
  radioId: string = '';
  // 设备名称
  radioName: string = '';
  // 广播的设备列表
  equipmentList: any = [];
  // 收缩
  shrinkage: boolean = false;
  // 收广播类型
  radioType: number;
  // 设备列表多语言
  public languageTable: ApplicationInterface;

  constructor(private $applicationService: ApplicationService,
              // 多语言配置
              private $nzI18n: NzI18nService,
              private $message: FiLinkModalService,
              private $energyApiService: EnergyApiService) {
    this.languageTable = $nzI18n.getLocaleData(LanguageEnum.application);
  }

  ngOnInit(): void {
    this.$energyApiService.subscribeMessage.subscribe(msg => {
      console.log(msg);
      this.minimize = true;
      this.radioId = msg.radioId;
      this.radioName = msg.radioName;
      this.radioType = msg.type;
      this.shrinkage = false;
    });
  }

  stop(): void {
    const radioData = JSON.parse(sessionStorage.getItem('radioData'));
    this.minimize = false;
    // 停止广播
    const listParams = {
      commandId: ControlInstructEnum.broadcastOnlineStop,
      equipmentIds: radioData.equipmentIds,
      param: {
        sourceId: radioData.param.sourceId, // 录音设备真实id  sequenceId
        isStop: '1', //  0 - 开始   1 - 停止.
      }
    };
    if (this.radioType === 1) {
      this.$applicationService.instructDistribute(listParams).subscribe((res: ResultModel<string>) => {
        if (res.code === ResultCodeEnum.success) {
          sessionStorage.removeItem('radioData');
          this.$message.success(`${this.languageTable.contentList.distribution}!`);
        } else {
          this.$message.error(res.msg);
        }
      });
    } else {
      const groupParams = {
        commandId: ControlInstructEnum.broadcastOnlineStop,
        groupIds: radioData.groupIds,
        param: {
          sourceId: radioData.param.sourceId, // 录音设备真实id  sequenceId
          isStop: '1', //  0 - 开始   1 - 停止.
        }
      };
      this.$applicationService.groupControl(groupParams).subscribe((res: ResultModel<string>) => {
        if (res.code === ResultCodeEnum.success) {
          sessionStorage.removeItem('radioData');
          this.$message.success(`${this.languageTable.contentList.distribution}!`);
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  }
}
