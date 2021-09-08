import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as _ from 'lodash';
import {PassagewayModel} from '../../../share/model/passageway.model';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {FilterCondition, QueryConditionModel} from '../../../../../shared-module/model/query-condition.model';
import {ApplicationService} from '../../../share/service/application.service';
import {InstructConfig} from '../../../share/config/instruct.config';
import {ActivatedRoute} from '@angular/router';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {NzI18nService} from 'ng-zorro-antd';
import {ApplicationInterface} from '../../../../../../assets/i18n/application/application.interface';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {PolicyEnum, SwitchStatus} from '../../../share/enum/policy.enum';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {CameraCodeEnum} from '../../../share/enum/camera-permission.enum';

@Component({
  selector: 'app-security-equipment-list-details',
  templateUrl: './security-equipment-list-details.component.html',
  styleUrls: ['./security-equipment-list-details.component.scss']
})
export class SecurityEquipmentListDetailsComponent implements OnInit, OnDestroy {

  /**
   * 分屏组件值
   */
  @ViewChild('splitScreen') splitScreen;
  /**
   * 需要播放的通道列表
   */
  public passagewayList: PassagewayModel[] = [];
  /**
   * 设备id
   */
  public equipmentId: string = '';
  public equipmentModel: string = '';
  public operationList = [];
  /**
   * 安防设备详情的样式
   */
  public securityClass: boolean = true;
  /**
   * 通过操作按钮详情接口数据判断是否显示摄像头
   */
  public isOperationSecurity: boolean = true;
  /**
   *是否显示自定义的组件
   */
  public isShow: boolean = true;
  // 设备列表多语言
  public languageTable: ApplicationInterface;
  /**
   * 通道列表查询条件
   */
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  /**
   * 权限枚举
   */
  public cameraCodeEnum = CameraCodeEnum;

  constructor(
    // 提示
    private $message: FiLinkModalService,
    // 多语言配置
    private $nzI18n: NzI18nService,
    // 路由传参
    private $activatedRoute: ActivatedRoute,
    // 应用系统服务
    private $applicationService: ApplicationService,
  ) {
    // 多语言
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.$activatedRoute.queryParams.subscribe(queryParams => {
      this.equipmentId = queryParams.equipmentId;
      this.equipmentModel = queryParams.equipmentModel;
    });
    this.getOperation();
    this.getSecurityPassagewayList();
  }

  /**
   * 页面销毁
   */
  public ngOnDestroy(): void {
    this.splitScreen = null;
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
        if (res.data.operations && res.data.operations.length) {
          if (res.data && res.data.operations.length) {
            this.operationList = res.data.operations;
            const isShow = res.data.operations.find(item => item.id === 'CAMERA_OPERATE');
            this.isOperationSecurity = isShow;
            console.log(this.isOperationSecurity);
          }
        }
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 提示
   */
  public handleElectric(): void {
    this.$message.error(this.languageTable.equipmentTable.supported);
  }

  /**
   * 初始化获取通道列表
   */
  private getSecurityPassagewayList(): void {
    const equipmentId = new FilterCondition(PolicyEnum.equipmentId, OperatorEnum.eq, this.equipmentId);
    this.queryCondition.filterConditions.push(equipmentId);
    this.$applicationService.getSecurityPassagewayList(this.queryCondition)
      .subscribe((result: ResultModel<PassagewayModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          if (!_.isEmpty(result.data)) {
            this.passagewayList = result.data.filter(item => item.status === SwitchStatus.on);
          } else {
            this.passagewayList = result.data;
          }
          if (!result.data.length) {
            this.securityClass = false;
          }
        } else {
          this.securityClass = false;
          this.$message.error(result.msg);
        }
      });
  }

  /**
   * 设备操作按钮
   * @ param data
   */
  public handleEquipmentOperation(data): void {
    const params = {
      commandId: data.id,
      equipmentIds: [this.equipmentId],
      param: {}
    };
    const instructConfig = new InstructConfig(this.$applicationService, this.$nzI18n, this.$message);
    instructConfig.instructDistribute(params);
  }
}
