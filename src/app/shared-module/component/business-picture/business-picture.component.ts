import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, OnChanges} from '@angular/core';
import {BusinessImageUrl} from '../../enum/business-image-url.enum';
import {FiLinkModalService} from '../../service/filink-modal/filink-modal.service';
import {SmartService} from '../../../core-module/api-service/facility/smart/smart.service';
import {Result} from '../../entity/result';
import {BasicTemplate} from '../business-template/basic-template';
import {RealPosition} from './real-position';
import {BoardStateEnum, DeviceTypeEnum, PortStateEnum, BoardPutState} from '../../entity/template';
import {FacilityLanguageInterface} from '../../../../assets/i18n/facility/facility.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {BusinessFacilityService} from '../../service/business-facility/business-facility.service';

@Component({
  selector: 'app-business-picture',
  templateUrl: './business-picture.component.html',
  styleUrls: ['./business-picture.component.scss']
})
export class BusinessPictureComponent extends BasicTemplate implements OnInit, AfterViewInit, OnChanges {
  public language: FacilityLanguageInterface;
  @Input() canSelectFrame: boolean = false;
  @Input() deviceID: string = '';
  @Output() frameSelectChange = new EventEmitter();
  @Output() sideSelectChange = new EventEmitter();
  // 箱AB面
  side = 0;
  // 控制是否显示框AB面
  isShow: boolean = false;
  // 存储当前选择框
  frameNode = null;
  // 保存切换框
  selectNode = null;
  // 查询数据
  picData: Array<RealPosition> = [];
  // 箱在不在位
  ifBoxData: boolean = false;
  constructor(private $nzI18n: NzI18nService,
              private $message: FiLinkModalService,
              private $smartService: SmartService,
              private $businessFacilityService: BusinessFacilityService) {
    super();
  }

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData('facility');
    this.$businessFacilityService.eventEmit.subscribe((value) => {
      if (value.refreshJudge === true) {
        this.queryBusinssPicture();
      }
    });
  }

  ngOnChanges() {

  }

  ngAfterViewInit(): void {
    this.initGraph('business-picture-canvas');
    this.graph.clear();
    // 线条禁止拖动
    this.graph.isSelectable = (item) => {
      return item.get('type') === 'cabinet';
    };
    // 查询实景图数据
    this.queryBusinssPicture();
    // 添加点击事件用于处理选择框
    if (this.canSelectFrame) {
      this.graph.addCustomInteraction({
        onclick: e => {
          const target = e.getData();
          if (target) {
            this.changeFrameImg(target);
          }
        }
      });
    }
  }


  /**
   * 查询实景图数据
   */
  queryBusinssPicture() {
    // 数据：'deviceId2'
    const data = {
      'deviceId': this.deviceID
      // 'deviceId': 'deviceId2'
    };
    this.$smartService.queryRealPosition(data).subscribe((result: Result) => {
      if (result.code === 0) {
        this.picData = result.data;
        if (this.picData.length > 1) {
          this.isShow = true;
        }
        this.sideChange();
      } else {
        this.$message.warning(result.msg);
      }
    });
  }

  /**
   * 绘制实景图
   */
  draw(picData: Array<RealPosition>, parentNode) {
    // 绘制方式大致为逐级绘制 先绘制父级 然后逐级绘制子级
    for (let i = 0; i < picData.length; i++) {
      const curNode: any = picData[i];
      let imgUrl = null;
      switch (curNode.deviceType) {
        // 箱
        case DeviceTypeEnum.DEVICE_TYPE_BOX:
          imgUrl = BusinessImageUrl.BOX_IMG;
          break;
        // 框
        case DeviceTypeEnum.DEVICE_TYPE_FRAME:
          if(curNode.state === BoardStateEnum.REIGN){
            if (this.selectNode && curNode.id === this.selectNode) {
              imgUrl = BusinessImageUrl.SELECT_FRAME_IMG;
            } else {
              imgUrl = BusinessImageUrl.FRAME_IMG;
            }
          } else {
            imgUrl = BusinessImageUrl.FRAME_IMG;
          }
          break;
        // 盘
        case DeviceTypeEnum.DEVICE_TYPE_DISC:
          // 盘在位
          if (curNode.state === BoardStateEnum.REIGN) {
            // 盘横放
            if (curNode.putState === BoardPutState.LAY) {
              imgUrl = BusinessImageUrl.BOARD_IMG;
              // 盘竖放
            } else if (curNode.putState === BoardPutState.STELLEN) {
              imgUrl = BusinessImageUrl.BOARD_IMG_UP;
            }
          } else {
            // 盘不在位横放
            if (curNode.putState === BoardPutState.LAY) {
              imgUrl = BusinessImageUrl.SLOT_IMG;
              // 盘不在位竖放
            } else if (curNode.putState === BoardPutState.STELLEN) {
              imgUrl = BusinessImageUrl.SLOT_IMG_UP;
            }
          }
          break;
        // 端口
        case DeviceTypeEnum.DEVICE_TYPE_PORT:
          // 虚占
          if (curNode.portState === PortStateEnum.VIRTUAL_OCCUPY) {
            // curNode.tooltip =
            if (curNode.putState === BoardPutState.LAY) {
              imgUrl = BusinessImageUrl.VIRTUAL_PORT_IMG;
            } else {
              imgUrl = BusinessImageUrl.VIRTUAL_PORT_IMG_up;
            }
            //  预占用
          } else if (curNode.portState === PortStateEnum.PRE_OCCUPY) {
            if (curNode.putState === BoardPutState.LAY) {
              imgUrl = BusinessImageUrl.PRE_PORT_IMG;
            } else {
              imgUrl = BusinessImageUrl.PRE_PORT_IMG_up;
            }
            //  空闲
          } else if (curNode.portState === PortStateEnum.FREE) {
            if (curNode.putState === BoardPutState.LAY) {
              imgUrl = BusinessImageUrl.VERTICAL_PORT_IMG;
            } else {
              imgUrl = BusinessImageUrl.VERTICAL_PORT_IMG_up;
            }
            //  异常
          } else if (curNode.portState === PortStateEnum.EXCEPTION) {
            if (curNode.putState === BoardPutState.LAY) {
              imgUrl = BusinessImageUrl.ERROR_PORT_IMG;
            } else {
              imgUrl = BusinessImageUrl.ERROR_PORT_IMG_up;
            }
            // 占用
          } else if (curNode.portState === PortStateEnum.OCCUPY) {
            if (curNode.putState === BoardPutState.LAY) {
              imgUrl = BusinessImageUrl.USER_PORT_IMG;
            } else {
              imgUrl = BusinessImageUrl.USER_PORT_IMG_up;
            }
          } else {
            imgUrl = null;
          }
          break;
        default:
          imgUrl = null;
      }
      // 绘制当前节点
      const curParentNode = this.drawNode(curNode.abscissa, curNode.ordinate, curNode.width, curNode.height, imgUrl, parentNode, curNode);
      if (curNode.deviceType === DeviceTypeEnum.DEVICE_TYPE_FRAME) {
        if (this.canSelectFrame) {
          if (!this.selectNode) {
            this.selectNode = curNode.id;
            this.graph.graphModel.forEach(item => {
              if (item.data.deviceType === 1) {
                if (item.data.id === this.selectNode) {
                  item.image = BusinessImageUrl.SELECT_FRAME_IMG;
                  this.selectNode = item.data.id;
                  this.frameSelectChange.emit(item);
                } else {
                  item.image = BusinessImageUrl.FRAME_IMG;
                }
              }
            });
          }
        }
      }
      if (picData[i].childList && picData[i].childList.length > 0) {
        this.draw(picData[i].childList, curParentNode);
      }
    }
  }

  /**
   * 绘制节点
   */
  drawNode(startX, startY, width, height, img, parent, current) {
    const node = this.graph.createNode('', startX, startY);
    // 设施类型为端口
    if (current.deviceType === DeviceTypeEnum.DEVICE_TYPE_PORT) {
      // 端口的状态-预占用
      if (current.portState === PortStateEnum.PRE_OCCUPY) {
        node.tooltip = this.language.PreOccupy;
        // 占用
      } else if (current.portState === PortStateEnum.OCCUPY) {
        node.tooltip = this.language.Occupy;
        // 空闲
      } else if (current.portState === PortStateEnum.FREE) {
        node.tooltip = this.language.Free;
        // 异常
      } else if (current.portState === PortStateEnum.EXCEPTION) {
        node.tooltip = this.language.Exception;
        // 虚占
      } else if (current.portState === PortStateEnum.VIRTUAL_OCCUPY) {
        node.tooltip = this.language.VirtualOccupy;
      }
      node.zIndex = 999;
    }
    node.movable = false;
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
   * 点击实景图切换框图片
   * param node
   */
  changeFrameImg(node) {
    let selectNodeId = '';
    (function getFrameId(_node) {

      if (_node.data.deviceType === 1) {
        selectNodeId = _node.data.id;
      } else {
        getFrameId(_node.host);
      }
    })(node);
    this.graph.graphModel.forEach(item => {
      if (item.data.deviceType === 1) {
        if (item.data.id === selectNodeId) {
          item.image = BusinessImageUrl.SELECT_FRAME_IMG;
          this.selectNode = item.data.id;
          this.frameSelectChange.emit(item);
        } else {
          item.image = BusinessImageUrl.FRAME_IMG;
        }
      }
    });
  }
  /**
   * 箱AB面切换
   */
  sideChange() {
    this.clearGraph();
    this.frameNode = null;
    const picData = this.picData.filter(item => item.side === this.side);
    const zNum = picData[0].childList.length;
    let num = 0;
      picData[0].childList.forEach((box, boxIndex)=>{
        if (box.childList) {
          box.childList.forEach((item, index) => {
            if (item.childList) {
              picData[0].childList[boxIndex].childList[index].childList = item.childList.filter(v => {
                return v.side === 0;
              });
            }
          });
        } else {
          num += 1;
        }
      });
      // 判断箱全部在不在位
      if (num === zNum) {
        this.ifBoxData = false;
      } else {
        this.ifBoxData = true;
      }
    this.draw(picData, null);
    this.sideSelectChange.emit(this.side);
  }
}
