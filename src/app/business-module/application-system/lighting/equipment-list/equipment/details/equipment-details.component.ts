import {Component, OnInit, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApplicationService} from '../../../../share/service/application.service';
import {FiLinkModalService} from '../../../../../../shared-module/service/filink-modal/filink-modal.service';
import {ApplicationInterface} from '../../../../../../../assets/i18n/application/application.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../../../shared-module/enum/language.enum';
import {InstructConfig} from '../../../../share/config/instruct.config';
import {ResultModel} from '../../../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../../../shared-module/enum/result-code.enum';
import {OperationsModel} from '../../../../share/model/table-details-operation.model';
import {ApplicationFinalConst} from '../../../../share/const/application-system.const';
import {BroadcastTableEnum, LightTableEnum, ReleaseTableEnum, SecurityEnum} from '../../../../share/enum/auth.code.enum';
import {EquipmentControlModel} from '../../../../share/model/equipment.model';
import {ControlInstructEnum} from '../../../../../../core-module/enum/instruct/control-instruct.enum';

/**
 *  设备详情组件
 */
@Component({
  selector: 'app-equipment-details',
  templateUrl: './equipment-details.component.html',
  styleUrls: ['./equipment-details.component.scss']
})
export class EquipmentDetailsComponent implements OnInit {
  @Input() isShow: boolean = false;
  @Input() securityClass: boolean = false;
  // 设备id
  public equipmentId: string = '';
  // 设备模型
  private equipmentModel: string = '';
  // 应用系统详情显示
  public isShowApplication: boolean = true;
  // 操作按钮集合
  public operationList: OperationsModel[];
  // 是否显示亮度
  public isBrightness: boolean = false;
  // 亮度值
  private lightNum: number = 0;
  // 设备列表多语言
  public languageTable: ApplicationInterface;

  constructor(
    // 路由传参
    private $activatedRoute: ActivatedRoute,
    // 接口服务
    private $applicationService: ApplicationService,
    // 提示
    private $message: FiLinkModalService,
    // 路由
    public $router: Router,
    // 多语言配置
    private $nzI18n: NzI18nService,
  ) {
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
  }

  public ngOnInit() {
    this.$activatedRoute.queryParams.subscribe(queryParams => {
      this.equipmentId = queryParams.equipmentId;
      this.equipmentModel = queryParams.equipmentModel;
    });
    this.getOperation();
  }

  /**
   * 设备操作按钮
   * @ param data
   */
  public handleEquipmentOperation(data: EquipmentControlModel): void {
    const params = {
      commandId: data.type,
      equipmentIds: [this.equipmentId],
      param: {}
    };
    if (data.convenientVal >= 0) {
      params.param[data.paramId] = Number(data.convenientVal);
    }
    const instructConfig = new InstructConfig(this.$applicationService, this.$nzI18n, this.$message);
    instructConfig.instructDistribute(params);
  }

  /**
   * 亮度和音量回写
   * @ param data
   */
  public handleEquipmentDetails(event): void {
    const statusData = event ? event.light || 0 : 0;
    this.sliderDefault(statusData);
  }

  /**
   * 滑块默认值赋值
   * @ param data
   */
  private sliderDefault(data: string): void {
    if (this.operationList && this.operationList.length) {
      this.operationList.forEach(item => {
        if (item.id === ControlInstructEnum.dimming) {
          item.value = data;
        }
      });
    }
  }

  /**
   * 改变滑块值
   * @ param event 滑块值
   */
  public handleSlider(event: number): void {
    this.lightNum = event;
  }

  /**
   * 设备控制里面的按钮集合
   */
  public getOperation(): void {
    const params = {
      equipmentId: this.equipmentId
    };
    this.$applicationService.getOperation(params).subscribe((res: ResultModel<any>) => {
      if (res.code === ResultCodeEnum.success) {
        this.operationList = res.data.operations;
        // app-button-control
        const url = this.$router.url;
        let permission;
        //  根据路由判断出是哪一个设备  然后给出枚举
        if (url.includes(ApplicationFinalConst.lighting)) {
          // 照明设备列表code码枚举
          permission = LightTableEnum;
        } else if (url.includes(ApplicationFinalConst.release)) {
          // 信息屏设备列表code码枚举
          permission = ReleaseTableEnum;
        } else if (url.includes(ApplicationFinalConst.broadcast)) {
          // 广播发布设备列表code码枚举
          permission = BroadcastTableEnum;
        } else {
          // 安防设备列表code码枚举
          permission = SecurityEnum;
        }
        // 将按钮给上相应的权限码
        this.operationList.forEach(item => {
          Object.keys(permission).forEach(_item => {
            if (item.id === _item) {
              item.code = permission[_item];
            }
          });
        });
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 亮度指令下发
   */
  public handleOk(): void {
    this.isBrightness = false;
    const params = {
      commandId: ControlInstructEnum.dimming,
      equipmentIds: [this.equipmentId],
      param: {
        lightnessNum: this.lightNum
      }
    };
    const instructConfig = new InstructConfig(this.$applicationService, this.$nzI18n, this.$message);
    instructConfig.instructDistribute(params);
  }

  /**
   * 关闭亮度弹框
   */
  public handleCancel(): void {
    this.isBrightness = false;
  }
}
