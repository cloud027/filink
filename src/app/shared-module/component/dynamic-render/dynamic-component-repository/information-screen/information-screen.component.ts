import {Component, Input, OnInit} from '@angular/core';
import {ExecuteInstructionsModel} from '../../../../../business-module/index/shared/model/execute-instructions.model';
import {ResultModel} from '../../../../model/result.model';
import {ResultCodeEnum} from '../../../../enum/result-code.enum';
import {MapService} from '../../../../../core-module/api-service/index/map';
import {FiLinkModalService} from '../../../../service/filink-modal/filink-modal.service';
import {LanguageEnum} from '../../../../enum/language.enum';
import {NzI18nService} from 'ng-zorro-antd';
import {IndexLanguageInterface} from '../../../../../../assets/i18n/index/index.language.interface';
import {ControlInstructEnum} from '../../../../../core-module/enum/instruct/control-instruct.enum';

@Component({
  selector: 'app-information-screen',
  templateUrl: './information-screen.component.html',
  styleUrls: ['./information-screen.component.scss']
})
export class InformationScreenComponent implements OnInit {
  @Input()
  id;
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

  /**
   * 信息屏同步播放事件
   */
  screenPlayChange(): void {
    console.log(this.id);
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
