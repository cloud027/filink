/**
 * Created by wh1910108 on 2020/6/10.
 */
import {AlarmIsAutoCheckDisEnum, AlarmIsAutoDiagnoseEnum, AlarmIsAutoTurnMalEnum} from '../enum/alarm.enum';

export class DiagnosticModel {
  /**
   * 确诊阈值
   */
  public diagnosticThreshold: string;
  /**
   * 诊断id
   */
  public id: string;
  /**
   * 自动核实派单
   */
  public isAutoCheckDispatch: AlarmIsAutoCheckDisEnum;
  /**
   * 是否自动诊断
   */
  public isAutoDiagnose: AlarmIsAutoDiagnoseEnum;
  /**
   * 自动转故障
   */
  public isAutoTurnMalfunction: AlarmIsAutoTurnMalEnum;
  /**
   * 误判阈值
   */
  public misjudgementThreshold: string;
  /**
   * 名称id
   */
  public nameId: string;
}
