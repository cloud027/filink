import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApplicationService} from '../../../share/service/application.service';
import {detailsFmt} from '../../../share/util/tool.util';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {BroadcastPolicyEnum} from '../../../share/enum/auth.code.enum';

import {ClassStatusConst, RouterJumpConst} from '../../../share/const/application-system.const';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {OnlineLanguageInterface} from '../../../../../../assets/i18n/online/online-language.interface';
import {ApplicationInterface} from '../../../../../../assets/i18n/application/application.interface';
import {EnableOrDisableModel, ProgramListModel, StrategyListModel, StrategyPlayPeriodRefListModel} from '../../../share/model/policy.control.model';
import {StrategyStatusEnum} from '../../../share/enum/policy.enum';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {OperationButtonEnum} from '../../../share/enum/operation-button.enum';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {CurrencyEnum} from '../../../../../core-module/enum/operator-enable-disable.enum';
import {getStrategyStatus} from '../../../share/util/application.util';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {SortCondition} from '../../../../../shared-module/model/query-condition.model';
import {TableSortConfig} from '../../../../../shared-module/enum/table-style-config.enum';
import * as _ from 'lodash';

@Component({
  selector: 'app-broadcast-details',
  templateUrl: './broadcast-details.component.html',
  styleUrls: ['./broadcast-details.component.scss']
})
export class BroadcastDetailsComponent implements OnInit, OnDestroy {
  // 区分是否是编辑
  @Input() isOperation: boolean = true;

  /** 前两步传入的值*/
  @Input() set stepsFirstParams(data: StrategyListModel) {
    if (data) {
      this.handNextSteps(data);
    }
  }

  // 策略id
  public strategyId: string = '';
  // 样式常量
  public classStatus = ClassStatusConst;
  // 枚举
  public strategyStatusEnum = StrategyStatusEnum;
  // 节目表格配置
  public programTable: TableConfigModel;
  // 设备管理国际化
  public facilityLanguage: FacilityLanguageInterface;
  // 多语言配置
  public language: OnlineLanguageInterface;
  // 设备列表多语言
  public languageTable: ApplicationInterface;
  /** 公共国际化*/
  public commonLanguage: CommonLanguageInterface;
  // 存储接口的数据
  public releaseData: StrategyListModel = new StrategyListModel();
  /**是否显示loading框*/
  public isLoading: boolean = false;
  /** 播放列表显示的数据*/
  public playProgramList: ProgramListModel[] = [];
  /** 信息屏策略权限枚举吗*/
  public broadcastPolicyEnum = BroadcastPolicyEnum;

  constructor(
    // 多语言配置
    public $nzI18n: NzI18nService,
    // 路由
    public $router: Router,
    // 接口服务
    public $applicationService: ApplicationService,
    private $modalService: NzModalService,
    // 错误提示框
    private $message: FiLinkModalService,
    // 路由传参
    private $activatedRoute: ActivatedRoute,
  ) {
    // 多语言
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.online);
    // 表格多语言配置
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.facilityLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
  }


  /**
   * 初始化
   */
  public ngOnInit(): void {

    this.initProgram();
    // 编辑操作才会调用接口
    if (this.isOperation) {
      this.initDetails();
    }
  }

  /**
   * 销毁
   */
  public ngOnDestroy(): void {
  }

  /**
   * 节目初始化
   */
  public initProgram(): void {
    this.programTable = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: false,
      showSizeChanger: true,
      scroll: {x: '900px', y: '200px'},
      noIndex: true,
      notShowPrint: true,
      noAutoHeight: true,
      columnConfig: [
        // 序号
        {
          type: 'serial-number', width: 62, title: this.commonLanguage.serialNumber
        },
        // 节目名称
        {
          title: this.languageTable.strategyList.programName, key: 'programName', width: 300, isShowSort: true
        },
        // 节目用途
        {
          title: this.languageTable.strategyList.programPurpose, key: 'programPurpose', width: 300, isShowSort: true
        },
        // 时长
        {
          title: this.languageTable.strategyList.duration, key: 'duration', width: 250, isShowSort: true
        },
        // 格式
        {
          title: this.languageTable.strategyList.mode, key: 'mode', width: 250, isShowSort: true
        },
        // 节目文件
        {
          title: this.languageTable.strategyList.programFileName, key: 'programFileName', width: 300, isShowSort: true
        }
      ],
      showPagination: false,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [],
      // 排序
      sort: (event: SortCondition) => {
        let temp = [];
        if (event && Object.keys(event).length) {
          temp = _.sortBy(this.playProgramList, event.sortField);
          if (event.sortRule === TableSortConfig.DESC) {
            temp.reverse();
          }
        } else {
          // 没有排序时就还原成之前的数组
          this.releaseData.strategyProgRelationList.forEach(item => {
            this.playProgramList.forEach(it => {
              if (item.programId === it.programId) {
                temp.push(it);
              }
            });
          });
        }
        this.playProgramList = [...temp];
      }
    };
  }

  /**
   * 获取策略详情
   */
  public initDetails(): void {
    this.isLoading = true;
    this.$activatedRoute.params.subscribe(params => {
      this.$applicationService.getBroadcastPolicyDetails(params.id).subscribe((result: ResultModel<StrategyListModel>) => {
        this.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.strategyId = params.id;
          this.handNextSteps(result.data);
        } else {
          this.$message.error(result.msg);
        }
      }, () => {
        this.isLoading = false;
      });
    });
  }

  /**
   * 根据节目id集合查询
   * @ param params
   */
  public lookReleaseProgramIds(params: Array<string>): void {
    this.$applicationService.lookReleaseProgramIds(params).subscribe((result: ResultModel<ProgramListModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        const tempProgram = [];
        this.releaseData.strategyProgRelationList.forEach(item => {
          const programInfo = result.data.find(it => it.programId === item.programId);
          if (programInfo) {
            // programInfo.duration = item.playTime.toString();
            tempProgram.push(programInfo);
          }
        });
        this.playProgramList = tempProgram;
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 处理时间显示
   */
  public timeFmt(data: StrategyPlayPeriodRefListModel[]): string {
    let time = '';
    if (data && data.length) {
      data.forEach(item => {
        time += `${CommonUtil.dateFmt('hh:mm', new Date(item.playStartTime))} ~ ${CommonUtil.dateFmt('hh:mm', new Date(item.playEndTime))};`;
      });
    }
    return time;
  }

  /**
   * 父组件点击下一步的时候触发该方法更新值
   * @ param data
   */
  public handNextSteps(data: StrategyListModel): void {
    this.releaseData = detailsFmt(data, this.$nzI18n);
    // 根据节目id获取节目详细信息
    const ids = data.strategyProgRelationList.map(item => item.programId);

    this.lookReleaseProgramIds(ids);
  }

  /**
   * 确认删除
   */
  public handleDeleteOk(): void {
    this.isLoading = true;
    this.$applicationService.deleteStrategy([this.strategyId]).subscribe((result: ResultModel<string>) => {
      this.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.languageTable.strategyList.deleteMsg);
        this.$router.navigate([RouterJumpConst.broadcastPolicyControl], {}).then();
      } else {
        this.$message.error(result.msg);
      }
    }, error => {
      this.isLoading = false;
    });
  }

  /**
   * 点击删除按钮
   */
  public onClickDelete(): void {
    this.$modalService.confirm({
      nzTitle: this.facilityLanguage.prompt,
      nzContent: `<span>${this.languageTable.strategyList.confirmDelete}?</span>`,
      nzOkText: this.commonLanguage.cancel,
      nzOkType: 'danger',
      nzMaskClosable: false,
      nzOnOk: () => {
      },
      nzCancelText: this.commonLanguage.confirm,
      nzOnCancel: () => {
        this.handleDeleteOk();
      }
    });
  }

  /**
   * 操作按钮
   * @ param event 编辑，删除，启用，禁用
   */
  public handleOperation(event: OperationButtonEnum): void {
    if (event === OperationButtonEnum.delete) {
      this.onClickDelete();
    } else if (event === OperationButtonEnum.enable || event === OperationButtonEnum.disable) {
      const status = event === OperationButtonEnum.enable ? CurrencyEnum.enable : CurrencyEnum.disabled;
      const params = {
        strategyType: StrategyStatusEnum.broadcast,
        operation: status,
        strategyId: this.strategyId
      };
      this.enableOrDisableStrategy([params], status);
    } else if (event === OperationButtonEnum.edit) {
      this.$router.navigate([RouterJumpConst.broadcastWorkbenchEdit], {
        queryParams: {
          id: this.strategyId,
          strategyType: StrategyStatusEnum.broadcast
        }
      }).then();
    }
  }

  /**
   * 启用禁用
   * @ param params
   */
  public enableOrDisableStrategy(params: EnableOrDisableModel[], status: string): void {
    this.isLoading = true;
    this.$applicationService.enableOrDisableStrategy(params).subscribe((result: ResultModel<string>) => {
      this.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.releaseData.strategyStatus = getStrategyStatus(this.$nzI18n, status) as string;
        this.$message.success(`${this.languageTable.contentList.successful}!`);
      } else {
        this.$message.error(result.msg);
      }
    }, err => {
      this.isLoading = false;
    });
  }
}
