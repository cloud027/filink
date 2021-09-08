import {StatusEnum} from '../enum/system-setting.enum';

export class UpdateRangeStatusModel {
  // 范围ID
  rangeIds: Array<string>;
  // 范围状态
  rangeStatus: StatusEnum;
}
