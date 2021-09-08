import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {NzI18nService} from 'ng-zorro-antd';
import {EquipmentApiService} from '../../../../business-module/facility/share/service/equipment/equipment-api.service';
import {FiLinkModalService} from '../../../service/filink-modal/filink-modal.service';
import {LanguageEnum} from '../../../enum/language.enum';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {InstructSendRequestModel} from '../../../../core-module/model/group/instruct-send-request.model';
import {ResultModel} from '../../../model/result.model';
import {ResultCodeEnum} from '../../../enum/result-code.enum';
import {EquipmentConfigCommonComponent} from '../equipment-config-common/equipment-config-common.component';
import {ConfigResponseContentModel, ConfigurationList} from '../../../../core-module/model/equipment/config-response-content.model';
import {ConfigDetailRequestModel} from '../../../../core-module/model/equipment/config-detail-request.model';
import {ControlInstructEnum} from '../../../../core-module/enum/instruct/control-instruct.enum';
import {ApplicationSystemForCommonService} from '../../../../core-module/api-service/application-system';
import {EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {LockService} from '../../../../core-module/api-service/lock';
import {CheckEquipmentParamModel} from '../../../../core-module/model/application-system/check-equipment-param.model';

@Component({
  selector: 'app-equipment-config',
  templateUrl: './equipment-config.component.html',
  styleUrls: ['./equipment-config.component.scss']
})
export class EquipmentConfigComponent implements OnInit {
  // 弹框标题
  @Input() title: string;
  // 设备配置详情参数
  @Input() public configValueParam: ConfigDetailRequestModel = new ConfigDetailRequestModel;
  // 设备配置项内容
  @Input() public equipmentConfigContent: ConfigResponseContentModel[] = [];
  // 设备所属网关id
  @Input() public centerControlId: string;
  // 设备所属网关id
  @Input() public deviceConfiguration: boolean = false;
  // 弹框是否开启触发事件
  @Output() xcVisibleChange = new EventEmitter<boolean>();
  //  设备配置模板
  @ViewChild('equipmentConfigTemp') public equipmentConfigTemp: EquipmentConfigCommonComponent;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 弹框是否开启
  public isXcVisible: boolean = false;
  // 设备配置提交是否可以操作
  public configOkDisabled: boolean[] = [true, true];
  // 初始表单默认不能提交
  public disabled: boolean = true;
  // 设备配置表单组合数据集合
  public equipmentConfigValue: ConfigResponseContentModel[] = [];
  // 当前表单序号,默认初始表单
  public currentIndex: number = 0;
  public subOkEventFunc: any;
  public showOkButton: boolean = true;

  constructor(
    private $nzI18n: NzI18nService,
    private $equipmentAipService: EquipmentApiService,
    private $lockAipService: LockService,
    private $applicationCommonService: ApplicationSystemForCommonService,
    private $message: FiLinkModalService,
  ) {
  }

  // 弹框是否开启
  get xcVisible() {
    return this.isXcVisible;
  }

  // 弹框是否开启
  @Input()
  set xcVisible(params) {
    this.isXcVisible = params;
    this.xcVisibleChange.emit(this.isXcVisible);
  }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    if (!this.title) {
      this.title = this.language.deviceConfiguration;
    }
  }

  public subOkEvent(event): void {
    this.subOkEventFunc = event;
  }

  /**
   * 确定
   */
  public handleOk(currentIndex: number): void {
    // 如果子组中有传确认事件回来,先执行子组件的
    if (this.equipmentConfigValue[currentIndex].tabId === 'cableSetting' && this.subOkEventFunc) {
      this.subOkEventFunc(this.onCloseModal);
      return;
    }
    let commandId, configurationList;
    try {
      commandId = this.equipmentConfigValue[currentIndex].configurationsList[0].configurationList[0].commandId;
      configurationList = this.equipmentConfigValue[currentIndex].configurationsList[0].configurationList;
    } catch (e) {
      console.log(e);
    }
    if (!commandId) {
      this.onCloseModal();
      return;
    }
    this.saveEquipmentConfig(configurationList, commandId);
  }

  /**
   * 取消关闭
   */
  public onCloseModal(): void {
    this.xcVisible = false;
    this.xcVisibleChange.emit(this.xcVisible);
  }

  /**
   * 获取设备配置按钮状态
   */
  public getConfigButtonStatus(event: boolean[]): void {
    this.configOkDisabled = event;
  }

  /**
   *  获取设备配置表单输入值
   */
  public getConfigFormValue(event: ConfigResponseContentModel[]): void {
    this.equipmentConfigValue = event;
  }

  /**
   *  获取当前标签页
   */
  public getCurrentTabIndex(event: number): void {
    this.currentIndex = event;
    if (this.equipmentConfigContent[event].tabId === 'cableSetting') {
      this.showOkButton = true;
    } else {
      this.showOkButton = this.equipmentConfigContent[event]['type'] !== 'component';
    }

  }

  /**
   * 保存设备配配置
   * contentType具有多样性
   */
  private saveEquipmentConfig(contentType: ConfigurationList[], commandId: ControlInstructEnum): void {
    let formBody = {};
    const equipmentId = [];
    contentType.forEach(item => {
      /*const formInstance = item.formInstance.instance as FormOperate;*/
      const formInstance = item.formInstance.instance;
      formBody = Object.assign(formBody, formInstance.group.getRawValue());
    });
    // 校验
    this.checkEquipModel(formBody);
    equipmentId.push(this.configValueParam.equipmentId);
    const formParam = new InstructSendRequestModel<{}>(commandId, equipmentId, formBody);
    let response: Observable<Object>;
    if (this.configValueParam.equipmentType === EquipmentTypeEnum.intelligentEntranceGuardLock) {
      response = this.$lockAipService.instructDistribute(formParam as any);
    } else {
      response = this.$applicationCommonService.instructDistribute(formParam);
    }

    response.subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        // 关闭设备配置弹框
        this.xcVisible = false;
        this.xcVisibleChange.emit(this.xcVisible);
        this.$message.success(this.language.commandIssuedSuccessfully);
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 保存时校验设备模式
   */
  private checkEquipModel(formBody): void {
    if (this.equipmentConfigValue[this.currentIndex] && this.equipmentConfigValue[this.currentIndex].tabId &&
      this.equipmentConfigValue[this.currentIndex].tabId === 'centerBasic') {
      const data = new CheckEquipmentParamModel();
      data.equipmentId = this.centerControlId;
      data.mode = formBody.concentratorState;
      this.$applicationCommonService.checkEquipmentModel(data).subscribe((result: ResultModel<string>) => {
        if (result.code !== ResultCodeEnum.success) {
          this.$message.error(result.msg);
        }
      });
    }
  }

}
