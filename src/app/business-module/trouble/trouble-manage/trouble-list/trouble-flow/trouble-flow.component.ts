import {Component, OnInit} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import { FaultLanguageInterface } from '../../../../../../assets/i18n/fault/fault-language.interface';
import {ActivatedRoute} from '@angular/router';
import {TroubleService} from '../../../share/service';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {ResultModel} from '../../../../../shared-module/model/result.model';
/**
 * 故障流程
 */
@Component({
  selector: 'app-trouble-flow',
  templateUrl: './trouble-flow.component.html',
  styleUrls: ['./trouble-flow.component.scss']
})
export class TroubleFlowComponent implements OnInit {
  // 告警国际化引用
  public language: FaultLanguageInterface;
  // 标题
  public title: string = '';
  // 故障id
  public troubleId: string;
  // 图片路径
  public imgSrc: string;
  // 加载loading
  public isSpinning: boolean = false;
  // 流程实例id
  private instanceId: string;
  constructor(
    private $nzI18n: NzI18nService,
    private $troubleService: TroubleService,
    private $message: FiLinkModalService,
    private $active: ActivatedRoute,
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.fault);
  }

  /**
   *  初始化
   */
  public ngOnInit(): void {
    this.title = this.language.troubleFlow;
    this.$active.queryParams.subscribe(params => {
      this.instanceId = params.instanceId;
      this.troubleId = params.id;
    });
    // 获取流程图
    this.getFlowChart();
  }

  /**
   *  获取流程图
   */
 public getFlowChart(): void {
    this.isSpinning = true;
    this.$troubleService.getFlowChart(this.instanceId).subscribe((res: Blob | ResultModel<string>) => {
        const render = new FileReader();
        const that = this;
        render.onload = function (e) {
          that.imgSrc = e.target['result'];
        };
        render.readAsDataURL(<Blob>res);
      this.isSpinning = false;
    }, () => {
      this.isSpinning = false;
    });
  }
}
