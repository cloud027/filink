import {NzI18nService} from 'ng-zorro-antd';
import {CommonUtil} from '../../shared-module/util/common-util';

export enum JumpType {
  // 跳纤
  FiberJumper = '0',
  // 分光器
  Splitter = '1'
}

export function getJumpType(i18n: NzI18nService, prefix, code = null, ) {
  return CommonUtil.codeTranslate(JumpType, i18n, code, prefix);
}
