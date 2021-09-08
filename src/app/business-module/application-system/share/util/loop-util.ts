import {LoopStatusEnum, LoopTypeEnum} from '../../../../core-module/enum/loop/loop.enum';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';

export class LoopUtil {
  /**
   * 格式化回路列表的状态值
   * @ param data
   */
  public static loopFmt(data, $nzI18n): void {
    data.forEach(item => {
      // 回路状态转换
      if (item.loopStatus !== null) {
        item.loopStatus = CommonUtil.codeTranslate(LoopStatusEnum, $nzI18n, item.loopStatus, LanguageEnum.facility);
      }
      // 回路类型不是自定义国际化转换
      if (item.loopType === LoopTypeEnum.customize) {
        item.loopType = item.customizeLoopType;
      } else {
        item.loopType = CommonUtil.codeTranslate(LoopTypeEnum, $nzI18n, item.loopType, LanguageEnum.facility);
      }
    });
  }
}
