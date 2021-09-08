import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StepsModel} from '../../../../../core-module/enum/application-system/policy.enum';

@Component({
  selector: 'app-xc-steps',
  templateUrl: './xc-steps.component.html',
  styleUrls: ['./xc-steps.component.scss']
})
export class XcStepsComponent implements OnInit {
  // 选中的步骤数
  @Input() isActiveStepsCount: number;
  // 步骤条渲染
  @Input() setData:any[] = [];
  // 发送事件给父组件
  @Output() notify = new EventEmitter<number>();

  constructor() {
  }

  public ngOnInit(): void {
  }

  /**
   * 切换步骤条
   * @ param data
   */
  public handChangeSteps(data: StepsModel): void {
    this.notify.emit(Number(data.number));
  }
}
