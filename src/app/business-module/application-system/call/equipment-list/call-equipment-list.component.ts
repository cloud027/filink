import {Component, OnInit} from '@angular/core';
import {ApplicationFinalConst} from '../../share/const/application-system.const';
import {ReleaseGroupTableEnum, ReleaseTableEnum} from '../../share/enum/auth.code.enum';
@Component({
  selector: 'app-call-equipment-list',
  templateUrl: './call-equipment-list.component.html',
  styleUrls: ['./call-equipment-list.component.scss']
})
export class CallEquipmentListComponent implements OnInit {
  // 区分三个平台的常量
  public applicationFinal = ApplicationFinalConst;
  // 信息发布设备列表权限码枚举
  public releaseTableEnum = ReleaseTableEnum;
  public releaseGroupTableEnum = ReleaseGroupTableEnum;
  constructor() {

  }

  /**
   * 初始化
   */
  public ngOnInit(): void {

  }
}
