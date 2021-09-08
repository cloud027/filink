/**
 * Created by xiaoconghu on 2020/6/9.
 */
import {DynamicRenderDirective} from './dynamic-render.directive';
import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {DynamicRenderService} from './dynamic-render.service';

/**
 * 动态加载组件
 */
@Component({
  selector: 'xc-dynamic-render',
  template: `
    <div class="ad-banner-example">
      <ng-template appRender></ng-template>
    </div>
  `,
  providers: [DynamicRenderService],
})
export class DynamicRenderComponent implements OnInit, OnDestroy, OnChanges {
  // 组件名称
  @Input()
  componentName: string;
  // 组件input值
  @Input()
  componentInputs: any;
  // 视图插口
  @ViewChild(DynamicRenderDirective) renderHost: DynamicRenderDirective;

  constructor(private $dynamicRenderService: DynamicRenderService) {
  }

  ngOnInit() {
    this.$dynamicRenderService.loadComponent(this.renderHost.viewContainerRef, this.componentName);
    this.$dynamicRenderService.setInputs(this.componentInputs);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.$dynamicRenderService.componentRef && this.$dynamicRenderService.componentRef.instance) {
      this.$dynamicRenderService.setInputs(this.componentInputs);
    }
  }

  ngOnDestroy() {
    this.$dynamicRenderService.destroyComponents();
  }
}
