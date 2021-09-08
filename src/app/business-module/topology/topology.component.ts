import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FiLinkModalService} from '../../shared-module/service/filink-modal/filink-modal.service';
import {TableConfigModel} from '../../shared-module/model/table-config.model';
import {NzI18nService} from 'ng-zorro-antd';
import {PageModel} from '../../shared-module/model/page.model';
import {QueryConditionModel} from '../../shared-module/model/query-condition.model';
import {TopologyConfigImg, TopologyDevice} from './topologyConfigImg';
import {IndexLanguageInterface} from '../../../assets/i18n/index/index.language.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {FacilityService} from '../../core-module/api-service/facility/facility-manage';
import {Result} from '../../shared-module/entity/result';
import {FacilityLanguageInterface} from '../../../assets/i18n/facility/facility.language.interface';
import {InspectionLanguageInterface} from '../../../assets/i18n/inspection-task/inspection.language.interface';
import {TopNService} from '../../core-module/api-service/statistical/top-n';
import {CommonUtil} from '../../shared-module/util/common-util';
import {MapService} from '../../core-module/api-service/index/map';
import {opticCableLevel, topology, wiringType} from './topology.config';
import {FacilityApiService} from '../facility/share/service/facility/facility-api.service';
import {CableLevelEnum} from '../../core-module/enum/facility/facility.enum';
import {TopologyTypeEnum, WiringTypeEnum} from '../facility/share/enum/facility.enum';

declare const $: any;


@Component({
  selector: 'app-topology',
  templateUrl: './topology.component.html',
  styleUrls: ['./topology.component.scss']
})
export class TopologyComponent implements OnInit, AfterViewInit {
  // 国际化
  layouter;
  indexLanguage: IndexLanguageInterface;
  // 编号规则;
  Q = window['Q'];
  graph;
  ifShowPosition = {}; // 判断显示图元是否是重复的
  showRightMenu = false; // 显示左侧菜单
  isShowInfoWindow = false; // 显示设备详情
  infoWindowLeft = '0';
  infoWindowTop = '0';
  title = '选择光缆';
  // 新增弹出框显示隐藏
  isVisible = false;
  @ViewChild('tplFooter') public tplFooter;
  @ViewChild('radioTemp') radioTemp: TemplateRef<any>;
  public _dataSet = [];
  public pageBean: PageModel = new PageModel(10, 1, 1);
  public tableConfig: TableConfigModel;
  queryCondition: QueryConditionModel = new QueryConditionModel();
  opticCableId = '';
  nodeId = ''; // 节点Id
  public language: FacilityLanguageInterface; // 国际化
  public InspectionLanguage: InspectionLanguageInterface; // 国际化
  section_pageBean: PageModel = new PageModel(5, 1, 1); // 分页
  section_queryCondition: QueryConditionModel = new QueryConditionModel(); // 分页条件
  cable_level = {
    '0': 'localInterventionTrunkCable',
    '1': 'localInterventionEndCable',
    '2': 'firstClassTrunk',
    '3': 'secondaryTrunk',
    '4': 'localRelay',
    '5': 'localCore',
    '6': 'localConvergence',
    '7': 'tandemCable',
    '8': 'contactCable',
    '9': 'intraOfficeCable',
  };
  selectedAlarmId = null;
  topologyList = {
    opticCableName: '',
    opticCableLevel: '',
    localCode: '',
    topology: '',
    wiringType: '',
    coreNum: '',
    length: '',
    bizId: '',
    remark: ''
  };
  infoData = [];
  timer = null;
  deviceName = '';
  className = '';
  areaName = '';
  address = '';
  divceData = [];

  constructor(
    private $message: FiLinkModalService,
    public $nzI18n: NzI18nService,
    private $active: ActivatedRoute,
    private $facilityService: FacilityService,
    private $facilityApiService: FacilityApiService,
    private $topNService: TopNService,
    private $mapService: MapService,
    private $router: Router
  ) {
    this.indexLanguage = $nzI18n.getLocaleData('index');
  }

  ngOnInit() {
    this.InspectionLanguage = this.$nzI18n.getLocaleData('inspection');
    this.language = this.$nzI18n.getLocaleData('facility');
    this.initTableConfig();

  }

  ngAfterViewInit() {
    // this.getMyCollectionData();
    this.graph = new this.Q.Graph('smart-canvas');
    this.graph.styles = {};
    // 取消 箭头
    this.graph.styles[this.Q.Styles.ARROW_TO] = false;
    // 创建节点
    // const hello = this.graph.createNode();
    // hello.image = TopologyConfigImg.manwell;
    // const qunee = this.graph.createNode();
    // qunee.image = TopologyConfigImg.splitting;
    // const ee = this.graph.createNode();
    // ee.image = TopologyConfigImg.opticalIntersection;
    // // 连线
    // const edge1 = this.graph.createEdge(qunee, ee);
    // // this.graph.createEdge(ee, hello).setStyle(this.Q.Styles.EDGE_COLOR, '#5ed8a9');
    // // const edge = this.graph.createEdge(hello, qunee);
    // // edge.setStyle(this.Q.Styles.EDGE_COLOR, '#5ed8a9');
    // edge1.setStyle(this.Q.Styles.EDGE_COLOR, '#5ed8a9');
    // const layouter = new this.Q.SpringLayouter(this.graph);
    // layouter.repulsion = 90;
    // layouter.attractive = 0.1;
    // layouter.elastic = 2;
    // layouter.start();
    // 点击右键显示菜单
    this.$active.queryParams.subscribe(params => {
      this.opticCableId = params.opticCableId;
    });
    this.getTopology(this.opticCableId);
    this.topologyDetail(this.opticCableId);

  }

  // 获取拓扑节点
  getTopology(id) {
    this.$active.queryParams.subscribe(params => {
      this.opticCableId = params.opticCableId;

    });
    this.$facilityApiService.opticCableSectionByIdForTopology({
      belongOpticCableId: id
    }).subscribe((result: Result) => {
      if (result.code === 0) {
        if (result.data.length !== 0) {
          this.creatNode(result.data);
        } else {
          this.$message.warning(this.indexLanguage.noData);
        }

      }
    });
  }

  // 获取光缆详情
  topologyDetail(id) {
    this.$facilityService.queryTopologyById(id).subscribe((result: Result) => {
      // 处理暂无数据 后台返回code150109  opticCableLevel 光缆级别   wiringType 拓扑结构  topology 布线类型
      if (result.code !== 150109) {
        this.topologyList = result.data;
        Object.keys(opticCableLevel).forEach(item => {
          if (item === result.data.opticCableLevel) {
            this.topologyList.opticCableLevel = CommonUtil.codeTranslate(CableLevelEnum, this.$nzI18n, result.data.opticCableLevel) as string;
          }
        });
        Object.keys(wiringType).forEach(item => {
          if (item === result.data.topology) {
            this.topologyList.topology = CommonUtil.codeTranslate(TopologyTypeEnum, this.$nzI18n, result.data.topology) as string;
          }
        });
        Object.keys(topology).forEach(item => {
          if (item === result.data.wiringType) {
            this.topologyList.wiringType = CommonUtil.codeTranslate(WiringTypeEnum, this.$nzI18n, result.data.wiringType) as string;
          }
        });
      }
    });
  }

  // 循环创建节点
  creatNode(data) {
    const obj = {};
    data.map(item => {
      let startNode = null;
      let terminationNode = null;
      if (obj[item.startNode]) {
        startNode = obj[item.startNode];
      } else {
        startNode = this.graph.createNode();
        startNode.nodeId = item.startNode;
        obj[item.startNode] = startNode;
        // 判断设施类型
        if (item.startNodeDeviceType === TopologyDevice.Well) {
          startNode.image = TopologyConfigImg.manwell;
        } else if (item.startNodeDeviceType === TopologyDevice.Distribution_Frame) {
          startNode.image = TopologyConfigImg.distributionFrame;
        } else if (item.startNodeDeviceType === TopologyDevice.Junction_Box) {
          startNode.image = TopologyConfigImg.junctionBox;
        } else if (item.startNodeDeviceType === TopologyDevice.Optical_Box) {
          startNode.image = TopologyConfigImg.opticalIntersection;
        } else if (item.startNodeDeviceType === TopologyDevice.Splitting_Box) {
          startNode.image = TopologyConfigImg.splitting;
        }
      }

      if (obj[item.terminationNode]) {
        terminationNode = obj[item.terminationNode];
      } else {
        terminationNode = this.graph.createNode();
        terminationNode.nodeId = item.terminationNode;
        obj[item.terminationNode] = terminationNode;
        if (item.startNodeDeviceType === TopologyDevice.Well) {
          terminationNode.image = TopologyConfigImg.manwell;
        } else if (item.startNodeDeviceType === TopologyDevice.Distribution_Frame) {
          terminationNode.image = TopologyConfigImg.distributionFrame;
        } else if (item.startNodeDeviceType === TopologyDevice.Junction_Box) {
          terminationNode.image = TopologyConfigImg.junctionBox;
        } else if (item.startNodeDeviceType === TopologyDevice.Optical_Box) {
          terminationNode.image = TopologyConfigImg.opticalIntersection;
        } else if (item.startNodeDeviceType === TopologyDevice.Splitting_Box) {
          terminationNode.image = TopologyConfigImg.splitting;
        }

      }
      const edge = this.graph.createEdge(startNode, terminationNode);
      edge.setStyle(this.Q.Styles.EDGE_COLOR, '#5ed8a9');
    });
    const layouter = new this.Q.SpringLayouter(this.graph);
    // 鼠标右键
    this.graph.onstart2 = (evt) => {
      const node = this.graph.getElementByMouseEvent(evt);
      if (node) {
        this.isShowInfoWindow = false;
        this.nodeId = node.nodeId;
        this.showRightMenu = true;
        const menus = document.getElementById('right-menu');
        menus.style.left = evt.layerX + 'px';
        menus.style.top = evt.layerY + 'px';
      }
    };
    // TODO 鼠标移入节点显示详情
    this.graph.onmousemove = (evt, graph) => {
      const node = this.graph.getElementByMouseEvent(evt);
      const ifData = this.ifshow(node);
      if (ifData) {
        // clearTimeout(this.timer);
        // this.timer = setTimeout(() => {
        // this.queryDeviceId(node.nodeId);
        this.getMyCollectionData(node.nodeId);
        const deveice = document.getElementById('deveice');
        deveice.style.left = evt.layerX + 'px';
        deveice.style.top = evt.layerY - 20 + 'px';
        // }, 200);
      } else if (node === undefined) {
        this.clearDetail();
        this.isShowInfoWindow = false;
        this.ifShowPosition = {};
      }
    };
    // 左键隐藏菜单
    this.graph.onclick = (evt) => {
      this.showRightMenu = false;
    };
    layouter.repulsion = 150;
    layouter.attractive = 1;
    layouter.elastic = 7;
    layouter.start();
  }

  /**
   * 判断显示
   */
  ifshow(node) {
    if (this.ifShowPosition === {}) {
      return false;
    } else if (node === this.ifShowPosition) {
      return false;
    } else if (node) {
      this.ifShowPosition = node;
      return true;
    }
  }

  // 光缆配置
  private initTableConfig() {
    this.tableConfig = {
      isDraggable: true,
      showPagination: true,
      isLoading: false,
      showSearchSwitch: false,
      showSizeChanger: true,
      showSearchExport: false,
      noIndex: true,
      scroll: {x: '1000px', y: '600px'},
      columnConfig: [
        {
          title: '',
          type: 'render',
          key: 'selectedAlarmId',
          renderTemplate: this.radioTemp,
          width: 42
        },
        {
          title: this.language.cableName, key: 'opticCableName', width: 124,
        },
        {
          title: this.language.cableLevel, key: 'opticCableLevel', width: 80,
        },
        {
          title: this.language.localNetworkCode, key: 'localCode', width: 124,
        },
        {
          title: this.language.cableTopology, key: 'topology', width: 104,
        },
        {
          title: this.language.wiringType, key: 'wiringType', width: 80,
        },
        {
          title: this.language.cableCore, key: 'coreNum', width: 124,
        },
        {
          title: this.language.businessInformation, key: 'bizId', width: 124,
        },
        {
          title: this.language.remarks, key: 'remark', width: 124,
        },

      ]
    };
  }

  /**
   * 显示表格
   */
  checkTopology() {
    this.isVisible = true;
    this.justRefreshData();
    this.showRightMenu = false;
  }

  /**
   * 关闭表格
   */
  modalCancel() {
    this.isVisible = false;
  }

  /**
   * 拓扑放大
   */
  toZoomIn() {
    this.graph.zoomIn();
  }

  /**
   * 拓扑缩小
   */
  toZoomOut() {
    this.graph.zoomOut();
  }

  /**
   * 拓扑1：1
   */
  oneByOne() {
    this.graph.moveToCenter(1);
  }

  /**
   * 导出拓扑图片
   */
  exportImage() {
    const canvas = document.getElementsByTagName('canvas')[0];
    this.downLoadImage(canvas, '');
  }

  /**
   * 下载图片
   */
  downLoadImage(canvas, name) {
    const a = document.createElement('a');
    a.href = canvas.toDataURL();
    a.download = name;
    // 判断浏览器类型
    const userAgent = navigator.userAgent;
    const isFF = userAgent.indexOf('Firefox') > -1; // 判断是否Firefox浏览器
    const isChrome = userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1; // 判断Chrome浏览器
    // 如果浏览器类型为火狐,则执行此方法
    if (isFF) {
      this.clickObj(a);
    } else if (isChrome) {
      a.click();
    }
  }

  /**
   * 拓扑图导出火狐兼容click事件
   */
  clickObj(obj) {
    if (document.all) {
      obj.click();
    } else {
      const evt = document.createEvent('MouseEvents');
      evt.initEvent('click', true, true);
      obj.dispatchEvent(evt);
    }
  }

  /**
   * 切换拓扑
   */
  selectedAlarmChange(evt, item) {
  }

  /**
   * 及时定位
   */
  postion() {
    this.navigateToDetail('business/index', {queryParams: {id: this.nodeId}});
  }

  modelOk() {
    this.graph.clear();
    this.getTopology(this.selectedAlarmId);
    this.topologyDetail(this.selectedAlarmId);
    this.isVisible = false;
  }

  justRefreshData() {
    this.tableConfig.isLoading = true;
    this.section_queryCondition.pageCondition.pageSize = 10;
    this.section_queryCondition.bizCondition.deviceId = this.nodeId;
    this.$facilityApiService.getCableList(this.section_queryCondition).subscribe((result: Result) => {
      this.pageBean.Total = result.totalCount;
      this.tableConfig.isLoading = false;
      for (let i = 0; i < result.data.length; i++) {
        Object.keys(wiringType).forEach(item => {
          if (item === result.data[i].topology) {
            result.data[i].topology = wiringType[item];
          }
        });
        Object.keys(topology).forEach(item => {
          if (item === result.data[i].wiringType) {
            result.data[i].wiringType = topology[item];
          }
        });
      }
      const data = result.data;
      data.forEach(item => {
        item.opticCableLevel = this.getCableLevelName(item.opticCableLevel);
      });
      this._dataSet = result.data;
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  pageChange(event) {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.justRefreshData();
  }

  /**
   * 光缆级别转化
   */
  getCableLevelName(status) {
    return this.language[this.cable_level[status]];
  }

  /**
   * 获取所有施详情
   * param data 设施IdList
   */
  getMyCollectionData(id) {
    this.$mapService.findDeviceId(id).subscribe((result: Result) => {
      if (result.code === 0) {
        this.divceData = CommonUtil.deepClone(result.data);
        this.queryDeviceId(this.divceData);
      }
    });
  }

  /**
   * 根据ID获取设施详情
   * param data 设施IdList
   */
  queryDeviceId(data) {
    this.isShowInfoWindow = true;
    this.deviceName = data.deviceName;
    this.className = CommonUtil.getFacilityIConClass(data.deviceType);
    this.address = data.address;
    // this.divceData.map(item => {
    //   if (item.deviceId === id) {
    //
    //   }
    // });

  }

  /**
   * 跳转到详情
   * param url
   */
  private navigateToDetail(url, extras = {}) {
    this.$router.navigate([url], extras).then();
  }

  clearDetail() {
    this.deviceName = '';
    this.areaName = '';
    this.className = '';
    this.address = '';
    this.isShowInfoWindow = false;
  }

  /**
   * 退出
   */
  goBack() {
    window.history.go(-1);
  }


}
