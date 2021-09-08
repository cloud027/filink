import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import echarts from 'echarts';

/**
 * eChart组件
 */
@Component({
  selector: 'app-echart-column',
  templateUrl: './echart-column.component.html',
  styleUrls: ['./echart-column.component.scss']
})
export class EchartColumnComponent implements OnInit, AfterViewInit {
  // eChart Id
  public id: string;
  // eChart实例
  public eChartInstance;
  @Output() chartInstance = new EventEmitter();

  constructor() {
  }

  public ngOnInit() {
    this.id = `chart${parseInt(Math.random() * 100000 + '', 0)}`;
  }

  public ngAfterViewInit(): void {
    this.eChartInstance = echarts.init(document.getElementById(this.id));
    this.chartInstance.emit(this.eChartInstance);
  }
}
