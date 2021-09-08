import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SelectPolymerizationService} from '../../../../shared-module/service/index/selectPolymerizationService';
import {OperationService} from '../../../../shared-module/service/index/operation.service';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {NzI18nService} from 'ng-zorro-antd';
import {SessionUtil} from '../../../../shared-module/util/session-util';

@Component({
  selector: 'app-app-select-polymerization',
  templateUrl: './app-select-polymerization.component.html',
  styleUrls: ['./app-select-polymerization.component.scss']
})
export class AppSelectPolymerizationComponent implements OnInit {
  // 向父组件发射显示分层事件
  @Output() isShowPolymerizationEmitter = new EventEmitter<boolean>();
  // 显示开关
  public showPolymerization: boolean = false;

  // 聚合方式
  public polymerizationValue: string = 'maintenance';

  // 卡片显示
  public isShowPolymerizationCard: boolean = false;
  // 国际化
  public indexLanguage: IndexLanguageInterface;
  // 项目权限
  public projectRole = SessionUtil.checkHasRole('25');


  constructor(
    private $selectPolymerizationService: SelectPolymerizationService,
    private $OperationService: OperationService,
    private $nzI18n: NzI18nService,
  ) {
    this.indexLanguage = this.$nzI18n.getLocaleData(LanguageEnum.index);
  }

  ngOnInit() {
    this.$OperationService.eventEmit.subscribe((value) => {
      if (value.polymerization === false) {
        this.showPolymerization = value.polymerization;
      }
    });
  }

  public polymerizationShow() {
    this.showPolymerization = !this.showPolymerization;
    this.isShowPolymerizationEmitter.emit(this.isShowPolymerizationCard);
  }

  public selectPolymerization(value) {
    // 运维试图聚合方式回传
    this.$selectPolymerizationService.eventEmit.emit({polymerizationValue: value});
  }

}
