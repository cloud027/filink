import {MessageTypeEnum} from '../enum/message-type.enum';

export class MessageDataModel {
  /**
   * 消息内容
   */
  public content: string;
  /**
   * 消息时间
   */
  public createTime: string;
  /**
   * 标题
   */
  public title: string;
  /**
   * 消息类型
   */
  public type: MessageTypeEnum;
  /**
   * 开始时间
   */
  public beginTime: string;
  /**
   * 结束时间
   */
  public endTime: string;
  /**
   * 内容中的链接
   */
  public url: string;
  /**
   * 接收链接
   */
  public acceptUrl: string;
  /**
   * 不接收链接
   */
  public noAcceptUrl: string;
}
