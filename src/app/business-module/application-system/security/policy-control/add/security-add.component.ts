import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ClassStatusConst, RouterJumpConst} from '../../../share/const/application-system.const';
import {FinalValueEnum} from '../../../../../core-module/enum/step-final-value.enum';
import {BasicInformationComponent} from '../../../components/basic-information/basic-information.component';
import {SecurityStrategyComponent} from '../security-strategy/security-strategy.component';
import {Result} from '../../../../../shared-module/entity/result';
import {ApplicationService} from '../../../share/service/application.service';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import { NzI18nService } from 'ng-zorro-antd';
import {ApplicationInterface} from '../../../../../../assets/i18n/application/application.interface';

@Component({
  selector: 'app-security-add',
  templateUrl: './security-add.component.html',
  styleUrls: ['./security-add.component.scss']
})
export class SecurityAddComponent implements OnInit {
  isActiveSteps: number = FinalValueEnum.STEPS_FIRST;
  isShowButton = true;
  isOperation = false;
  @ViewChild('basicInfo') basicInfo: BasicInformationComponent;
  @ViewChild('strategyDetails') strategyDetails: SecurityStrategyComponent;
  // 步骤条的步骤常量值
  finalValueEnum = FinalValueEnum;
  // 步骤条数据
  setData = [];
  applicationLanguage: ApplicationInterface;
  constructor(
    public $applicationService: ApplicationService,
    public $nzI18n: NzI18nService,
    public $router: Router,
  ) {
  }

  ngOnInit() {
    this.applicationLanguage = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.setData = [
      { number: FinalValueEnum.STEPS_FIRST, activeClass: ' active', title: this.applicationLanguage.basicInformation},
      { number: FinalValueEnum.STEPS_SECOND, activeClass: '', title: this.applicationLanguage.strategyList.strategyDetails},
      { number: FinalValueEnum.STEPS_THIRD, activeClass: '', title: this.applicationLanguage.finish}
    ];
  }

  handChangeSteps(value) {
    this.isActiveSteps = value;
    this.handBasicSteps(value);
  }

  /**
   * 上一步操作
   * @ param value
   */
  handPrevSteps(value) {
    this.isActiveSteps = value - 1;
  }

  /**
   * 下一步操作
   * @ param value
   */
  handNextSteps(value) {
    if (value === this.finalValueEnum.STEPS_FIRST) {
      this.basicInfo.handNextSteps();
    } else if (value === this.finalValueEnum.STEPS_SECOND) {
      this.strategyDetails.handNextSteps();
    }
    this.isActiveSteps = value + 1;
  }

  /**
   * 安防新增策略
   */
  securityPolicyAdd() {
    const strategyRefList = [
      {
        'refName': '信息发布设备1',
        'refType': '设备',
        'refId': 'j9uEiQHZprAvaUvCI7b',
      }
    ];
    const instructSecurity = {
      'refType': '1',
      'refId': 'j9uEieHZssAsaUvCI7b',
      'execOpera': '222'
    };
    const params = Object.assign({}
      , this.basicInfo.stepsFirstParams
      , {strategyRefList}
      , this.strategyDetails.stepsSecondParams
      , {instructSecurity});
    this.$applicationService.securityPolicyAdd(params).subscribe((result: Result) => {
      if (result.code === 0) {
        this.$router.navigate([RouterJumpConst.securityPolicyControl], {}).then();
      }
    }, () => {
    });
  }

  /**
   * 数据提交
   */
  handStepsSubmit() {
    this.securityPolicyAdd();
  }

  /**
   * 取消操作
   */
  handCancelSteps() {
    this.$router.navigate([RouterJumpConst.securityWorkbench], {}).then();
  }

  /**
   * 切换步骤改变步骤样式和状态
   * @ param value
   */
  handBasicSteps(value) {
    if (this.isActiveSteps > this.finalValueEnum.STEPS_THIRD) {
      return;
    } else {
      this.isActiveSteps = value;
    }
    this.setData.forEach(item => {
      if (this.isActiveSteps > item.number) {
        item.activeClass = ` ${ClassStatusConst.stepsFinish}`;
      } else if (this.isActiveSteps === item.number) {
        item.activeClass = ` ${ClassStatusConst.stepsActive}`;
      } else {
        item.activeClass = '';
      }
    });
  }
}
