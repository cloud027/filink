import {Directive, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {DeviceStatusEnum} from '../../../../core-module/enum/facility/facility.enum';

@Directive({
  selector: '[appDeviceStatus]'
})
export class DeviceStatusDirective implements OnInit {
  @Input() appDeviceStatus: DeviceStatusEnum; // 设施状态
  private commonClass = 'icon-fiLink-l iconfont'; // 公共class
  private deviceStatusIconClass = ''; // IconClass
  private deviceStatusColorClass = ''; // ColorClass
  private i: Element;  // i标签

  constructor(private render: Renderer2, private el: ElementRef) {
  }

  public ngOnInit(): void {
    this.deviceStatusIconClass = CommonUtil.getDeviceStatusIconClass(this.appDeviceStatus).iconClass;
    this.deviceStatusColorClass = CommonUtil.getDeviceStatusIconClass(this.appDeviceStatus).colorClass;
    this.addIcon();
  }

  /**
   * 添加icon
   */
  private addIcon(): void {
    this.i = this.render.createElement('i'); // 创建i标签
    this.i.className = `${this.commonClass} ${this.deviceStatusIconClass} ${this.deviceStatusColorClass}`;
    this.render.appendChild(this.el.nativeElement, this.i); // 插入新建icon
  }

}
