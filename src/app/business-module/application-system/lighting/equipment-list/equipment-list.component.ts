import {Component, Input, OnInit} from '@angular/core';
import {ApplicationInterface} from '../../../../../assets/i18n/application/application.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {ApplicationFinalConst} from '../../share/const/application-system.const';
import {ListTypeEnum} from '../../share/enum/list-type.enum';
import {LightGroupTableEnum, LightLoopTableEnum, LightTableEnum} from '../../share/enum/auth.code.enum';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {SelectTableEquipmentChangeService} from '../../share/service/select-table-equipment-change.service';
import {EquipmentListModel} from '../../../../core-module/model/equipment/equipment-list.model';

@Component({
  selector: 'app-equipment-list',
  templateUrl: './equipment-list.component.html',
  styleUrls: ['./equipment-list.component.scss']
})
export class EquipmentListComponent implements OnInit {
  // 设备列表权限code码 ，默认为智慧照明设备列表权限码
  @Input() equipmentAuthCode: string = LightTableEnum.VIEW_EQUIPMENTSList;
  // 分组列表权限code码,默认为智慧照明分组列表权限码
  @Input() groupAuthCode: string = LightGroupTableEnum.VIEW_GROUPList;
  // 智慧照明回路列表权限code码
  public loopAuthCode: string = LightLoopTableEnum.VIEW_LOOPLIST;
  // 显示分组
  @Input() groupType: string = '';
  // 框选的设施id集合
  public filterValueMap: string[] = [];
  // 列表枚举 设备列表/分组列表/回路列表
  public listTypeEnum = ListTypeEnum;
  // 当前列表类型 设备列表/ 回路列表/ 分组列表
  public listType = ListTypeEnum.equipmentList;
  // 区分三个平台的常量
  public applicationFinal = ApplicationFinalConst;
  // 应用系统语言包
  public languageTable: ApplicationInterface;
  // 是否显示地图下表格
  public isShowTable: boolean = true;
  // 回路地图数据
  public loopData;
  // 是否有设备列表或者分组列表地图权限
  public hasEquipmentMapAuth: boolean;
  // 设备列表勾选设备数据集合
  public selectEquipmentData: EquipmentListModel[] = [];
  // 分组列表勾选分组id集合
  public selectGroupData: string[] = [];
  // 高亮数据是否是列表勾选操作 ，true为列表勾选来源的高亮，false为框选地图来源的高亮
  public isFromTable: boolean = true;
  // 是否有回路列表地图权限
  public isAuthLoop: boolean;
  // 是否有设备列表地图权限
  public isAuthEquipment: boolean;
  // 是否有分组列表地图权限
  public isAuthGroup: boolean;
  constructor(
    // 多语言配置
    public $nzI18n: NzI18nService,
    // 列表勾选数据变化监听服务
    private $selectTableEquipmentChangeService: SelectTableEquipmentChangeService
  ) {
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
  }

  ngOnInit() {
    // 根据权限码渲染对应列表页
    this.getListByAuthCode();
    this.isAuthLoop = this.checkHasRole(this.loopAuthCode);
    this.isAuthEquipment = this.checkHasRole(this.equipmentAuthCode);
    this.isAuthGroup = this.checkHasRole(this.groupAuthCode);
  }

  /**
   * 根据权限码判断有哪些列表访问权限
   */
  public getListByAuthCode(): void {
    // 是否有设备列表查询权限
    const hasEquipmentAuthCode = this.checkHasRole(this.equipmentAuthCode);
    // 是否有分组列表查询权限
    const hasGroupAuthCode = this.checkHasRole(this.groupAuthCode);
    if (hasEquipmentAuthCode) {
      // 判断是否有设备列表查询权限
      this.listType = ListTypeEnum.equipmentList;
      this.hasEquipmentMapAuth = true;
    } else if (!hasEquipmentAuthCode && hasGroupAuthCode) {
      //   无设备列表查询权限， 有分组列表查询权限
      this.listType = ListTypeEnum.groupList;
      this.hasEquipmentMapAuth = true;
    } else {
      this.hasEquipmentMapAuth = false;
      this.listType = ListTypeEnum.loopList;
    }
  }
  /**
   * tab切换
   * @param type tab列表类型
   */
  public listTypeChange(type: ListTypeEnum): void {
    this.listType = type;
    // 切换tab时列表勾选数据联动地图
    if (type === ListTypeEnum.equipmentList && this.selectEquipmentData.length > 0) {
      this.$selectTableEquipmentChangeService.eventEmit.emit({type: 'equipment', equipmentData: this.selectEquipmentData , isFromTable: this.isFromTable});
    } else if (type === ListTypeEnum.groupList && this.selectGroupData.length > 0) {
      this.$selectTableEquipmentChangeService.eventEmit.emit({type: 'groupId', groupIds: this.selectGroupData, isFromTable: this.isFromTable});
    }
  }
  /**
   * 判断是否有权限操作或访问
   */
  public checkHasRole(code: string): boolean {
    return SessionUtil.checkHasRole(code);
  }

  /**
   * 地图框选的设施集合
   * @param event 设施数据
   */
  public queryConditionChange(event): void {
    // 地图组件传过来的设施ids
    this.filterValueMap = event;
  }

  /**
   *  回路列表勾选回调事件
   * @param $event 回路
   */
  public loopEvent($event): void {
      this.loopData = $event;
  }

  /**
   * 地图下列表是否展示
   */
  public onShowTable(event: boolean): void {
    this.isShowTable = event;
  }

  public emptySelectChange(e: boolean): void {
    if (e) {
      this.selectGroupData = [];
      this.selectEquipmentData = [];
      this.isFromTable = false;
    }
  }
  /**
   * 列表设备选中事件
   * @param e 选中设备
   */
  public onSelectEquipment(e: EquipmentListModel[]) {
    this.selectEquipmentData = e;
    this.isFromTable = true;
  }

  /**
   * 列表选中分组事件
   * @param e 选中的分组
   */
  public onSelectGroup(e) {
    if (e && e.length > 0) {
      e.forEach(item => {
        this.selectGroupData.push(item.groupId);
      });
    } else {
      this.selectGroupData = [];
    }
    this.isFromTable = true;
  }
}
