import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationService } from '../../../share/service/application.service';
import { FiLinkModalService } from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import { ApplicationInterface } from '../../../../../../assets/i18n/application/application.interface';
import { NzI18nService } from 'ng-zorro-antd';
import { LanguageEnum } from '../../../../../shared-module/enum/language.enum';
import { InstructConfig } from '../../../share/config/instruct.config';
import { OnlineLanguageInterface } from '../../../../../../assets/i18n/online/online-language.interface';
import { SessionUtil } from '../../../../../shared-module/util/session-util';
import { ReleaseTableEnum } from '../../../share/enum/auth.code.enum';
import { ResultModel } from '../../../../../shared-module/model/result.model';
import { ResultCodeEnum } from '../../../../../shared-module/enum/result-code.enum';
import { MonitorConvenientEntranceModel } from '../../../share/model/monitor.model';
import { WorkOrDetailEnum } from '../../../share/enum/monitor-config.enum';
import { DistributeModel } from '../../../share/model/distribute.model';

@Component({
  selector: 'app-monitor-equipment-details',
  templateUrl: './monitor-equipment-details.component.html',
  styleUrls: ['./monitor-equipment-details.component.scss'],
})
export class MonitorEquipmentDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('programBroadcast') programBroadcast;
  // 设备id
  public equipmentId: string = '';
  public equipmentModel: string = '';
  public operationList = [];
  public sliderList = [];
  /** 上报信息  */
  public MonitorConvenientEntranceList: MonitorConvenientEntranceModel = new MonitorConvenientEntranceModel(
    {},
  );

  /** 详情页面枚举 */
  WorkOrDetailEnum = WorkOrDetailEnum;
  // 是否显示
  public isShow: boolean = true;
  // 多语言配置
  public language: OnlineLanguageInterface;
  // 节目名称
  public programName: string = '';
  // 应用系统详情显示
  public isShowApplication: boolean = true;
  // 设备列表多语言
  public languageTable: ApplicationInterface;
  public releaseTableEnum = ReleaseTableEnum;

  constructor(
    // 路由传参
    private $activatedRoute: ActivatedRoute,
    // 提示
    private $message: FiLinkModalService,
    // 多语言配置
    private $nzI18n: NzI18nService,
    // 接口服务
    private $applicationService: ApplicationService,
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.online);
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
  }

  public ngOnInit(): void {
    this.$activatedRoute.queryParams.subscribe((queryParams) => {
      this.equipmentId = queryParams.equipmentId;
      this.equipmentModel = queryParams.equipmentModel;

      // 获取上报信息的数据
      this.init_gainReportData();
    });
  }

  /**
   * 销毁
   */
  public ngOnDestroy(): void {
    this.programBroadcast = null;
  }

  /**
   * 设备操作按钮
   * @ param data
   */
  public handleEquipmentOperation(id: any, code?: string): void {
    if (code && !SessionUtil.checkHasRole(code)) {
      this.$message.warning('您暂无操作权限！');
      return;
    }
    const params: DistributeModel = {
      commandId: id,
      equipmentIds: [this.equipmentId],
      param: null,
    };
    const instructConfig = new InstructConfig(this.$applicationService, this.$nzI18n, this.$message);
    instructConfig.instructDistribute(params);
  }

  /**
   * 开，关，上电，下电
   * @ param data
   */
  public handleOperationEvent(data): void {
    this.operationList = data;
  }

  /** 获取上报信息的数据 */
  init_gainReportData() {
    const params = {
      idList: [this.equipmentId],
    };
    this.$applicationService
      .monitorQueryInfoData_API(params)
      .subscribe((result: ResultModel<any>) => {
        console.log(result, 'result');
        if (result.code === ResultCodeEnum.success) {
          if (result.data.length > 0) {
            this.MonitorConvenientEntranceList.initData(JSON.parse(result.data[0].performanceData));
          } else { this.MonitorConvenientEntranceList.initData({}); }
        } else {
          this.$message.error(result.msg);
        }
      });
  }
}
