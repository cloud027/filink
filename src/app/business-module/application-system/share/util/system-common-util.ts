import {CommonUtil} from '../../../../shared-module/util/common-util';
import {ApplicationFinalConst} from '../const/application-system.const';

/**
 * 工具方法
 */
export class SystemCommonUtil {
  /**
   * 格式化时分秒
   */
  static dateFmt(data: number): string {
    let time;
    if (data > 0) {
      time = new Date(data);
    } else {
      time = new Date();
    }
    const hh = time.getHours() >= 10 ? time.getHours() : `0${time.getHours()}`;
    const mm = time.getMinutes() >= 10 ? time.getMinutes() : `0${time.getMinutes()}`;
    return `${hh}:${mm}`;
  }

  /**
   * 时间戳、date类型转化字符串时间
   * @param date 时间
   */
  public static processingTime(date) {
    if (date) {
      return CommonUtil.dateFmt(ApplicationFinalConst.dateType, new Date(date));
    } else {
      return null;
    }
  }
}
