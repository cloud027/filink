import {
  Component, OnInit, Input, Output, AfterViewInit, EventEmitter,
  OnDestroy
} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {Result} from '../../../shared-module/entity/result';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';
import {fromEvent} from 'rxjs';
import {MapScreenService} from '../../../core-module/api-service/screen-map/map-screen';
import {MapScreenConfigService} from '../screen-map/map-screen-config.service';
import {Flip} from 'number-flip';
import {BigScreenLanguageInterface} from '../../../../assets/i18n/big-screen/screen.language.interface';
import {MapService} from '../../../core-module/api-service/index/map';
import {NativeWebsocketImplService} from '../../../core-module/websocket/native-websocket-impl.service';
import {ScreenEcharts} from './screen-echarts';
import {TimerSelectorService} from '../../../shared-module/service/time-selector/timer-selector.service';
import {ResultModel} from '../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../shared-module/enum/result-code.enum';
import {AlarmLevelEnum} from '../../../core-module/enum/alarm/alarm-level.enum';
import {CommonUtil} from '../../../shared-module/util/common-util';
import {DeviceStatusEnum, DeviceTypeEnum} from '../../../core-module/enum/facility/facility.enum';
import {LanguageEnum} from '../../../shared-module/enum/language.enum';
import {AlarmStoreService} from '../../../core-module/store/alarm.store.service';
import {DefaultAlarmColor} from '../../../core-module/const/alarm/default-alarm-color.const';

declare const $: any;
declare const MAP_TYPE;
declare let BMap: any;   // 一定要声明BMap，要不然报错找不到BMap

@Component({
  selector: 'app-show-screen',
  templateUrl: './show-screen.component.html',
  styleUrls: ['./show-screen.component.scss'],
  providers: [TimerSelectorService]
})
export class ShowScreenComponent implements OnInit, AfterViewInit, OnDestroy {
  /** 页面可见 */
  @Input() isVisible = false;
  /** 页面关闭事件 */
  @Output() close = new EventEmitter();
  /** 国际化配置 */
  language: BigScreenLanguageInterface;
  /** 展示大屏 */
  viewScreen = true;
  /** 页面时钟 */
  time: number = 0;
  /** 页面时钟定时器 */
  interval: any;
  /** 定时刷新 */
  refreshInterval = null;
  /** 当前告警 */
  nowAlarm = {};
  /** 告警数量Topn */
  numAlarm = {};
  /** 设施类型 */
  typeAlarm = {};
  /** 设施状态 */
  deviceStatusAlarm = {};
  /** 每日增量 */
  incrementAlarm = {};
  /** 当前设施总数 */
  deviceCountTotal: any;
  /** 页面监听 */
  pageResize: any;
  /** 告警设施总数 */
  deviceStatusAlarmCount: any;
  /** 告警列表数据 */
  alarmCurrentList = [];
  /** 地图消息框 */
  infoContent = {};
  /** 查询topN的时间参数 */
  topNTimeSlot: any;
  /** 所有设施数据 */
  allDeviceList = [];
  /** 地图类型 */
  private mapType: string;
  /** 本功能地图配置实例 */
  mapConfigService: MapScreenConfigService;
  /** 地图区域code */
  areaCode = '';
  /** 是否显示告警提示框 */
  isShowInfoWindow = false;
  /** 提示框偏移 */
  infoWindowLeft = '0';
  /** 提示框偏移 */
  infoWindowTop = '0';
  /** 告警增量显示日数据 */
  showDay = true;
  /** 告警增量显示周数据 */
  showWeek = false;
  /** 告警增量显示月数据 */
  showMonth = false;
  /** topN显示天数据 */
  showAlarmDay = true;
  /** topN显示周数据 */
  showAlarmWeek = false;
  /** topN显示月数据 */
  showAlarmMouth = false;
  /** 页面枚举使用声明 */
  alarmLevelCode: any = AlarmLevelEnum;

  constructor(private $I18n: NzI18nService,
              private $alarmStoreService: AlarmStoreService,
              private $message: FiLinkModalService,
              private $timerSelectorService: TimerSelectorService,
              private $mapService: MapService,
              private $MapScreenService: MapScreenService,
              private $wsService: NativeWebsocketImplService) {
  }

  ngOnInit() {
    // 国际化
    this.language = this.$I18n.getLocaleData('bigScreen');
    // 区域名称 湖北省code
    this.areaCode = '420000';
    // 地图类型
    this.mapType = MAP_TYPE;
    // topN 默认选择日
    this.changDateType('day');
    // 当前告警查询
    this.getCurrentAlarm();
    // 设施类型查询
    this.getDeviceTypeCount();
    // 设施状态
    this.getDeviceStatusCount();
    // topN告警数量查询
    this.getScreenDeviceGroup();
    // 告警增量 默认查询日
    this.getAlarmIncrement('DAY');
  }

  ngOnDestroy() {
    // 如果有数据刷新，关闭定时器
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    // 关闭时钟
    if (this.interval) {
      clearInterval(this.interval);
    }
    // 关闭监听
    if (this.pageResize) {
      this.pageResize.unsubscribe();
    }
  }

  ngAfterViewInit() {
    // 地图初始化 只有百度
    if (this.mapType === 'baidu') {
      this.getScreenMap();
    }

    // 监听浏览器窗口，如果不是全屏窗口，则退出全屏模式,包含keyup.esc
    this.pageResize = fromEvent(window, 'resize')
      .subscribe((event) => {
        // 这里处理页面变化时的操作
        const isFull = !!(document['webkitIsFullScreen'] || document['fullscreenElement'] || document['msFullscreenElement']
          || document['mozFullScreen'] || document['mozFullScreenElement'] || document['webkitFullscreenElement']
        );
        if (!isFull) {
          this.close.emit();
        }
      });
    // 初始化数字滚动插件
    this.numberFlip();
    // 推送消息处理
    this.wsMsgAccept();
    // 数据刷新
    this.refreshBigScreen();
    this.shoeViewScreen();
  }

  /**
   * 显示大屏
   */
  shoeViewScreen() {
    this.viewScreen = true;
    // 设置全屏模式
    const fullscreenDiv = window.document.body;
    let fullscreenFunc = fullscreenDiv.requestFullscreen;
    if (!fullscreenFunc) {
      // 判断浏览器内核
      ['mozRequestFullScreen', 'msRequestFullscreen', 'webkitRequestFullScreen'].forEach(function (req) {
        fullscreenFunc = fullscreenFunc || fullscreenDiv[req];
      });
    }
    // 把全屏展示的内容 通过call 改变this指向
    fullscreenFunc.call(fullscreenDiv);
    // 开启时钟
    this.updateTimeNow();
  }

  /**
   * 时钟数据
   */
  updateTimeNow() {
    this.interval = setInterval(() => {
      this.time = new Date().getTime();
    }, 1000);
  }

  /**
   * 数字numberFlip 滑动初始化
   */
  numberFlip() {
    // 初始化numberFlip 000000
    const count = 100000;
    // 当前设施总数
    this.deviceCountTotal = new Flip({
      node: document.getElementById('facilities-num-ta'),
      from: count,
      to: 0,
      direct: true
    });
    // 告警设施总数
    this.deviceStatusAlarmCount = new Flip({
      node: document.getElementById('facilities-num-tas'),
      from: count,
      to: 0,
      direct: true
    });
  }

  /**
   * webSocket消息监听
   */
  wsMsgAccept() {
    let timeOutHandle = null;
    // 实时告警推送
    this.$wsService.subscibeMessage.subscribe(msg => {
      const data = JSON.parse(msg.data);
      const temp = {
        name: data.msg.alarmName,
        level: data.msg.alarmLevel,
        LevelName: CommonUtil.codeTranslate(AlarmLevelEnum, this.$I18n,  data.msg.alarmLevel, LanguageEnum.alarm),
        time: new Date(data.msg.alarmNearTime).getTime()
      };
      let deviceCode = '';
      let position = [];
      // 通过deviceId查找设施信息
      this.allDeviceList.forEach(item => {
        if (item.deviceId === data.msg.deviceId) {
          deviceCode = item.deviceCode;
          position = item.positionBase.split(',');
        }
      });
      if (deviceCode && position.length) {
        // 如果该设施存在，则经纬度是否在湖北省内
        if (this.mapConfigService.isPointInHuBei(position[0], position[1])) {
          // 在湖北省内则将告警信息添加到告警列表
          this.alarmCurrentList.push(temp);
          // 更新地图提示框信息
          this.infoContent = {
            deviceCode: deviceCode,
            name: data.msg.alarmName,
            LevelName: CommonUtil.codeTranslate(AlarmLevelEnum, this.$I18n,  data.msg.alarmLevel, LanguageEnum.alarm),
            time: new Date(data.msg.alarmNearTime).getTime()
          };
          // 显示提示框
          this.showInfoWindow('c', position[0], position[1], this.mapConfigService);
          // 新数据来时，上一个timeOut,重置5s消失弹窗处理
          if (!timeOutHandle) {
            clearTimeout(timeOutHandle);
          }
        }
      }
      // 列表页面渲染完成后列表的滚动效果
      setTimeout(() => {
        this.movedome();
      }, 100);
      // 没有下一个5s钟之后关掉
      timeOutHandle = setTimeout(() => {
        this.isShowInfoWindow = false;
      }, 5000);
    });
  }

  /**
   * 获取地图配置
   */
  getScreenMap() {
    this.$MapScreenService.queryGetArea(this.areaCode).subscribe((result: Result) => {
      if (result.code === 0 || ResultCodeEnum.success) {
        this.initMap(result.data);
      }
    });
  }

  /**
   * 大屏页面刷新
   */
  refreshBigScreen() {
    // 从缓存获取系统参数，screenScroll '1'启用刷新， '0'不启用，及screenScrollTime刷新时间，单位分钟
    const screenScroll = JSON.parse(localStorage.getItem('displaySettings')).screenScroll;
    const screenScrollTime = JSON.parse(localStorage.getItem('displaySettings')).screenScrollTime;
    if (screenScroll === '1') {
      this.refreshInterval = setInterval(() => {
        this.getCurrentAlarm();
        this.getDeviceTypeCount();
        this.getDeviceStatusCount();
        this.getScreenDeviceGroup();
        // 增量刷新 day, week , month
        const sufix = this.showDay ? 'DAY' : (this.showWeek ? 'WEEK' : 'MONTH');
        this.getAlarmIncrement(sufix);
        this.allDeviceList = [];
        // 重新查询设施列表，刷新地图上的maker点和聚合点
        this.getAllDeviceList();
      }, screenScrollTime * 60 * 1000);
    }
  }

  /**
   * 告警滚动，当前设置5条数据滚动
   */
  movedome() {
    $('.screen-charts').slide({
      mainCell: 'ul',
      effect: 'top',
      autoPlay: true,
      vis: 5,
      easing: 'easeOutCirc',
      delayTime: 700
    });

  }

  /**
   * 显示日数据
   */
  showDayData() {
    this.showWeek = false;
    this.showMonth = false;
    this.showDay = true;
    this.getAlarmIncrement('DAY');
  }

  /**
   * 显示周数据
   */
  showWeekData() {
    this.showDay = false;
    this.showMonth = false;
    this.showWeek = true;
    this.getAlarmIncrement('WEEK');
  }

  /**
   * 显示月数据
   */
  showMouthData() {
    this.showDay = false;
    this.showWeek = false;
    this.showMonth = true;
    this.getAlarmIncrement('MONTH');
  }

  /**
   * topN 日数据
   */
  topAlarmDay() {
    this.showAlarmMouth = false;
    this.showAlarmWeek = false;
    this.showAlarmDay = true;
    this.changDateType('day');
    this.getScreenDeviceGroup();
  }

  /**
   * topN 周数据
   */
  topAlarmWeek() {
    this.showAlarmMouth = false;
    this.showAlarmWeek = true;
    this.showAlarmDay = false;
    this.changDateType('week');
    this.getScreenDeviceGroup();
  }

  /**
   * topN 月数据
   */
  topAlarmMouth() {
    this.showAlarmMouth = true;
    this.showAlarmWeek = false;
    this.showAlarmDay = false;
    this.changDateType('month');
    this.getScreenDeviceGroup();
  }

  /**
   * 创建地图并描边
   * param city
   */
  private initMap(city) {
    // 实例化地图服务类
    this.mapConfigService = new MapScreenConfigService('map', city);
    // 查询设施列表，创建maker点和聚合点
    this.getAllDeviceList();
  }

  /**
   * 获取当前告警类型
   */
  private getCurrentAlarm() {
    // 上次饼图数据清空
    this.nowAlarm = {};
    let defaultColor = [];
    DefaultAlarmColor.forEach(item => {
      defaultColor.push(item.color.color);
    });
    this.$MapScreenService.getCurrentAlarm().subscribe((res: Result) => {
      if (res.code === 0 || res.code === ResultCodeEnum.success) {
        let chartData = {};
        if (Object.values(res.data).every(item => item === 0)) {
          chartData = res.data;
        } else {
          Object.keys(res.data).forEach(key => {
            chartData[key] = res.data[key];
          });
        }
        defaultColor = [];
        // 动态获取颜色
        const colorList = this.$alarmStoreService.getAlarmColorStyleObj();
        for (const key in colorList) {
          if (key) {
            defaultColor.push(colorList[key].backgroundColor);
          }
        }
        const data = {
          type: 'nowAlarm',
          datas: chartData,
          colors: defaultColor
        };
        // 刷新当前告警饼图数据
        ScreenEcharts.initChart(data, this);
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 获取各种设施类型
   */
  private getDeviceTypeCount() {
    // 上次饼图数据清空
    this.typeAlarm = {};
    this.$MapScreenService.getDeviceTypeCount().subscribe((res: Result) => {
      if (res.code === 0 || res.code === ResultCodeEnum.success) {
        // 饼图传入数据，index为颜色角标
        const deviceData: Array<{ value: number, name: string|{ label: string, code: any }[], index: number }> = [];
        let deviceTotal = 0;
        res.data.forEach(item => {
          // 当前设施总数
          deviceTotal += item.deviceNum;
          deviceData.push({
            value: item.deviceNum,
            name: CommonUtil.codeTranslate(DeviceTypeEnum, this.$I18n, item.deviceType),
            index: this.deviceColor(item.deviceType)
          });
        });
        const data = {
          type: 'typeAlarm',
          datas: deviceData
        };
        // 设施总数渲染，刷新
        this.deviceCountTotal.flipTo({
          to: (Array(6).join('0') + deviceTotal).slice(-6),
          direct: true
        });
        // 设施类型饼图数据刷新
        ScreenEcharts.initChart(data, this);
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 设施类型的颜色数组 ['#58d9a8', '#f39804', '#4fc6e9', '#f7d404', '#fa7448']
   * 设施类型颜色配置  001， 030， 060， 090， 210， 取得颜色对应角标
   */
  private deviceColor(deviceType: string) {
    let colorIndex = 0;
    switch (deviceType) {
      case 'D001':
        colorIndex = 0;
        break;
      case 'D002':
        colorIndex = 5;
        break;
      case 'D003':
        colorIndex = 6;
        break;
      case 'D004':
        colorIndex = 1;
        break;
      case 'D005':
        colorIndex = 4;
        break;
      case 'D006':
        colorIndex = 2;
        break;
      case 'D007':
        colorIndex = 3;
        break;
      default:
        break;
    }
    return colorIndex;
  }

  /**
   * 获取各种设施状态数量
   */
  private getDeviceStatusCount() {
    // 上次饼图数据清空
    this.deviceStatusAlarm = {};
    this.$MapScreenService.getDeviceStatusCount().subscribe((res: Result) => {
      if (res.code === 0 || res.code === ResultCodeEnum.success) {
        // 设施状态饼图数据，index为颜色角标
        const statusData: Array<{ value: number, name: any, index: number }> = [];
        // 设施告警总数清0
        let deviceTotal = 0;
        res.data.forEach(item => {
          statusData.push({
            value: item.deviceNum,
            name: CommonUtil.codeTranslate(DeviceStatusEnum, this.$I18n, item.deviceStatus),
            index: parseInt(item.deviceStatus, 10)
          });
          // 如果设施中存在告警，则设施告警总数为此数量
          if (item.deviceStatus === '3') {
            deviceTotal = item.deviceNum;
          }
        });
        const data = {
          type: 'deviceStatusAlarm',
          datas: statusData
        };
        // 设施告警总数渲染刷新
        this.deviceStatusAlarmCount.flipTo({
          to: (Array(6).join('0') + deviceTotal).slice(-6),
          direct: true
        });
        ScreenEcharts.initChart(data, this);
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 查询告警设施topN
   */
  getScreenDeviceGroup() {
    // 清除上次topN中echarts数据
    this.numAlarm = {};
    // topN时间戳查询条件
    const dateCond = {};
    if (this.topNTimeSlot['startTime']) {
      dateCond['startTime'] = (new Date(this.topNTimeSlot['startTime']).getTime()) / 1000;
    }
    if (this.topNTimeSlot['endTime']) {
      dateCond['endTime'] = (new Date(this.topNTimeSlot['endTime']).getTime()) / 1000;
    }
    this.$MapScreenService.getScreenDeviceGroup(dateCond).subscribe((res: Result) => {
      // x轴value数据
      const xData = [];
      // y轴类目轴设施名称数据
      const yData = [];
      let deviceIds = [];
      if (res.code === 0 || res.code === ResultCodeEnum.success) {
        // 通过告警数量排序
        res.data.sort((item, _item) => _item.count - item.count);
        // 拿到设施ids
        deviceIds = res.data.map(item => item.alarmSource);
        // 通过设施ids查询设施名称
        this.$MapScreenService.getDeviceByIds(deviceIds).subscribe((resData: ResultModel<any>) => {
          if (res.code === 0 || resData.code === ResultCodeEnum.success) {
            // 通过设施id，匹配告警数量，及对应设施名称
            res.data.forEach(temp => {
              resData.data.forEach(item => {
                if (temp.alarmSource === item.deviceId) {
                  xData.push(temp.count);
                  yData.push(item.deviceName);
                }
              });
            });
            const data = {
              type: 'numAlarm',
              datas: {
                xData: xData,
                yData: yData
              }
            };
            // topN中折现和柱状图数据刷新
            ScreenEcharts.initChart(data, this);
          } else {
            this.$message.error(resData.msg);
          }
        });
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 日，周，月切换的时间戳
   */
  changDateType(type: string) {
    let date = null;
    switch (type) {
      case 'day':
        date = this.$timerSelectorService.getDayRange();
        break;
      case 'week':
        date = this.$timerSelectorService.getWeekRange();
        break;
      case 'month':
        date = this.$timerSelectorService.getMonthRange();
        break;
      default:
        break;
    }
    // topN日周月查询时间戳条件
    this.topNTimeSlot = {
      startTime: date[0],
      endTime: date[1]
    };
  }

  /**
   * 查询告警增量数据
   */
  getAlarmIncrement(sufix: string) {
    // 清除上次数据
    this.incrementAlarm = {};
    // 告警增量数据查询，day, weeek, month
    this.$MapScreenService.getAlarmIncrement(sufix).subscribe((res: Result) => {
      if (res.code === 0 || ResultCodeEnum.success) {
        // x轴类目轴时间数据
        const xData = [];
        // y轴value值
        const yData = [];
        res.data.forEach(item => {
          yData.push(item.groupNum);
          xData.push(item.groupLevel);
        });
        const data = {
          type: 'incrementAlarm',
          datas: {
            xData: xData,
            yData: yData
          }
        };
        ScreenEcharts.initChart(data, this);
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 查询所有设施列表
   */
  getAllDeviceList() {
    this.$mapService.getALLFacilityList().subscribe((res: Result) => {
      if (res.code === 0 || ResultCodeEnum.success) {
        // 设施列表数据
        this.allDeviceList = res.data;
        // maker点击聚合点创建
        this.mapConfigService.createMakers(this.allDeviceList);
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 鼠标移入显示信息
   * param info   设施点信息
   * param type   类型  c：聚合点 m：marker点
   */
  showInfoWindow(type, lng, lat, mapConfigService) {
    const pixel = mapConfigService.pointToOverlayPixel(lng, lat);
    let offset = mapConfigService.getOffset();
    let _top = offset.offsetY + pixel.y;
    if (type === 'c') {
      _top = _top - 20;
    }
    this.infoWindowLeft = offset.offsetX + pixel.x + 'px';
    this.infoWindowTop = _top + 'px';
    this.isShowInfoWindow = true;
  }

}
