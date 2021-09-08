import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class AlarmTurnTroubleService {
  // 控制故障tab展示
  public eventEmit: any;
  // 控制转故障是否可再次操作
  public troubleEmit: any;
  // 控制派单销障是否可操作
  public reloadClearBarrierEmit: any;
  // 控制销障tab展示
  public showClearBarrierEmit: any;
  // 传递工单数据
  public turnOrderEmit: any;
  constructor() {
    this.eventEmit = new EventEmitter();
    this.troubleEmit = new EventEmitter();
    this.reloadClearBarrierEmit = new EventEmitter();
    this.showClearBarrierEmit = new EventEmitter();
    this.turnOrderEmit = new EventEmitter();
  }
}
