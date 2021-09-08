/**
 * 由于后台返回消息是JSON类型 比较混乱 都用any
 */
import {ChannelCode} from '../enum/channel-code';

interface Msg {
  code: any;
  data: any;
}

/**
 * websocket 消息模型
 */
export class WebsocketMessageModel {
  channelId: string;
  channelKey: ChannelCode;
  msg: Msg | string | any;
  msgType: number;
}
