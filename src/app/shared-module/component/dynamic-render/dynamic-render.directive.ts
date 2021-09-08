/**
 * Created by xiaoconghu on 2020/6/9.
 */
import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appRender]'
})
export class DynamicRenderDirective {
  constructor(public viewContainerRef: ViewContainerRef) {
  }
}


export interface AdComponent {
  data: any;
}

