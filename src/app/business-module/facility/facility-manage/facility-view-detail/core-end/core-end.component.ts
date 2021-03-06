import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../../shared-module/component/form/form-operate.service';
import {BoardStateEnum, DeviceTypeEnum, PortStateEnum} from '../../../../../shared-module/entity/template';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {Result} from '../../../../../shared-module/entity/result';
import {RealPosition} from '../../../../../shared-module/component/business-picture/real-position';
import {BusinessImageUrl} from '../../../../../shared-module/enum/business-image-url.enum';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {cableSegmentType, colorType, numberType, selectionMode, typeOfBoxTrayPort} from '../../../share/const/core-end.config';
import {CoreApiService} from '../../../share/service/core/core-api-service';

/**
 * 纤芯成端操作
 */
@Component({
  selector: 'app-core-end',
  templateUrl: './core-end.component.html',
  styleUrls: ['./core-end.component.scss']
})
export class CoreEndComponent implements OnInit {
  @Input() public coreEndIsVisible = false; // 纤芯成端
  @Output() public closeCoreEnd = new EventEmitter();
  public language: FacilityLanguageInterface;
  public title; // 弹框title
  public stepTitle; // 步骤title
  public formColumn: FormItem[] = []; // form表单配置
  public formStatus: FormOperate;
  public stepRightOne; // 弹框右边内容第一步
  public stepRightTwo: boolean = false; // 弹框右边内容第二步
  public numberOfSteps = 0; // 步骤数
  public Q = window['Q'];
  public drawType: string = selectionMode.arrow;
  public mapBoxSelect = false;
  public formNameList = []; // 端口点存放数据
  public startNameList = []; // 光缆段起始点存放数据
  public endNameList = []; // 光缆段结束点存放数据
  public edgeList = []; // 单选连线数据
  public formFrameEdgeList = []; // 框选连线起始点数据
  public toFrameEdgeList = []; // 框选连线结束点数据
  public graph: any = undefined;
  public qunee;
  public portId: number = 0; // 端口Id
  public boxAorB = []; // 箱AB面
  public plateAorB; // 盘的AB面
  public boxAB; // 选择的箱是A还是B
  public boxSet; // 箱的集合
  public framelsit = []; // 框数据
  public frameNameList = []; // 框名称集合
  public opticCableSectionNameList = []; // 光缆段名称集合
  public saveCoreEnd = []; // 保存数据集合
  public coreNum; // 光缆段纤芯数量
  public portNum = 0; // 端口数量
  public deviceId; // 设施Id
  public portNoList = []; // 端口号集合
  public portNoListId = []; // 端口ID集合
  public oppositeCableCoreNoList = []; // 光缆段Id集合
  public opticCableSectionId; // 光缆段Id
  public _opticCableSectionId; // 光缆段Id
  public frameId; // 框Id
  public plateId = []; // 盘Id
  public resourceDiscSide = []; // 盘AB集合
  public resourceDiscNo = []; // 盘号
  public plateAB = []; // 盘AB面
  public array = []; // 初始化获取元素连线数据
  public selectBox; // 下拉框箱AB面数据
  public nodeId = ''; // 节点Id
  public showRightMenu = false; // 显示左侧菜单
  public deleteGraph; // 删除数据
  public deleteData;
  public deleteCoreData = [];
  public ifPort = []; // 判断端口是否是原数据
  public portWidth; // 端口的宽度
  public plateHave; // 判断盘在不在位
  public boxId: any;
  public _boxId: any;
  public boxValue: any = undefined;

  constructor(
    private $coreEndService: CoreApiService,
    private $modalService: FiLinkModalService,
    private $nzI18n: NzI18nService,
  ) {
  }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData('facility');
    this.stepTitle = this.language.selectFacilitiesAndCableSegments; // 步骤title
    this.title = this.language.configureTheCoreToEnd;
    this.getTheCoreEndInitialization().then((bool) => {
      this.initColumn();
    });
    window.oncontextmenu = function () {
      return false;
    };
  }

  public modalCancel(): void {
    this.closeCoreEnd.emit();
    this.title = this.language.configureTheCoreToEnd;
  }

  /**
   * 接受表单传进来的参数并赋值
   * param event
   */
  public formInstance(event): void {
    this.formStatus = event.instance;
  }

  /**
   * form表单配置
   */
  private initColumn(): void {
    this.formColumn = [
      {// 选择箱AB面
        label: this.language.boxABsurface,
        key: 'boxAorB',
        type: 'select',
        col: 24,
        require: true,
        selectInfo: {
          data: this.boxAorB,
          label: 'label',
          value: 'value',
        },
        modelChange: (controls, event, key, formOperate) => {
          if (event === numberType.zero) {
            this.getFrameName(numberType.zero);
            this.boxAB = 0;
          } else if (event === numberType.one) {
            this.getFrameName(numberType.one);
            this.boxAB = 1;
          }
          this.selectBox = event;
          this.formStatus.resetControlData('frame', null);
          // this.boxId = '';
          this.formStatus.resetControlData('portSurface', null);
          this.plateHave = numberType.zero;
        },
        rule: [],
      },
      {// 选择框
        key: 'frame',
        label: this.language.frame,
        col: 24,
        type: 'select',
        selectInfo: {
          label: 'label',
          value: 'value',
        },
        require: true,
        modelChange: (controls, event, key, formOperate) => {
          if (event !== null) {
            this.boxValue = event;
            this.boxId = event;
            this.formColumn[1].selectInfo.data.map(item => {
              if (event === item.value) {
                this._boxId = item.label;
              }
            });
            this.formStatus.resetControlData('portSurface', null);
            this.plateHave = numberType.zero;
          }
        },
        rule: [],
      },
      {// 选择盘AB面
        key: 'portSurface',
        col: 24,
        label: this.language.portABsurface,
        type: 'select',
        require: true,
        selectInfo: {
          data: [
            {label: this.language.Asurface, value: numberType.zero},
            {label: this.language.Bsurface, value: numberType.one}
          ],
          label: 'label',
          value: 'value',
        },
        modelChange: (controls, event, key, formOperate) => {
          if (event !== null) {
            if (this.boxValue !== undefined && this.selectBox !== undefined && this.selectBox !== null) {
              this.plateAorB = event;
              this.$coreEndService.queryFacilityBoxInformation(this.boxValue).subscribe((result: Result) => {
                if (this.plateAorB !== undefined) {
                  // 判断有没有框在位
                  if (result.data.childList) {
                    // 查看有没有AB面盘在位,没有在位盘则给出提示
                    for (let i = 0; i < result.data.childList.length; i++) {
                      if (result.data.childList[i].childList !== null) {
                        const portLength = result.data.childList[i].childList.length; // 端口数
                        for (let q = 0, w = 0; w < portLength;) {
                          if (result.data.childList[i].childList[q].side === this.plateAorB) {
                            w = w + 1;
                            q = q + 1;
                          } else {
                            result.data.childList[i].childList.splice(q, numberType.one);
                            w = w + 1;
                          }
                        }
                      }
                    }
                    let emptyNum = numberType.zero;
                    let num = numberType.zero;
                    result.data.childList.forEach(item => {
                      num += 1;
                      if (item.childList === null || item.childList.length === numberType.zero) {
                        emptyNum += 1;
                      }
                    });
                    // 总盘数等于不在位盘数,则此框下面没有在位盘
                    if (num === emptyNum) {
                      this.$modalService.info(this.language.thereIsNoPositionOnThisSidePleaseChooseAnotherSideAgain);
                      this.plateHave = numberType.zero;
                    } else {
                      this.plateHave = numberType.one;
                    }
                  } else {
                    this.$modalService.info(this.language.theBoxIsNotInPlacePleaseReselectTheOtherBox);
                  }
                }
              });
            } else {
              this.$modalService.info(this.language.pleaseSelectBoxesBoxesAndPlatesInOrder);
              this.formStatus.resetControlData('portSurface', null);
            }
          }
        },
        rule: [],
      },
      {// 光缆段
        label: this.language.cableSegment,
        col: 24,
        key: 'cableSegment',
        type: 'select',
        require: true,
        selectInfo: {
          data: this.opticCableSectionNameList,
          label: 'label',
          value: 'value',
        },
        modelChange: (controls, event, key, formOperate) => {
          this.opticCableSectionId = event;
          this._opticCableSectionId = event;
          // 获取光缆段纤芯信息
          this.$coreEndService.getCableSegmentInformation(this.deviceId).subscribe((result: Result) => {
            result.data.forEach(item => {
              if (item.opticCableSectionId === this.opticCableSectionId) {
                this.coreNum = item.coreNum;
              }
            });
          });
        },
        rule: [],
      }
    ];
  }

  /**
   * 点击上一步
   */
  public Previous(): void {
    this.numberOfSteps = 0;
    this.stepRightOne = true;
    this.stepRightTwo = false;
    this.stepTitle = this.language.selectFacilitiesAndCableSegments;
    this.clearData();
    this.formStatus.resetControlData('portSurface', this.plateAorB);
    this.formStatus.resetControlData('frame', this.boxValue);
    this.formStatus.resetControlData('cableSegment', this._opticCableSectionId);
    this.formStatus.resetControlData('boxAorB', this.selectBox);
  }

  /**
   * 恢复数据初始化
   */
  public clearData(): void {
    if (this.graph) {
      this.graph.clear();
      this.formNameList = []; // 端口点存放数据
      this.portNoList = []; // 端口数据存放
      this.startNameList = []; // 光缆段起始点存放数据
      this.endNameList = []; // 光缆段结束点存放数据
      this.resourceDiscSide = []; // 盘AB面
      this.portNoListId = []; // 端口ID
      this.resourceDiscNo = []; // 盘号
      this.framelsit = [];
      this.oppositeCableCoreNoList = []; // 纤芯号
      this.ifPort = [];
      this.deleteCoreData = [];
      this.saveCoreEnd = [];
      this.portNum = 0;
    }
  }

  /**
   * 步骤图切换one
   */
  public stepDiagramSwitchingOne(): boolean {
    return this.stepRightOne !== false;
  }

  /**
   * 步骤图切换two
   */
  public stepDiagramSwitchingTwo(): boolean {
    return this.stepRightTwo !== false;
  }

  public close(): void {
    this.closeCoreEnd.emit();
    this.stepRightOne = true;
    this.stepRightTwo = false;
    this.numberOfSteps = 0;
    this.stepTitle = this.language.selectFacilitiesAndCableSegments;
    this.clearData();
    this.formStatus.resetControlData('boxAorB');
    this.formStatus.resetControlData('frame');
    this.formStatus.resetControlData('portSurface');
    this.formStatus.resetControlData('cableSegment');
    this._opticCableSectionId = '';

    this.selectBox = undefined;
    this._opticCableSectionId = undefined;
    this.boxId = undefined;
    this.boxValue = undefined;
    this.plateAorB = undefined;
  }

  /**
   * 删除过滤不是原数据的删除信息
   */
  public deleteInformationFiltering = (data): {} => {
    let a = {};
    if (this.ifPort.length > numberType.zero) {
      this.ifPort.forEach(item => {
        if (item.form.$ID === data.portId) {
          a = data;
        }
      });
    }
    return a;
  }

  public end(): void {
    this.closeCoreEnd.emit();
    for (let i = 0; i < this.portNoList.length; i++) {
      this.saveCoreEnd.push({
        'portId': this.portNoListId[i], // 端口ID
        'portNo': this.portNoList[i].portNum, // 端口号
        'resourceDeviceId': this.deviceId, // 所属设施id
        'resourceBoxSide': this.boxAB, // 所属箱ab面
        'resourceFrameNo': this.frameId, // 所属框号
        'resourceDiscSide': this.resourceDiscSide[i], // 所属盘ab面
        'resourceDiscNo': this.resourceDiscNo[i], // 所属盘号
        'oppositeResource': this.opticCableSectionId, // 对端所属光缆段
        'oppositeCableCoreNo': this.oppositeCableCoreNoList[i], // 对端所属纤芯号
        'remark': 'test1' // 备注
      });
    }
    const deleteData = this.deleteCoreData.filter(this.deleteInformationFiltering);
    const data = {
      'insertPortCableCoreInfoReqList': this.saveCoreEnd,
      'updatePortCableCoreInfoReqList': deleteData
    };
    if (this.saveCoreEnd.length === numberType.zero) {
      data.insertPortCableCoreInfoReqList = [{
        'resourceDeviceId': this.deviceId, // 所属设施id
        'resourceBoxSide': this.boxAB, // 所属箱ab面,
        'resourceFrameNo': this.frameId, // 所属框号
        'resourceDiscSide': this.plateAorB,
        'oppositeResource': this.opticCableSectionId, // 对端所属光缆段
      }];
    }
    this.$coreEndService.saveCoreInformation(data).subscribe((result: Result) => {
      if (result.code === numberType.zero) {
        this.$modalService.info(this.language.saveTheCoreInformationSuccessfully);
        this.saveCoreEnd = [];
      } else {
        this.$modalService.info(this.language.failedToSaveCoreInformation);
      }
    });
    // 步骤条与界面回复至第一步
    this.Previous();
    this.clearData();
  }

  /**
   * Qunee图绘制
   */
  /**
   * 点击下一步
   */
  public stepNext(): void {
    this.stepRightOne = false;
    this.stepRightTwo = true;
    this.numberOfSteps = 1;
    this.stepTitle = this.language.establishingACore;

    setTimeout(() => {
      // 查询设施框信息
      this.$coreEndService.queryFacilityBoxInformation(this.boxId).subscribe((portResult: Result) => {
        // 框的宽度
        this.portWidth = portResult.data.width;
        this.frameId = portResult.data.businessNum.toString(); // 添加框id
        portResult.data.childList.forEach(item => {
          this.plateId.push(item.businessNum.toString()); // 添加盘Name
        });
        // 遍历去除其他面端口
        for (let i = 0; i < portResult.data.childList.length; i++) {
          if (portResult.data.childList[i].childList !== null) {
            const portLength = portResult.data.childList[i].childList.length; // 端口数
            for (let q = 0, w = 0; w < portLength;) {
              if (portResult.data.childList[i].childList[q].side === this.plateAorB) {
                this.plateAB.push(portResult.data.childList[i].childList[q].side);
                q = q + 1;
                w = w + 1;
              } else {
                portResult.data.childList[i].childList.splice(q, numberType.one);
                w = w + 1;
              }
            }
          }
        }
        // 遍历获取盘Id和盘AB面
        this.framelsit.push(portResult.data);
        portResult.data.childList.forEach(numA => {
          if (numA.childList !== null) {
            numA.childList.forEach(numB => {
              this.portNum += 1;
            });
          }
        });
        if (this.graph === undefined) {
          this.graph = new this.Q.Graph('canvas');
        }
        this.graph.updateViewport();
        this.graph.originAtCenter = false;
        this.graph.moveToCenter();
        // 设置全局属性
        this.graph.styles = {};
        this.graph.styles[this.Q.Styles.EDGE_COLOR] = colorType.blue;
        this.graph.styles[this.Q.Styles.ARROW_TO] = false;
        this.graph.styles[this.Q.Styles.EDGE_WIDTH] = 2;
        this.graph.styles[this.Q.Styles.EDGE_BUNDLE_LABEL_FONT_SIZE] = '1';
        // // 绘制端口的框
        this.draw(this.framelsit, null);
        this.portId = 0;
        // 绘制光缆段的框
        const cableSegment = this.createText(null, ' ', numberType.fourHundred + this.portWidth, 0,
          this.Q.Position.CENTER_TOP, numberType.twoHundredAndFive, this.coreNum * numberType.fortyThree, numberType.eighteen,
          colorType.blue, colorType.coreIsNotConnected, false);
        // 给每个图元点添加一个类型属性
        cableSegment.$type = cableSegmentType.cableSegmentBox;
        let startCoreY = 0;
        // 绘制光缆段里的光缆头
        for (let i = 0; i < this.coreNum; i++) {
          startCoreY += numberType.forty;
          const toName = this.createText(cableSegment, '1-1', numberType.threeHundredFour + this.portWidth,
            startCoreY, null, numberType.oneHundred, numberType.Seven);
          // 给每个图元点添加一个唯一属性nameId
          toName.$coreId = i + 1;
          // 给每一个图元添加连线判断属性
          toName.$isConnection = true;
          // 给每个图元点添加一个类型属性
          toName.$type = cableSegmentType.StartOpticalCable;
          this.startNameList.push(toName);
          toName.zIndex = numberType.three;
        }
        let endCoreY = numberType.zero;
        // 绘制光缆段里的光缆尾
        for (let i = 0; i < this.coreNum; i++) {
          endCoreY += numberType.forty;
          const toName = this.createText(cableSegment, i + numberType.one + '', numberType.fourHundredAndFive + this.portWidth,
            endCoreY, null, numberType.oneHundred, numberType.Seven);
          // 给每个图元点添加一个唯一属性nameId
          toName.$coreId = i + 1;
          // 给每个图元点添加一个类型属性
          toName.$type = cableSegmentType.endOpticalCable;
          this.endNameList.push(toName);
          toName.zIndex = numberType.three;
        }
        const endData = {'resourceDeviceId': this.deviceId, 'oppositeResource': this.opticCableSectionId};
        const fusedFiberData = {'resource': this.opticCableSectionId, 'intermediateNodeDeviceId': this.deviceId};
        // 获取本设施下熔纤信息
        this.getTheFuseInformation(fusedFiberData);
        // 获取其他设施成端信息
        this.getOtherFacilityInformation(endData);
        // 获取其他设施熔纤信息
        this.getOtherFacilitiesMeltInformation(fusedFiberData);
        // 获取纤芯成端初始化信息
        this.getCoreInitializationInformation(endData);
        // 监听鼠标右键删除
        const menu = new this.Q.PopupMenu();
        this.graph.popupmenu = menu;
        this.graph.popupmenu.getMenuItems = (graph, eventData, event) => {
          if (eventData && eventData.$to) {
            this.nodeId = eventData.nodeId;
            this.showRightMenu = true;
            const menus = document.getElementById('right-menu');
            menus.style.left = event.layerX + 'px';
            menus.style.top = event.layerY + 'px';
            this.deleteData = eventData;
            this.deleteGraph = graph;
          }
        };
        // 监听点击事件
        this.graph.onclick = (event) => {
          this.showRightMenu = false;
          // 遍历获取端口连线form
          if (event.getData()) {
            if (event.getData()._host.$type === typeOfBoxTrayPort.portTray && event.getData().$isConnection === true) {
              for (let i = 0; i < this.portNum; i++) {
                if (event.getData().$PanNum === this.formNameList[i].$PanNum &&
                  event.getData().$portId === this.formNameList[i].$portId) {
                  this.edgeList.push(this.formNameList[i]);
                }
              }
            }
            // 遍历获取光缆段连线to
            if (event.getData()._host.$type === cableSegmentType.cableSegmentBox && event.getData().$isConnection === true) {
              for (let i = 0; i < this.coreNum; i++) {
                // 转化为同一类型做判断
                if (event.getData().$PanNum === this.startNameList[i].$PanNum &&
                  event.getData().$coreId === this.startNameList[i].$coreId) {
                  this.edgeList.push(this.startNameList[i]);
                }
              }
            }
            // 单个图元之间连线
            if (this.edgeList.length >= numberType.two && this.edgeList[0].$type === this.edgeList[1].$type) {
              this.edgeList = [];
            } else if (this.edgeList.length >= numberType.two) {
              this.radioEdge(this.edgeList);
            }
          }
        };
        // 监听框选事件
        this.graph.enddrag = (event) => {
          const datas = this.graph.graphModel.selectionModel.datas;
          if (datas.length > numberType.one) {
            datas.forEach(item => {
              if (item.$type === typeOfBoxTrayPort.port && item.$isConnection === true) {
                this.formFrameEdgeList.push(item);
              } else if (item.$type === cableSegmentType.StartOpticalCable && item.$isConnection === true) {
                this.toFrameEdgeList.push(item);
              }
            });
            if (this.formFrameEdgeList.length > numberType.zero && this.toFrameEdgeList.length > numberType.zero) {
              this.elementConnection(this.formFrameEdgeList, this.toFrameEdgeList);
            }
          }
          // 框选完成之后切换回单选模式
          this.graph.interactionMode = this.Q.Consts.INTERACTION_MODE_DEFAULT;
          this.drawType = selectionMode.arrow;
        };
      });
    }, numberType.fiveHundred);
  }

  /**
   * 绘制框
   */
  public createText(host, name?, x?, y?, anchorPosition?, w?, h?, fontSize?, fontColor?, backgroundColor?, movable?) {
    const text = this.graph.createText(name, x, y);
    // 节点为框或光缆段时可拖动, 其余子节点不可拖动 ***端口框和光缆段框暂时也不可能拖动
    if (movable === true) {
      text.movable = true;
    } else {
      text.movable = false;
    }
    text.setStyle(this.Q.Styles.LABEL_BORDER, numberType.ZeroFive);
    text.setStyle(this.Q.Styles.LABEL_PADDING, numberType.Fives);
    text.setStyle(this.Q.Styles.LABEL_BORDER_STYLE, colorType.frameBorder);
    text.setStyle(this.Q.Styles.LABEL_RADIUS, numberType.zero);
    text.tooltipType = 'text';
    if (host) {
      text.host = text.parent = host;
    }
    if (anchorPosition) {
      text.anchorPosition = anchorPosition;
      text.setStyle(this.Q.Styles.LABEL_ALIGN_POSITION, anchorPosition);
    }
    if (w && h) {
      text.setStyle(this.Q.Styles.LABEL_SIZE, new this.Q.Size(w, h));
    }

    text.setStyle(this.Q.Styles.LABEL_FONT_SIZE, fontSize || numberType.fourteen);
    text.setStyle(this.Q.Styles.LABEL_COLOR, fontColor || colorType.gray);
    text.setStyle(this.Q.Styles.LABEL_BACKGROUND_COLOR, backgroundColor || colorType.coreIsNotConnected);
    text.test = Math.random();
    return text;
  }

  /**
   * 单个图元之间连线
   */
  public radioEdge(arr): void {
    // 同一种类型的图元不可连接
    if (arr.length >= numberType.two) {
      this.createEdge(arr[0], arr[1], '', numberType.one);
      // 判断第一次点击选中的是端口还是光缆
      if (arr[0].$type === typeOfBoxTrayPort.port) {
        arr[1].setStyle(this.Q.Styles.LABEL_BACKGROUND_COLOR, colorType.theCoreIsConnected);
        arr[0].image = '../../../../assets/img/smart/port_ok.png';
      } else if (arr[0].$type === cableSegmentType.StartOpticalCable || arr[0].$type === cableSegmentType.endOpticalCable) {
        arr[0].setStyle(this.Q.Styles.LABEL_BACKGROUND_COLOR, colorType.theCoreIsConnected);
        arr[1].image = '../../../../assets/img/smart/port_ok.png';
      }
      this.edgeList = [];
    }
  }

  /**
   * 创建连线
   * form
   * to
   */
  public createEdge(form, to, text?, type?): void {
    if ((type === numberType.one && form && to && form.$isConnection === true && to.$isConnection === true) ||
      (type === numberType.two && form && to)) {
      if (form.$portId !== undefined && form.$portId) {
        this.portNoList.push({
          portNum: form.$portId.toString(),
          panNum: form.$PanNum
        });
        this.portNoListId.push(form.$ID);
        this.resourceDiscNo.push(form._host.$nameId);
        this.resourceDiscSide.push(form._host.$nameAB);
        this.oppositeCableCoreNoList.push(to.$coreId);
      } else if (form.$coreId !== undefined && form.$coreId) {
        this.portNoList.push({
          portNum: to.$portId.toString(),
          panNum: to.$PanNum
        });
        this.portNoListId.push(to.$ID);
        this.resourceDiscNo.push(to._host.$nameId);
        this.resourceDiscSide.push(to._host.$nameAB);
        this.oppositeCableCoreNoList.push(form.$coreId);
      }
      let edge;
      edge = this.graph.createEdge(text, form, to);
      form.$isConnection = false;
      to.$isConnection = false;
      edge.zIndex = numberType.ten;
      if (form.$type === typeOfBoxTrayPort.port) {
        to.setStyle(this.Q.Styles.LABEL_BACKGROUND_COLOR, colorType.theCoreIsConnected);
        form.image = '../../../../assets/img/smart/port_ok.png';
      } else if (form.$type === cableSegmentType.StartOpticalCable || form.$type === cableSegmentType.endOpticalCable) {
        form.setStyle(this.Q.Styles.LABEL_BACKGROUND_COLOR, colorType.theCoreIsConnected);
        to.image = '../../../../assets/img/smart/port_ok.png';
      }
      return edge;
    }
  }

  /**
   * 框选图元之间连线
   */
  public elementConnection(fromArr, toArr): void {
    let maxNum;
    let minNum;
    if (fromArr.length > toArr.length) {
      maxNum = fromArr.length;
      minNum = toArr.length;
    } else {
      maxNum = toArr.length;
      minNum = fromArr.length;
    }
    if (fromArr.length >= numberType.two && toArr.length >= numberType.two) {
      for (let i = 0; i < maxNum; i++) {
        if (i < minNum) {
          this.createEdge(fromArr[i], toArr[i], '', numberType.one);
          // 判断第一次点击选中的是端口还是光缆
          if (fromArr[i].$type === typeOfBoxTrayPort.port || fromArr[i].$type === cableSegmentType.StartOpticalCable
            || fromArr[i].$type === cableSegmentType.endOpticalCable) {
            toArr[i].setStyle(this.Q.Styles.LABEL_BACKGROUND_COLOR, colorType.theCoreIsConnected);
            fromArr[i].image = '../../../../assets/img/smart/port_ok.png';
          }
        } else {
          break;
        }
      }
      this.formFrameEdgeList = [];
      this.toFrameEdgeList = [];
    }
  }

  /**
   * 绘制实景图
   */
  public draw(picData: Array<RealPosition>, parentNode): void {
    // 绘制方式大致为逐级绘制 先绘制父级 然后逐级绘制子级
    for (let i = 0; i < picData.length; i++) {
      const curNode = picData[i];
      let imgUrl = null;
      switch (curNode.deviceType) {
        // 箱
        case DeviceTypeEnum.DEVICE_TYPE_BOX:
          imgUrl = BusinessImageUrl.BOX_IMG;
          break;
        // 框
        case DeviceTypeEnum.DEVICE_TYPE_FRAME:
          imgUrl = BusinessImageUrl.FRAME_IMG;
          break;
        // 盘
        case DeviceTypeEnum.DEVICE_TYPE_DISC:
          // 盘在位
          if (curNode.state === BoardStateEnum.REIGN) {
            imgUrl = BusinessImageUrl.BOARD_IMG;
          } else {
            imgUrl = null;
          }
          break;
        // 端口
        case DeviceTypeEnum.DEVICE_TYPE_PORT:
          // 虚占OCCUPY
          if (curNode.state === PortStateEnum.VIRTUAL_OCCUPY) {
            imgUrl = BusinessImageUrl.VIRTUAL_PORT_IMG;
            //  预占用
          } else if (curNode.state === PortStateEnum.PRE_OCCUPY) {
            imgUrl = BusinessImageUrl.PRE_PORT_IMG;
            //  空闲
          } else if (curNode.state === PortStateEnum.FREE) {
            imgUrl = BusinessImageUrl.VERTICAL_PORT_IMG;
            //  异常
          } else if (curNode.state === PortStateEnum.EXCEPTION) {
            imgUrl = BusinessImageUrl.ERROR_PORT_IMG;
            // 占用
          } else if (curNode.state === PortStateEnum.OCCUPY) {
            imgUrl = BusinessImageUrl.USER_PORT_IMG;
          } else {
            imgUrl = null;
          }
          break;
        default:
          imgUrl = null;
      }
      // 绘制当前节点
      const curParentNode = this.drawNode(curNode.abscissa, curNode.ordinate, curNode.width, curNode.height, imgUrl, parentNode, curNode);
      curParentNode.movable = false;
      if (curNode.deviceType === DeviceTypeEnum.DEVICE_TYPE_PORT) {
        // 给每个图元点添加一个唯一属性nameId
        // this.portId += 1;
        curParentNode.$portId = picData[i].businessNum;
        // 添加端口ID
        curParentNode.$ID = picData[i].id;
        // 添加端口所属盘号
        curParentNode.$PanNum = picData[i].discNum;
        // 给每一个图元添加连线判断属性
        curParentNode.$isConnection = true;
        // 给每个图元点添加一个类型属性
        curParentNode.$type = typeOfBoxTrayPort.port;
        // 给每个图元点添加一个AB面属性
        // curParentNode.$AorB = this.portAorB[i];
        if (curNode.portCableState === numberType.one) {
          curParentNode.image = '../../../../assets/img/smart/port_ok.png';
          // 端口状态已成端的无法再成端
          curParentNode.$isConnection = false;
        }
        this.formNameList.push(curParentNode);
      } else if (curNode.deviceType === DeviceTypeEnum.DEVICE_TYPE_DISC) {
        curParentNode.$type = typeOfBoxTrayPort.portTray;
        curParentNode.$nameId = this.plateId[i];
        curParentNode.$nameAB = this.plateAB[i];
      } else if (curNode.deviceType === DeviceTypeEnum.DEVICE_TYPE_FRAME) {
        curParentNode.$type = typeOfBoxTrayPort.portBox;
      }
      if (picData[i].childList && picData[i].childList.length > numberType.zero) {
        this.draw(picData[i].childList, curParentNode);
      }
    }
  }

  /**
   * 绘制节点
   */
  public drawNode(startX, startY, width, height, img, parent, current) {
    const node = this.graph.createNode('', startX, startY);
    node.anchorPosition = this.Q.Position.LEFT_TOP;
    node.image = img;
    node.size = {width, height};
    if (parent) {
      node.host = parent;
      node.parent = parent;
    }
    node.data = current;
    return node;
  }

  /**
   * 切换选择模式(点选/框选)
   */
  public chooseUtil(event): void {
    this.drawType = event;
    if (this.drawType === selectionMode.arrow) {
      // 默认交互模式
      this.graph.interactionMode = this.Q.Consts.INTERACTION_MODE_DEFAULT;
      this.drawType = selectionMode.arrow;
    } else {
      // 框选交互模式
      this.drawType = selectionMode.rectangle;
      this.graph.interactionMode = this.Q.Consts.INTERACTION_MODE_SELECTION;
    }
  }

  /**
   * 截取url
   */

  public getQueryString(name): string {
    const reg = new RegExp('(^|\\?|&)' + name + '=([^&]*)(\\s|&|$)', 'i');
    if (reg.test(location.href)) {
      return unescape(RegExp.$2.replace(/\+/g, ' '));
    } else {
      return '';
    }
  }

  /**
   * 获取框的Name
   */
  public getFrameName(type): void {
    this.frameNameList = [];
    this.boxSet.sort((a, b) => {
      return a.side - b.side;
    });
    if (type === numberType.zero) {
      this.boxSet[0].childList.forEach(item => {
        this.frameNameList.push({label: item.businessNum.toString(), value: item.id});
      });
    } else {
      this.boxSet[1].childList.forEach(item => {
        this.frameNameList.push({label: item.businessNum.toString(), value: item.id});
      });
    }
    // 框的Name升序
    this.frameNameList.sort((a, b) => {
      return a.label - b.label;
    });
    this.formColumn[1].selectInfo.data = this.frameNameList;
  }

  /**
   * 获取框初始化信息 childList
   */
  public getTheCoreEndInitialization(): Promise<{}> {
    return new Promise((resolve, reject) => {
      const url = this.getQueryString('id');
      this.deviceId = url;
      const deviceFalse = this.deviceId;
      // 获取箱的AB面
      this.$coreEndService.getTheABsurfaceInformationOfTheBox(deviceFalse).subscribe((resultBox: Result) => {
        if (resultBox.code === numberType.zero) {
          this.boxSet = resultBox.data;
          resultBox.data.forEach(item => {
            if (item.side === numberType.zero) {
              this.boxAorB.push({label: this.language.Asurface, value: item.side});
            } else if (item.side === numberType.one) {
              this.boxAorB.push({label: this.language.Bsurface, value: item.side});
            }
          });
          // 箱的AB面做升序
          this.boxAorB.sort((a, b) => {
            return a.value - b.value;
          });
          // 获取所有光缆段信息
          this.$coreEndService.getCableSegmentInformation(this.deviceId).subscribe((resultOpticalCable: Result) => {
            this.opticCableSectionId = resultOpticalCable.data[0].opticCableSectionId;
            this.coreNum = resultOpticalCable.data[0].coreNum;
            resultOpticalCable.data.forEach((item => {
              this.opticCableSectionNameList.push({label: item.opticCableSectionName, value: item.opticCableSectionId});
            }));
          });
          resolve(true);
        } else {
          this.initColumn();
        }
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * 检查页面数据是否填写完整
   */
  public checkData(): boolean {
    if (this.selectBox !== undefined && this.selectBox !== '' && this._opticCableSectionId !== undefined &&
      this._opticCableSectionId !== '' && this.boxId !== undefined && this.boxId !== '' && this.plateAorB
      !== undefined && this.plateAorB !== '' && this.plateHave === numberType.one) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 获取本设施熔纤信息
   */
  public getTheFuseInformation(data): void {
    this.$coreEndService.getTheFuseInformation(data).subscribe((result: Result) => {
      if (result.data.length > numberType.zero) {
        result.data.forEach(arr => {
          if (arr.resource === this.opticCableSectionId) {
            this.startNameList.forEach(item => {
              if (arr.cableCoreNo === item.$coreId.toString()) {
                this.array.push(item);
                item.setStyle(this.Q.Styles.LABEL_BACKGROUND_COLOR, colorType.otherTheCoreIsConnected);
                item.$isConnection = false;
              }
            });
          } else if (arr.oppositeResource === this.opticCableSectionId) {
            this.startNameList.forEach(item => {
              if (arr.oppositeCableCoreNo === item.$coreId.toString()) {
                this.array.push(item);
                item.setStyle(this.Q.Styles.LABEL_BACKGROUND_COLOR, colorType.otherTheCoreIsConnected);
                item.$isConnection = false;
              }
            });
          }
        });
        this.array = [];
      }
    });
  }

  /**
   * 获取其他设施成端信息
   */
  public getOtherFacilityInformation(data): void {
    this.$coreEndService.getPortCableCoreInfoNotInDevice(data).subscribe((result: Result) => {
      if (result.data.length > numberType.zero) {
        result.data.forEach(arr => {
          this.endNameList.forEach(item => {
            if (arr.oppositeCableCoreNo === item.$coreId.toString()) {
              item.setStyle(this.Q.Styles.LABEL_BACKGROUND_COLOR, colorType.otherTheCoreIsConnected);
              this.array.push(item);
              item.$isConnection = false;
            }
          });
        });
        this.array = [];
      }
    });
  }

  /**
   * 获取其他设施熔纤信息
   */
  public getOtherFacilitiesMeltInformation(data): void {
    this.$coreEndService.queryCoreCoreInfoNotInDevice(data).subscribe((result: Result) => {
      if (result.data.length > numberType.zero) {
        result.data.forEach(arr => {
          if (arr.resource === this.opticCableSectionId) {
            this.endNameList.forEach(v => {
              if (arr.cableCoreNo === v.$coreId.toString()) {
                this.array.push(v);
                v.setStyle(this.Q.Styles.LABEL_BACKGROUND_COLOR, colorType.otherTheCoreIsConnected);
                v.$isConnection = false;
              }
            });
          } else if (arr.oppositeResource === this.opticCableSectionId) {
            this.endNameList.forEach(item => {
              if (arr.oppositeCableCoreNo === item.$coreId.toString()) {
                this.array.push(item);
                item.$isConnection = false;
                item.setStyle(this.Q.Styles.LABEL_BACKGROUND_COLOR, colorType.otherTheCoreIsConnected);
              }
            });
          }
        });
        this.array = [];
      }
    });
  }

  /**
   * 获取纤芯成端初始化信息
   */
  public getCoreInitializationInformation(data): void {
    const noDeviceData = [];
    this.array = [];
    this.$coreEndService.getTheCoreEndInitialization(data).subscribe((opticalCableResult: Result) => {
      if (opticalCableResult.data.length > numberType.zero) {
        opticalCableResult.data.forEach(arr => {
          if ((arr.portNo && arr.oppositeCableCoreNo && arr.resourceFrameNo === this._boxId.toString()) &&
            (arr.resourceBoxSide === this.boxAB && arr.resourceDiscSide === this.plateAorB)) {
            this.formNameList.forEach(item => {
              if (arr.resourceDiscNo === item.$PanNum.toString() && arr.portNo === item.$portId.toString()) {
                this.array.push(item);
              }
            });
            this.startNameList.forEach(item => {
              if (arr.oppositeCableCoreNo === item.$coreId.toString()) {
                this.array.push(item);
              }
            });
            this.createEdge(this.array[0], this.array[1], '', numberType.two);
            if (this.array) {
              this.ifPort.push({form: this.array[0], to: this.array[1]});
            }
            this.array = [];
          } else {
            noDeviceData.push(arr);
            this.startNameList.forEach(itemOne => {
              noDeviceData.forEach(itemTwo => {
                if (itemTwo.oppositeCableCoreNo === itemOne.$coreId.toString()) {
                  itemOne.setStyle(this.Q.Styles.LABEL_BACKGROUND_COLOR, colorType.otherTheCoreIsConnected);
                  itemOne.$isConnection = false;
                }
              });
            });
          }
        });
      }
    });
  }

  /**
   * 删除连线
   */
  public deleteConnection(): void {
    if (this.deleteData.$from.$portId !== undefined) {
      for (let i = 0; i < this.portNoList.length; i++) {
        if (this.deleteData.$from.$portId.toString() === this.portNoList[i].portNum &&
          this.deleteData.$from.$PanNum === this.portNoList[i].panNum
        ) {
          this.portNoList.splice(i, numberType.one);
          this.portNoListId.splice(i, numberType.one);
          this.resourceDiscSide.splice(i, numberType.one);
          this.resourceDiscNo.splice(i, numberType.one);
          this.deleteData.$from.$isConnection = true;
          this.deleteData.$from.image = '../../../../assets/img/smart/port_vertical_idle.png';
        }
      }
      this.addDeleteData(this.deleteData.$from.$ID);
    } else {
      for (let i = 0; i < this.portNoList.length; i++) {
        if (this.deleteData.$to.$portId.toString() === this.portNoList[i].portNum &&
          this.deleteData.$to.$PanNum === this.portNoList[i].panNum
        ) {
          this.portNoList.splice(i, numberType.one);
          this.deleteData.$to.$isConnection = true;
          this.deleteData.$to.image = '../../../../assets/img/smart/port_vertical_idle.png';
        }
      }
      this.addDeleteData(this.deleteData.$to.$ID);
    }

    if (this.deleteData.$to.$coreId !== undefined) {
      this.deleteData.$to.setStyle(this.Q.Styles.LABEL_BACKGROUND_COLOR, colorType.coreIsNotConnected);
      this.deleteData.$to.$isConnection = true;
      for (let i = 0; i < this.oppositeCableCoreNoList.length; i++) {
        if (this.deleteData.$to.$coreId === this.oppositeCableCoreNoList[i]) {
          this.oppositeCableCoreNoList.splice(i, numberType.one);
        }
      }
    } else {
      this.deleteData.$from.setStyle(this.Q.Styles.LABEL_BACKGROUND_COLOR, colorType.coreIsNotConnected);
      this.deleteData.$from.$isConnection = true;

      for (let i = 0; i < this.oppositeCableCoreNoList.length; i++) {
        if (this.deleteData.$from.$coreId === this.oppositeCableCoreNoList[i]) {
          this.oppositeCableCoreNoList.splice(i, numberType.one);
        }
      }
    }
    this.deleteGraph.removeElement(this.deleteData);
    this.showRightMenu = false;
  }

  /**
   * 存储删除掉的数据
   */
  public addDeleteData(id): void {
    this.deleteCoreData.push({
      'portId': id,
      'portStatus': numberType.zero
    });
  }
}
