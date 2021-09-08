import {Component, Input, OnInit} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {IndexApiService} from '../../service/index/index-api.service';
import {GetListDeviceTypeModel, ListDeviceTypeModel} from '../../shared/model/map-bubble.model';
import {FacilityEquipmentConfigModel} from '../../shared/model/facility-equipment-config.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {MapStoreService} from '../../../../core-module/store/map.store.service';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {deviceTabList} from '../../shared/const/index-const';
import {ExecuteInstructionsModel} from '../../shared/model/execute-instructions.model';
import {InstructSendParamModel} from '../../../../core-module/model/group/instruct-send-param.model';
import {ProgramListModel} from '../../../../core-module/model/group/program-list.model';
import {FilterCondition, QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {ProgramStatusEnum} from '../../../../core-module/enum/application-system/program-status-enum';
import {ControlInstructEnum} from '../../../../core-module/enum/instruct/control-instruct.enum';
import * as _ from 'lodash';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {DeviceTabListEnum} from '../../shared/enum/index-enum';
import {SetEquipmentDataModel} from '../../shared/model/log-operating.model';
import {indexCoverageType} from '../../../../core-module/const/index/index.const';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {SelectPolymerizationService} from '../../../../shared-module/service/index/selectPolymerizationService';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

/**
 * 设施设备列表组件
 */
@Component({
  selector: 'app-facilities-list',
  templateUrl: './facilities-list.component.html',
  styleUrls: ['./facilities-list.component.scss']
})
export class FacilitiesListComponent implements OnInit {
  // 聚合类型
  @Input() polymerizationChange: string;
  // 首页国际化
  public indexLanguage: IndexLanguageInterface;
  // 是否显示批量操作按钮
  public isVisible = false;
  // 批量操作设备类型
  public equipmentTypes: string[];
  // 区域数据
  public areaData: string[] = [indexCoverageType.noData];
  // 项目数据
  public projectData: string[] = [indexCoverageType.noData];
  // 设施选择结果
  public facilityData: string[] = [];
  // 设备选择结果
  public equipmentData: string[] = [];
  // 设施类型出参数据模型
  public facilityTypeList: ListDeviceTypeModel[] = [];
  // 设备类型出参数据模型
  public equipmentTypeList: SetEquipmentDataModel[] = [];
  // 分组数据
  public groupList: string[] = [];
  // 设施设备类型组件配置
  public facilityEquipmentComponent: FacilityEquipmentConfigModel;
  // 节目信息
  public program: ProgramListModel = new ProgramListModel();
  // 分组权限
  public groupListRole: boolean = false;
  // 左侧tabList可选数据
  public deviceTabList = deviceTabList;
  // 左侧tabList选中数据
  public deviceActive: string = DeviceTabListEnum.tabArea;
  // 左侧tabList数据枚举
  public deviceTabListEnum = DeviceTabListEnum;
  // 是否第一次点击
  public firstClick: boolean = true;
  // 勾选的设施或设备Id集合
  private selectAllDateList: string[];
  // 操作指令枚举
  private controlInstructEnum = ControlInstructEnum;
  // 节目名称
  private screenContent: string = '';
  // 订阅流关闭
  private destroy$ = new Subject<void>();
  public isProjectOrArea: boolean = true;

  constructor(
    private $nzI18n: NzI18nService,
    private $indexApiService: IndexApiService,
    private $mapStoreService: MapStoreService,
    private $message: FiLinkModalService,
    private $facilityForCommonService: FacilityForCommonService,
    private $selectPolymerizationService: SelectPolymerizationService,
  ) {
  }

  public ngOnInit(): void {
    // 国际化翻译
    this.indexLanguage = this.$nzI18n.getLocaleData(LanguageEnum.index);
    // 分组权限查询
    this.groupListRole = SessionUtil.checkHasRole('09-2-2-2');
    // 设备状态权限
    this.facilityEquipmentConfig();
    // 获取设施类型
    this.getFacilityType();
    // 获取设备类型
    this.getEquipmentType();
    // 聚合方式
    if (this.polymerizationChange === '2') {
      this.isProjectOrArea = false;
      this.deviceActive = 'project';
      this.deviceTabList = [
        {key: 'project', value: 'project'},
        {key: 'facilityTypeTitle', value: 'facilityTypeTitle'},
        {key: 'equipmentTypeTitle', value: 'equipmentTypeTitle'},
        {key: 'group', value: 'group'},
      ];
    } else {
      this.isProjectOrArea = true;
      this.deviceActive = DeviceTabListEnum.tabArea;
      this.deviceTabList = [
        {key: 'tabArea', value: 'tabArea'},
        {key: 'facilityTypeTitle', value: 'facilityTypeTitle'},
        {key: 'equipmentTypeTitle', value: 'equipmentTypeTitle'},
        {key: 'group', value: 'group'},
      ];
    }

    this.$selectPolymerizationService.eventEmit.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value && value.polymerizationValue === 'project') {
        this.isProjectOrArea = false;
        this.deviceActive = 'project';
        this.deviceTabList = [
          {key: 'project', value: 'project'},
          {key: 'facilityTypeTitle', value: 'facilityTypeTitle'},
          {key: 'equipmentTypeTitle', value: 'equipmentTypeTitle'},
          {key: 'group', value: 'group'},
        ];
      } else {
        this.isProjectOrArea = true;
        this.deviceActive = DeviceTabListEnum.tabArea;
        this.deviceTabList = [
          {key: 'tabArea', value: 'tabArea'},
          {key: 'facilityTypeTitle', value: 'facilityTypeTitle'},
          {key: 'equipmentTypeTitle', value: 'equipmentTypeTitle'},
          {key: 'group', value: 'group'},
        ];
      }
    });
  }

  /**
   * 区域选择结果
   * param evt
   */
  public areaDataChange(evt: string[]): void {
    this.areaData = evt;
  }

  /**
   * 项目选择结果
   * param evt
   */
  public projectDataChange(evt: string[]): void {
    this.projectData = evt;
  }

  /**
   * 设施选择器选择结果
   * param evt
   */
  public facilitiesSelect(evt: string[]): void {
    this.facilityData = evt;
  }

  /**
   * 设备选择器选择结果
   * param evt
   */
  public equipmentSelect(evt: string[]): void {
    this.equipmentData = evt;
  }

  /**
   * 分组数据
   * {string[]} evt
   */
  public selectGroupItem(evt: string[]): void {
    this.groupList = evt;
    this.$mapStoreService.logicGroupList = evt;
  }

  /**
   * 批量操作弹窗显示
   * param evt
   */
  public facilityEquipmentListEvent(evt: any): void {
    this.selectAllDateList = evt.data;
    this.equipmentTypes = _.uniq(evt.type);
    this.isVisible = evt.visible;
    if (evt.visible) {
      this.queryProgramList();
    }
  }

  /**
   * 批量操作事件回传
   */
  public visibleChange(evt: boolean): void {
    this.isVisible = evt;
  }

  /**
   * 公共操作开关、上下电状态
   */
  public commonSwitchValue(evt: ControlInstructEnum): void {
    const body = new ExecuteInstructionsModel<{}>(
      evt,
      this.selectAllDateList,
      {}
    );
    this.executeInstructions(body, true);
  }

  /**
   * 照明亮度变化
   */
  public lightChangeValue(evt: number): void {
    this.changeValue(evt);
  }

  /**
   * 信息屏幕亮度变化
   */
  public informationScreenChangeValue(evt: number): void {
    this.changeValue(evt);
  }

  /**
   * 信息屏幕音量变化
   */
  public screenVolumeChangeValue(evt: number): void {
    const body = new ExecuteInstructionsModel<{}>(
      this.controlInstructEnum.setVolume,
      this.selectAllDateList,
      {volumeNum: evt},
    );
    this.executeInstructions(body);
  }

  /**
   /**
   * 信息屏同步播放事件
   */
  public screenPlay(evt: [{ programId: string }]): void {
    const body = new ExecuteInstructionsModel<InstructSendParamModel[]>(
      this.controlInstructEnum.screenPlay,
      this.selectAllDateList,
      evt,
    );
    this.executeInstructions(body);
  }

  /**
   *左侧tabList改变
   */
  public tabChange(activeKey: string): void {
    this.deviceActive = activeKey;
    this.firstClick = false;
    if (activeKey === this.deviceTabListEnum.facilityTypeTitle) {
      this.facilityEquipmentComponent = {
        showFacilitiesComponent: true,
        showEquipmentComponent: false,
        showWorkOrderStatusComponent: false,
        showWorkOrderTypeComponent: false,
        facilityTitleName: this.indexLanguage.facilityTypeTitle,
        equipmentTitleName: this.indexLanguage.equipmentTypeTitle,
      };
    } else if (activeKey === this.deviceTabListEnum.equipmentTypeTitle) {
      this.facilityEquipmentComponent = {
        showFacilitiesComponent: false,
        showEquipmentComponent: true,
        showWorkOrderStatusComponent: false,
        showWorkOrderTypeComponent: false,
        facilityTitleName: this.indexLanguage.facilityTypeTitle,
        equipmentTitleName: this.indexLanguage.equipmentTypeTitle,
      };
    }
  }

  /**
   * 设施设备选择器配置
   */
  private facilityEquipmentConfig(): void {
    this.facilityEquipmentComponent = {
      showFacilitiesComponent: true,
      showEquipmentComponent: false,
      showWorkOrderStatusComponent: false,
      showWorkOrderTypeComponent: false,
      facilityTitleName: this.indexLanguage.facilityTypeTitle,
      equipmentTitleName: this.indexLanguage.equipmentTypeTitle,
    };
  }

  /**
   * 设施类型数据加载
   */
  private getFacilityType(): void {
    if (this.areaData) {
      const body = new GetListDeviceTypeModel();
      body.areaCodeList = this.areaData;
      // 给数据添加一个选中状态存入缓存
      const newList = [];
      FacilityForCommonUtil.getRoleFacility(this.$nzI18n).forEach(item => {
        newList.push(
          {
            checked: true,
            deviceType: item.code
          }
        );
      });
      this.$mapStoreService.logicFacilityList = newList.map((item) => {
        item.checked = true;
        return item;
      });
      this.$mapStoreService.isInitLogicFacilityData = true;
      this.facilityTypeList = newList;
    }
  }

  /**
   * 设备类型数据加载
   */
  private getEquipmentType(): void {
    if (this.areaData) {
      const body = new GetListDeviceTypeModel();
      body.areaCodeList = this.areaData;
      const newList = [];
      FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n).forEach(item => {
        newList.push(
          {
            checked: true,
            equipmentType: item.code
          }
        );
      });
      // 给数据添加一个选中状态存入缓存
      this.$mapStoreService.logicEquipmentList = newList.map((item) => {
        item.checked = true;
        return item;
      });
      this.equipmentTypeList = this.$mapStoreService.logicEquipmentList;
      this.$mapStoreService.isInitLogicEquipmentData = true;
    }
  }

  /**
   * 亮度变化
   * param evt
   */
  private changeValue(evt): void {
    const body = new ExecuteInstructionsModel<{}>(
      this.controlInstructEnum.dimming,
      this.selectAllDateList,
      {lightnessNum: evt}
    );
    this.executeInstructions(body, true);
  }

  /**
   * 执行指令下发
   * @checkMode 是否需要查询指令下发模式 默认false
   */
  private executeInstructions(body: ExecuteInstructionsModel<{}>, checkMode = false): void {
    if (!checkMode) {
      // 不需要查询指令下发模式，直接调接口
      this.$indexApiService.instructDistribute(body).subscribe((result: ResultModel<string>) => {
        if (result.code === ResultCodeEnum.success) {
          this.$message.success(this.indexLanguage.theInstructionIsIssuedSuccessfully);
        } else {
          this.$message.error(result.msg);
        }
      });
    } else {
      // 需查询指令下发模式，指令模式异常则弹出指令模式提示，影响指令结果下发
      this.checkEquipmentMode().then(resolve => {
        if (resolve.code === ResultCodeEnum.success) {
          this.$indexApiService.instructDistribute(body).subscribe((result: ResultModel<string>) => {
            if (result.code === ResultCodeEnum.success) {
              this.$message.success(this.indexLanguage.theInstructionIsIssuedSuccessfully);
            } else {
              this.$message.error(result.msg);
            }
          });
        } else {
          // 指令异常弹出指令模式提示,不再下发指令
          this.$message.error(resolve.msg);
        }
      });
    }
  }

  /**
   * 查询信息屏的节目信息
   */
  private queryProgramList(): void {
    const body = new QueryConditionModel();
    const filterBody = new FilterCondition('programStatus', OperatorEnum.eq, ProgramStatusEnum.enabled);
    body.filterConditions = body.filterConditions.concat([filterBody]);
    this.$indexApiService.queryProgramList(body).subscribe((result: ResultModel<ProgramListModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        // 获取第一条节目信息
        this.program = !_.isEmpty(result.data) ? result.data[0] : new ProgramListModel();
        this.screenContent = this.program.programName;
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 查询是手动控制还是自动
   */
  private checkEquipmentMode(): Promise<ResultModel<any>> {
    return new Promise((resolve, reject) => {
      this.$facilityForCommonService.checkEquipmentMode({equipmentIdList: this.selectAllDateList}).subscribe((res: ResultModel<any>) => {
        resolve(res);
      });
    });
  }
}
