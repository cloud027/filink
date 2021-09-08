import {Component, Input, OnInit} from '@angular/core';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {MapService} from '../../../../../core-module/api-service/index/map';
import {ExecuteInstructionsModel} from '../../../../../business-module/index/shared/model/execute-instructions.model';
import {ResultModel} from '../../../../model/result.model';
import {ResultCodeEnum} from '../../../../enum/result-code.enum';
import {FiLinkModalService} from '../../../../service/filink-modal/filink-modal.service';
import {IndexLanguageInterface} from '../../../../../../assets/i18n/index/index.language.interface';
import {LanguageEnum} from '../../../../enum/language.enum';
import {ControlInstructEnum} from '../../../../../core-module/enum/instruct/control-instruct.enum';

@Component({
  selector: 'app-music-control',
  templateUrl: './music-control.component.html',
  styleUrls: ['./music-control.component.scss']
})
export class MusicControlComponent implements OnInit {
  @Input()
  id;
  value: number = 25;
  // 公共模块国际化
  public commonLanguage: CommonLanguageInterface;
  // 首页国际化
  public indexLanguage: IndexLanguageInterface;
  // 操作指令枚举
  public controlInstructEnum = ControlInstructEnum;
  constructor(
    private $nzI18n: NzI18nService,
    private $mapService: MapService,
    private $message: FiLinkModalService,
  ) {
  }

  ngOnInit() {
    this.indexLanguage = this.$nzI18n.getLocaleData(LanguageEnum.index);
  }

  change(evt) {
    const body = new ExecuteInstructionsModel<{}>(
      this.controlInstructEnum.setVolume,
      this.id,
      {type: 'callCardService', fn: 'setVolume', arg1: evt},
    );
    this.executeInstructions(body);
  }

  /**
   * 执行指令下发
   */
  executeInstructions(body: ExecuteInstructionsModel<{}>) {
    this.$mapService.instructDistribute(body).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.indexLanguage.theInstructionIsIssuedSuccessfully);
      } else {
        this.$message.warning(result.msg);
      }
    });
  }
}
