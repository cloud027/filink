import {ChartUtil} from '../../../shared-module/util/chart-util';
import {CommonUtil} from '../../../shared-module/util/common-util';
import {alarmNameHomePageEnum} from '../share/enum/alarm-name.enum';
import {NzI18nService} from 'ng-zorro-antd';

export class AlarmStatisticalCommon {
  // 请求的数据
  public allData;
  // 饼图实例
  public ringChartInstance;
  // 柱状图实例
  public barChartInstance;


  constructor(public $NZi18: NzI18nService) {
  }

  /**
   * 设置列表数据
   */
  public setChartData(): void {
    const ringData = [];
    const ringName = [];
    const barData = [];
    const barName = [];
    Object.keys(this.allData.total).forEach(key => {
      ringData.push({
        value: this.allData.total[key],
        name: this.analysisData(key)
      });
      ringName.push(this.analysisData(key));
      barData.push(this.allData.total[key]);
      barName.push(this.analysisData(key));
    });
    // 左侧的饼图
    setTimeout(() => this.ringChartInstance.setOption(ChartUtil.setRingChartOption(ringData, ringName)));
    // 右侧的折线图
    setTimeout(() => this.barChartInstance.setOption(ChartUtil.setBarChartOption(barData, barName)));
  }

  /**
   * 数据转化 传入英文 返回中文
   */
  public analysisData(data) {
    return CommonUtil.codeTranslate(alarmNameHomePageEnum, this.$NZi18, data);
  }

}
