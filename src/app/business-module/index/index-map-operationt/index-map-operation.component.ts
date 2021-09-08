import {Component, Input, OnInit} from '@angular/core';
import {OperationService} from '../../../shared-module/service/index/operation.service';
import {ViewEnum} from '../../../core-module/enum/index/index.enum';
import {MapTypeEnum} from '../../../shared-module/enum/filinkMap.enum';

@Component({
  selector: 'app-index-map-operation',
  templateUrl: './index-map-operation.component.html',
  styleUrls: ['./index-map-operation.component.scss']
})
export class IndexMapOperationComponent implements OnInit {
  // 分组权限
  @Input() roleSelect: boolean;
  // 视图类型
  @Input() viewIndex: string;

  // 设施/设备图层
  @Input() indexType: string;

  // 运维视图
  public maintenanceView = ViewEnum.maintenanceView;
  public mapTypeEnum = MapTypeEnum;

  constructor(
    public $OperationService: OperationService,
  ) {
  }

  public ngOnInit(): void {
  }

  public facilityLayeredChange(): void {
    this.$OperationService.eventEmit.emit({polymerization: false, selectGroup: false, addCoordinates: false});
  }

  public PolymerizationChange(): void {
    this.$OperationService.eventEmit.emit({facility: false, selectGroup: false, addCoordinates: false});
  }

  public selectGroupChange(): void {
    this.$OperationService.eventEmit.emit({facility: false, polymerization: false, addCoordinates: false});
  }

  public adjustCoordinatesChange(): void {
    this.$OperationService.eventEmit.emit({facility: false, polymerization: false, selectGroup: false});
  }
}
