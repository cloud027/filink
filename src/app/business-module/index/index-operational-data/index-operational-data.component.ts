import {AfterContentInit, Component, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {FacilityName} from '../util/facility-name';
import {NzI18nService} from 'ng-zorro-antd';
import {indexOperationalLeftPanel} from '../shared/const/index-const';
import {SessionUtil} from '../../../shared-module/util/session-util';
import {ViewEnum} from '../../../core-module/enum/index/index.enum';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {SelectPolymerizationService} from '../../../shared-module/service/index/selectPolymerizationService';

/**
 * 运维数据卡片
 */
@Component({
  selector: 'app-index-operational-data',
  templateUrl: './index-operational-data.component.html',
  styleUrls: ['./index-operational-data.component.scss']
})
export class IndexOperationalDataComponent extends FacilityName implements OnInit, AfterContentInit, OnChanges {
  // 视图类型
  @Input() viewIndex: string;
  // 聚合类型
  @Input() polymerizationChange: string;
  // 视图枚举
  public viewEnum;
  // 首页左侧面板常量
  public indexLeftPanel = indexOperationalLeftPanel;
  // 是否显示设施设备列表选项
  public isShowFacilityList = false;
  // 是否显示项目列表选项
  public isProjectFacilitiesList = false;
  // 是否显示规划列表选项
  public isShowPlanningList = false;
  // 是否展开设施设备
  public isExpandFacilityList = false;
  // 是否展开项目
  public isProjectFacilities = false;
  // 是否展开规划
  public isPlanning = false;
  // 是否展开我的关注
  public isExpandMyCollection = false;
  // 是否展开工单
  public isExpandWorkOrder = false;
  // 工单权限
  public roleWorkOrder: boolean = false;
  // 订阅流关闭
  private destroy$ = new Subject<void>();

  constructor(public $nzI18n: NzI18nService,
              private $selectPolymerizationService: SelectPolymerizationService,
  ) {
    super($nzI18n);
  }

  public ngOnInit(): void {
    this.viewEnum = ViewEnum;
  }

  public ngAfterContentInit(): void {
    this.roleWorkOrder = SessionUtil.checkHasRole('06');
    this.$selectPolymerizationService.eventEmit.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value) {
        this.isExpandFacilityList = false;
        this.isExpandMyCollection = false;
        this.isExpandWorkOrder = false;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.viewIndex === 'maintenanceView') {
      this.isShowFacilityList = true;
      this.isProjectFacilitiesList = false;
      this.isShowPlanningList = false;
    } else if (this.viewIndex === 'projectView') {
      this.isShowFacilityList = false;
      this.isProjectFacilitiesList = true;
      this.isShowPlanningList = false;
    } else if (this.viewIndex === 'planView') {
      this.isShowFacilityList = false;
      this.isProjectFacilitiesList = false;
      this.isShowPlanningList = true;
    }
  }

  /**
   * 左侧面板切换
   */
  public tabClick(index): void {
    switch (index) {
      case indexOperationalLeftPanel.facilitiesList:
        if (this.isExpandFacilityList) {
          this.isExpandFacilityList = false;
        } else {
          this.isExpandFacilityList = true;
          this.isExpandMyCollection = false;
          this.isExpandWorkOrder = false;
          this.isPlanning = false;
          this.isProjectFacilities = false;
        }
        break;
      case indexOperationalLeftPanel.myCollection:
        if (this.isExpandMyCollection) {
          this.isExpandMyCollection = false;
        } else {
          this.isExpandMyCollection = true;
          this.isExpandFacilityList = false;
          this.isExpandWorkOrder = false;
          this.isPlanning = false;
          this.isProjectFacilities = false;
        }
        break;
      case indexOperationalLeftPanel.workOrderList:
        if (this.isExpandWorkOrder) {
          this.isExpandWorkOrder = false;
        } else {
          this.isExpandWorkOrder = true;
          this.isExpandMyCollection = false;
          this.isExpandFacilityList = false;
          this.isPlanning = false;
          this.isProjectFacilities = false;
        }
        break;
      case indexOperationalLeftPanel.projectFacilities:
        if (this.isProjectFacilities) {
          this.isProjectFacilities = false;
        } else {
          this.isProjectFacilities = true;
          this.isExpandMyCollection = false;
          this.isExpandFacilityList = false;
          this.isExpandWorkOrder = false;
          this.isPlanning = false;
        }
        break;
      case indexOperationalLeftPanel.planning:
        if (this.isPlanning) {
          this.isPlanning = false;
        } else {
          this.isPlanning = true;
          this.isExpandWorkOrder = false;
          this.isExpandMyCollection = false;
          this.isExpandFacilityList = false;
          this.isProjectFacilities = true;
        }
        break;
    }
  }


}
