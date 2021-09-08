import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FiLinkModalService} from '../../service/filink-modal/filink-modal.service';
import {SmartService} from '../../../core-module/api-service/facility/smart/smart.service';
import {Result} from '../../entity/result';
import {RealPosition} from '../business-picture/real-position';
import {BoardPutState, BoardStateEnum, DeviceTypeEnum, PortStateEnum, RfidStatusEnum} from '../../entity/template';
import {BusinessImageUrl} from '../../enum/business-image-url.enum';
import {BasicTemplate} from '../business-template/basic-template';
import {CommonUtil} from '../../util/common-util';
import {BusinessFacilityService} from '../../service/business-facility/business-facility.service';
import {NzI18nService} from 'ng-zorro-antd';
import {FacilityLanguageInterface} from '../../../../assets/i18n/facility/facility.language.interface';

@Component({
  selector: 'app-business-frame',
  templateUrl: './business-frame.component.html',
  styleUrls: ['./business-frame.component.scss']
})
export class BusinessFrameComponent extends BasicTemplate implements OnInit, OnChanges {
  public language: FacilityLanguageInterface;
  @Input() frameID: string = '';
  @Input() portID = '';
  @Output() portSelectChange = new EventEmitter();

  // 存储当前选择框
  portNode = null;
  // 端口AB面
  frameSide = 0;
  // 控制是否显示盘AB面
  frameShow: boolean = false;
  // 右键事件弹框显示
  rightShow = false;
  // 右键事件上下架显示
  framelock = false;
  // 存储当前点击端口数据
  eData;
  // picData: Array<RealPosition> = [];
  picData;
  // 右键事件查询参数
  rightData;
  // 刷新判断
  refreshJudge;
  // 判断框在不在位
  ifFrame: boolean = false;
  // 上下架数据
  frameData;

  private objPicData: any = [];

  constructor(private $nzI18n: NzI18nService,
              private $message: FiLinkModalService,
              private $smartService: SmartService,
              private $businessFacilityService: BusinessFacilityService) {
    super();
  }

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData('facility');
    window.oncontextmenu = function () {
      return false;
    };

    this.initGraph('business-frame-canvas');
    // this.graph.clear();
    // 添加点击事件用于处理端口
    this.graph.addCustomInteraction({
      // 点击获取端口数据
      onclick: e => {
        this.rightShow = false;
        const target = e.getData();
        if (target) {
          this.portSelect(target);
        }
      },
      // 右键点击修改端口上下架状态
      oncontextmenu: e => {
        this.eData = e.getData();
        if (this.eData && this.ifFrame === true) {
          this.rightShow = true;
          // 转换上下架状态
          if (this.eData.data.deviceType === DeviceTypeEnum.DEVICE_TYPE_DISC) {
            if (this.eData.data.state === BoardStateEnum.REIGN) {
              this.framelock = false;
            } else {
              this.framelock = true;
            }
          } else if (this.eData.data.deviceType === DeviceTypeEnum.DEVICE_TYPE_PORT) {
            if (this.eData.data.parent.data.state === BoardStateEnum.REIGN) {
              this.framelock = false;
            } else {
              this.framelock = true;
            }
          }
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('frameID') && changes.frameID.currentValue) {
      this.graph.clear();
      this.frameDraw();
    }
  }

  /**
   * 端口右键点击事件弹框关闭u
   */
  handleCancelMiddle() {
    // 关闭模态框
    this.rightShow = false;
    // 清空右键点击事件查询参数
    this.rightData = null;
  }

  /**
   * 端口右键点击事件弹框确定
   */
  handleOkMiddle() {
    if (this.eData.data.deviceType === DeviceTypeEnum.DEVICE_TYPE_DISC) {
      if (this.eData.data.state === BoardStateEnum.REIGN) {
        this.eData.data.state = BoardStateEnum.ABSENT;
      } else {
        this.eData.data.state = BoardStateEnum.REIGN;
      }
      this.rightData = {
        discId: this.eData.data.id,
        state: this.eData.data.state
      };
    } else if (this.eData.data.deviceType === DeviceTypeEnum.DEVICE_TYPE_PORT) {
      if (this.eData.data.parent.data.state === BoardStateEnum.REIGN) {
        this.eData.data.parent.data.state = BoardStateEnum.ABSENT;
      } else {
        this.eData.data.parent.data.state = BoardStateEnum.REIGN;
      }
      this.rightData = {
        discId: this.eData.data.discId,
        state: this.eData.data.parent.data.state
      };
    }
    const data = this.frameData.data.childList.filter(item => {
      return item.id === this.rightData.discId;
    });
    if (data[0].busState === RfidStatusEnum.Normal) {
      this.$smartService.updatePortState(this.rightData).subscribe((result: Result) => {
        if (result.code === 0) {
          // 重新渲染
          this.frameDraw();
          this.$businessFacilityService.eventEmit.emit({refreshJudge: true});
        } else {
          this.$message.warning(result.msg);
        }
      });
    } else {
      this.$message.info(this.language.dishUpperAndLowerShelfLimit)
    }
    // 关闭模态框
    this.rightShow = false;
  }

  /**
   * 盘绘制数据刷新
   */
  frameDraw() {
    if (this.frameID) {
      this.$smartService.queryRealPositionByFrame(this.frameID).subscribe((result: Result) => {
        if (result.code === 0) {
          this.frameData = result;
          this.picData = result.data;
          // 深拷贝picDate用于盘上端口AB面切换
          this.objPicData = CommonUtil.deepClone(this.picData);
          if (this.picData.childList) {
            this.picData.childList.map(item => {
              if (item.childList) {
                item.childList.map(v => {
                  if (v.side === 1) {
                    this.frameShow = true;
                  }
                });
              }
            });
          }
          this.frameChange();
        } else {
          this.$message.warning(result.msg);
        }
      });
    }
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
          imgUrl = BusinessImageUrl.FRAME_IMG;
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
      if (!this.portNode) {
        if (curNode.deviceType === DeviceTypeEnum.DEVICE_TYPE_PORT) {
          this.portNode = curParentNode;
          // this.portSelectChange.emit(this.portNode);
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
    if (current.deviceType !== DeviceTypeEnum.DEVICE_TYPE_PORT) {
      node.setStyle(this.Q.Styles.SELECTION_COLOR, 'rgba(255,255,255,0)');
    }
    node.setStyle(this.Q.Styles.SELECTION_SHADOW_BLUR, 20);
    node.setStyle(this.Q.Styles.SELECTION_SHADOW_OFFSET_X, 2);
    node.setStyle(this.Q.Styles.SELECTION_SHADOW_OFFSET_Y, 2);
    node.movable = false;
    node.anchorPosition = this.Q.Position.LEFT_TOP;
    node.image = img;
    node.size = {width, height};
    if (parent) {
      node.host = parent;
      node.parent = parent;
    }
    current.parent = parent;
    node.data = current;
    return node;
  }

  /**
   * 点击实景图切换框图片
   * param node
   */
  portSelect(node) {
    const data = node.data;
    if (data.deviceType === DeviceTypeEnum.DEVICE_TYPE_PORT) {
      this.portSelectChange.emit(node);
    }
  }

  /**
   * 盘AB面切换
   * */
  frameChange() {
    this.ifFrame = false;
    if (this.picData.childList) {
      this.ifFrame = true;
      this.picData.childList.forEach((item, index) => {
        if (item.childList) {
          this.objPicData.childList[index].childList = item.childList.filter(v => {
            return v.side === this.frameSide;
          });
        }
      });
    }
    this.draw([this.objPicData], null);
  }

}
