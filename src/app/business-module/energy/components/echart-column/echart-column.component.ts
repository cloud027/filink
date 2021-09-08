import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import echarts from 'echarts';

/**
 * eChart组件
 */
@Component({
  selector: 'energy-echart-column',
  templateUrl: './echart-column.component.html',
  styleUrls: ['./echart-column.component.scss'],
})
export class EchartColumnComponent implements OnInit, AfterViewInit {
  // eChart Id
  id: string;
  // eChart实例
  eChartInstance;
  @Output() chartInstance = new EventEmitter();

  constructor() {}

  ngOnInit() {
    this.id = `chart${parseInt(Math.random() * 100000 + '', 0)}`;
  }

  ngAfterViewInit(): void {
    this.eChartInstance = echarts.init(document.getElementById(this.id));
    this.chartInstance.emit(this.eChartInstance);
    // setTimeout(() => {
    //   this.eChartInstance.setOption(this.chartOption);
    //   this.eChartInstance.hideLoading();
    // }, 10000);
  }
}
