/**
 * Created by xiaoconghu on 2020/6/9.
 */
import {SliderControlComponent} from './dynamic-component-repository/slider-control/slider-control.component';
import {ButtonControlComponent} from './dynamic-component-repository/button-control/button-control.component';
import {MusicControlComponent} from './dynamic-component-repository/music-control/music-control.component';
import {InformationScreenComponent} from './dynamic-component-repository/information-screen/information-screen.component';

export const componentConfig = {
  /**
   * 滑块组件
   */
  slider: SliderControlComponent,
  /**
   * 按钮组件
   */
  button: ButtonControlComponent,
  /**
   * 音乐控制组件
   */
  music: MusicControlComponent,
  /**
   * 信息屏控制组件
   */
  informationScreen: InformationScreenComponent
};
