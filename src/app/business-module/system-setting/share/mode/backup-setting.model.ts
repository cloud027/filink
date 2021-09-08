import {BackupCycleUnitEnum, BackupEnableEnum, BackupLocationEnum} from '../enum/system-setting.enum';

/**
 * 备份设置模型
 */
export class BackupSettingModel {
  /**
   * 启用备份
   */
  enableBackup: BackupEnableEnum;
  /**
   * 备份周期  输入框是string类型，后台定义的是number类型
   */
  backupCycle: string | number;
  /**
   * 备份周期单位
   */
  cycleUnit: BackupCycleUnitEnum;
  /**
   * 备份时间点
   */
  backupTime: number | Date;
  /**
   * 备份位置
   */
  backupLocation: BackupLocationEnum;
  /**
   * 备份数据存储地址
   */
  backupAddr: string;
}
