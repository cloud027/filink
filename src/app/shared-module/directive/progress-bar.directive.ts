import {
  ComponentFactory, ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  ViewContainerRef
} from '@angular/core';
import {ProgressComponent} from '../component/progress/progress.component';

/**
 * 权限指令
 */
@Directive({
  selector: '[appBarProgress]'
})
export class ProgressBarDirective {
  // 进度条
  public progress: ComponentRef<ProgressComponent>;
  // 组件工厂
  public factory: ComponentFactory<ProgressComponent>;
  // 国际化
  public language: any;
  // 结构化
  constructor(public viewContainer: ViewContainerRef,
              public resolver: ComponentFactoryResolver) {

    // 获取对应的组件工厂
    this.factory = this.resolver.resolveComponentFactory(ProgressComponent);
  }
  // 是否显示进度条
  @Input('appBarProgress') isProgressBar: boolean;
  // 修改值
  @Input() set appBarProgress(condition: boolean) {
    // 清空所有的view
    this.viewContainer.clear();
    // 创建组件
    this.progress = this.viewContainer.createComponent(this.factory);
    // 向组件实例传递参数
    this.progress.instance.isProgressBar = condition;
  }


}
