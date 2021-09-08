import {ComponentFactoryResolver, ComponentRef, Injectable} from '@angular/core';
import {componentConfig} from './dynamic-component.config';

@Injectable()
export class DynamicRenderService {
  get componentRef(): ComponentRef<any> {
    return this._componentRef;
  }
  // 组件Ref
  private _componentRef: ComponentRef<any>;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  /**
   * 加载组件
   * param viewContainerRef
   * param componentName
   */
  public loadComponent(viewContainerRef, componentName): void {
    const component = componentConfig[componentName];
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    viewContainerRef.clear();
    this._componentRef = viewContainerRef.createComponent(componentFactory);
  }

  /**
   * 设置组件input值
   * param componentInputs
   */
  public setInputs(componentInputs): void {
    Object.keys(componentInputs).forEach(item => {
      this._componentRef.instance[item] = componentInputs[item];
    });
  }

  /**
   * 销毁组件
   */
  public destroyComponents(): void {
    this._componentRef.destroy();
  }
}
