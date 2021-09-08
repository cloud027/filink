import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {LanguageEnum} from '../../../enum/language.enum';
import {NzI18nService} from 'ng-zorro-antd';
import {ResultModel} from '../../../model/result.model';
import {ResultCodeEnum} from '../../../enum/result-code.enum';
import {EquipmentApiService} from '../../../../business-module/facility/share/service/equipment/equipment-api.service';
import {LoopViewDetailModel} from '../../../../core-module/model/loop/loop-view-detail.model';
import {FiLinkModalService} from '../../../service/filink-modal/filink-modal.service';
import {LoopSingleControlNumberModel} from '../../../../core-module/model/loop/loop-single-control-number.model';
import {LoopCableInfoModel} from '../../../../core-module/model/loop/loop-cable-info.model';

/**
 * 线缆设置页面
 */
@Component({
  selector: 'app-cable-setting',
  templateUrl: './cable-setting.component.html',
  styleUrls: ['./cable-setting.component.scss']
})
export class CableSettingComponent implements OnInit, OnChanges {
  // 入参设备id
  @Input() public centerControlId: string;
  @Input() public cableSettingConfigInfo: any;
  @Output() public handleOkEvent: EventEmitter<any> = new EventEmitter<any>();
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 回路信息(下拉框数据)
  public loopInfo: any = [];
  // 线缆数量设置
  public cableValue: number;
  // 是否显示线缆设置详情
  public isShowCableDetail: boolean = false;
  // 显示线缆序号
  public cableNumber: number = 0;
  // 线缆序号数组
  public cableNumberList: { cableNumber: number, value: any, pid: any }[] = [];
  // 页面冒号常量
  public colon: string = ':';
  // 配置下发
  private cableLoopInstructInfo: any;
  // 判断线缆和回路是否存在绑定关系
  private isRelate: boolean = false;

  constructor(
    private $nzI18n: NzI18nService,
    private $equipmentAipService: EquipmentApiService,
    private $message: FiLinkModalService
  ) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.handleOkEvent.emit((onCloseModal) => {
      // 将线缆编号和选中回路信息进行拼接
      const saveInfo = this.cableNumberList.map(item => {
        const {cableNumber, pid} = item;
        const saveLoopInfo = this.loopInfo.find(loopInfo => loopInfo.loopId === item.value.selectLoopId);
        return Object.assign({cableNumber, pid}, saveLoopInfo);
      });
      if (this.isRelate) {
        const cableParam = saveInfo.map(item => {
          return {
            loopTotal: item.singleTotal,
            loopCode: item.loopCode,
            loopId: item.loopId,
            cableCode: item.cableNumber,
            pid: item.pid,
          };
        });
        this.cableLoopInstructInfo = {
          commandId: 'CABLE_SETTING',
          equipmentIds: [this.centerControlId],
          param: {
            cableParam: cableParam,
            cableNum: this.cableValue,
          },
        };
        this.$equipmentAipService.instructDistribute(this.cableLoopInstructInfo).subscribe((result: ResultModel<any>) => {
          if (result.code === ResultCodeEnum.success) {
            this.$message.success(this.language.commandIssuedSuccessfully);
          } else {
            this.$message.error(result.msg);
          }
        });
        onCloseModal();
      } else {
        this.$message.info(this.language.relationshipNotBound);
      }
    });
  }

  /**
   * 监听输入值变化
   */
  public ngOnChanges(changes: SimpleChanges): void {
    // 设置前的线缆数量回显
    if (changes.cableSettingConfigInfo && changes.cableSettingConfigInfo.currentValue) {
      this.isShowCableDetail = true;
      if (this.cableSettingConfigInfo.cableSetting && this.cableSettingConfigInfo.cableSetting.cableNum) {
        this.cableValue = this.cableSettingConfigInfo.cableSetting.cableNum;
      }
      this.cableNumSetting();
    }
  }

  /**
   * 线缆数量设置
   */
  public cableNumSetting(): void {
    if (this.cableValue > 16 || this.cableValue < 1) {
      this.$message.error(this.language.inputValidNumber);
      return;
    }
    this.isShowCableDetail = true;
    this.cableNumberList = [];
    this.cableNumber = 0;
    for (let i = 0; i < this.cableValue; i++) {
      this.cableNumber++;
      this.cableNumberList.push({cableNumber: this.cableNumber, value: {selectLoopId: ''}, pid: ''});
    }
    // 根据集控id查询回路信息
    this.queryLoopInfoByCentralizedId(this.centerControlId);
  }

  /**
   * 控制回路下拉框数据变化
   */
  public loopIdChange(event): void {
  }

  /**
   * 根据集控id查询回路信息
   */
  public queryLoopInfoByCentralizedId(id: string): void {
    this.loopInfo = [];
    // 先查询回路信息（下拉框可选数据）
    this.$equipmentAipService.queryLoopInfoByCentralizedId(id).subscribe((result: ResultModel<LoopViewDetailModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        // 获取单控总数
        this.queryLoopSingleNumByCenterId(id).then((data: LoopSingleControlNumberModel[]) => {
          // 查询回路和线缆的绑定关系
          this.queryLoopCableInfo(id).then((loopCableInfos: LoopCableInfoModel[]) => {
            // 回显选中的线缆数，没有说明是新增则不做处理
            if (loopCableInfos && loopCableInfos.length) {
              loopCableInfos.forEach(cable => {
                this.cableNumberList.forEach(item => {
                  // 对比线缆编号 将选中的回路id 赋值到cableNumberList中进行回显并获取对应线缆的pid
                  if (item.cableNumber === Number(cable.cableNum)) {
                    item.value.selectLoopId = cable.loopId;
                    item.pid = cable.pid;
                  }
                });
              });
            }
            if (data.length) {
              this.isRelate = true;
            }
            this.loopInfo = result.data.map((item, index) => {
              // 如果存在单灯总数数据，把singleTotal 赋值到loopInfo中
              const singleTotalNum = data.find(__item => item.loopId === __item.loopId) || {singleTotal: ''};
              const {loopId, loopName, loopCode} = item;
              const {singleTotal} = singleTotalNum;
              return {singleTotal, loopCode, loopId, loopName, cableCode: String(index + 1)};
            });
          });
        });
      }
    });
  }

  /**
   * 根据集控id 获取回路下的单控总数
   */
  public queryLoopSingleNumByCenterId(id: string): Promise<LoopSingleControlNumberModel[]> {
    return new Promise((resolve, reject) => {
      this.$equipmentAipService.queryLoopSingleNumByCenterId(id).subscribe((result: ResultModel<LoopSingleControlNumberModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          resolve(result.data);
        } else {
          reject();
        }
      });
    });
  }

  /**
   * 查询回路和线缆的绑定关系
   */
  public queryLoopCableInfo(id: string): Promise<LoopCableInfoModel[]> {
    return new Promise((resolve, reject) => {
      this.$equipmentAipService.queryLoopCableInfo(id).subscribe((result: ResultModel<LoopCableInfoModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          resolve(result.data);
        }
      });
    });
  }
}
