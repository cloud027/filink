import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {ApplicationService} from '../../../share/service/application.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../../shared-module/model/query-condition.model';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {ApplicationInterface} from '../../../../../../assets/i18n/application/application.interface';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {NzI18nService} from 'ng-zorro-antd';
import {PassagewayModel} from '../../../share/model/passageway.model';
import {CameraAccessTypeEnum, EnableOnvifStatusEnum, OtherSettingsEnum} from '../../../share/enum/camera.enum';
import {CurrencyEnum} from '../../../../../core-module/enum/operator-enable-disable.enum';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';

/**
 * 通道配置基本信息页面
 */
@Component({
  selector: 'app-passageway-information',
  templateUrl: './passageway-information.component.html',
  styleUrls: ['./passageway-information.component.scss']
})
export class PassagewayInformationComponent implements OnInit, OnDestroy {

  /**
   * 通道配置组件
   */
  @ViewChild('channelConfiguration') channelConfiguration;
  /**
   * 通道状态模板
   */
  @ViewChild('channelStatus') channelStatus;
  /**
   * 是否启用onvif探测模板
   */
  @ViewChild('onvifStatus') onvifStatus;
  /**
   * 其他设置模板
   */
  @ViewChild('otherSetting') otherSetting;

  /**
   * 列表数据
   */
  public dataSet: PassagewayModel[] = [];

  /**
   * 分页初始设置
   */
  public pageBean: PageModel = new PageModel();
  /**
   * 列表配置
   */
  public tableConfig: TableConfigModel;
  /**
   * 列表查询参数
   */
  private queryCondition: QueryConditionModel = new QueryConditionModel();

  /**
   * 通道详情模态框
   */
  public isPassagewayDetail: boolean = false;
  /**
   * 国际化
   */
  public language: ApplicationInterface;

  /**
   * 通道详情数据
   */
  public passagewayDetail: PassagewayModel;

  /**
   * 通道状态枚举
   */
  public channelStatusEnum = CurrencyEnum;

  /**
   * onvif是否启用枚举
   */
  public enableOnvifStatusEnum = EnableOnvifStatusEnum;

  /**
   * 其他设置枚举
   */
  public otherSettingsEnum = OtherSettingsEnum;


  /**
   * @param $applicationService 后台接口服务
   * @param $activatedRoute 路由传参服务
   * @param $message  信息提示服务
   * @param $nzI18n  国际化服务
   * @param $router  路由服务
   */
  constructor(
    private $applicationService: ApplicationService,
    private $activatedRoute: ActivatedRoute,
    private $message: FiLinkModalService,
    private $nzI18n: NzI18nService,
    private $router: Router,
  ) {
  }

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.initTableConfig();
    this.onInitialization();
  }

  /**
   * 分页事件
   * @param event 分页对象
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.onInitialization();
  }

  /**
   * 页面销毁
   */
  ngOnDestroy(): void {
    this.channelConfiguration = null;
  }

  /**
   * 初始化获取通道列表
   */
  private onInitialization(): void {
    this.tableConfig.isLoading = true;
    this.$applicationService.getSecurityPassagewayList(this.queryCondition)
      .subscribe((result: ResultModel<PassagewayModel[]>) => {
        this.tableConfig.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.dataSet = result.data;
          this.pageBean.Total = result.totalCount;
          this.pageBean.pageIndex = result.pageNum;
          this.pageBean.pageSize = result.size;
          this.dataSet.forEach(item => {
            item.state = item.status === '1';
          });
        } else {
          this.$message.error(result.msg);
        }
      }, () => {
        this.tableConfig.isLoading = false;
      });
  }

  /**
   * 初始化表格配置
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      primaryKey: '09-3-1',
      scroll: {x: '1600px', y: '600px'},
      notShowPrint: true,
      noIndex: true,
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        // 序号
        {
          type: 'serial-number', width: 62, title: this.language.frequentlyUsed.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        // 通道名称
        {
          title: this.language.securityWorkbench.channelName, key: 'channelName', width: 150, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        // 通道号
        {
          title: this.language.securityWorkbench.channelNumber, key: 'channelId', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        // 通道状态
        {
          title: this.language.securityWorkbench.channelStatus, key: 'status', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'select',
            selectInfo: [
              {label: this.language.frequentlyUsed.enable, value: '1'},
              {label: this.language.frequentlyUsed.disabled, value: '0'},
            ]
          },
          type: 'render',
          renderTemplate: this.channelStatus,
        },
        // 摄像机接入类型
        {
          title: this.language.securityWorkbench.cameraType, key: 'cameraType', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'select',
            selectInfo: [
              {label: CameraAccessTypeEnum.rtsp, value: CameraAccessTypeEnum.rtsp},
              {label: CameraAccessTypeEnum.onvif, value: CameraAccessTypeEnum.onvif},
            ]
          }
        },
        // 是否启用ONVIF探测
        {
          title: this.language.securityWorkbench.onvifStatus, key: 'onvifStatus', width: 180, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'select',
            selectInfo: [
              {label: this.language.frequentlyUsed.yes, value: '1'},
              {label: this.language.frequentlyUsed.no, value: '0'},
            ]
          },
          type: 'render',
          renderTemplate: this.onvifStatus,
        },
        // 探测ONVIF IP
        {
          title: this.language.securityWorkbench.onvifIp, key: 'onvifIp', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // 探测ONVIF用户名
        {
          title: this.language.securityWorkbench.onvifAccount, key: 'onvifAccount', width: 180, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // 探测ONVIF密码
        {
          title: this.language.securityWorkbench.onvifPassword, key: 'onvifPassword', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        // 摄像机接入RTSP地址
        {
          title: this.language.securityWorkbench.rtspAddr, key: 'rtspAddr', width: 180, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // 摄像机接入ONVIF地址
        {
          title: this.language.securityWorkbench.onvifAddr, key: 'onvifAddr', width: 180, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        // 摄像机IP
        {
          title: this.language.securityWorkbench.cameraIp, key: 'cameraIp', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        // 摄像机端口
        {
          title: this.language.securityWorkbench.cameraPort, key: 'cameraPort', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'inputNumber'},
        },
        // 摄像机用户名
        {
          title: this.language.securityWorkbench.cameraAccount, key: 'cameraAccount', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        // 摄像机密码
        {
          title: this.language.securityWorkbench.cameraPassword, key: 'cameraPassword', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        // 录像保留天数（天）
        {
          title: this.language.securityWorkbench.videoRetentionDays, key: 'videoRetentionDays', width: 180, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'inputNumber'},
        },
        // 其它设置
        {
          title: this.language.securityWorkbench.audioSwitch, key: 'audioSwitch', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'select',
            selectInfo: [
              {label: this.language.frequentlyUsed.openVolume, value: '1'},
              {label: this.language.frequentlyUsed.closeVolume, value: '0'},
            ]
          },
          type: 'render',
          renderTemplate: this.otherSetting,
        },
        // 操作
        {
          title: this.language.frequentlyUsed.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 180, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      topButtons: [
        // 新增
        {
          text: this.language.frequentlyUsed.add,
          iconClassName: 'fiLink-add-no-circle',
          permissionCode: '09-3-1-1-1',
          handle: () => {
            this.openPassageway('add');
          }
        },
        // 删除
        {
          text: this.language.frequentlyUsed.delete,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          permissionCode: '09-3-1-1-2',
          needConfirm: true,
          canDisabled: true,
          confirmContent: `${this.language.frequentlyUsed.confirmDelete}?`,
          handle: (data: PassagewayModel[]) => {
            const idList = data.map(item => {
              return item.id;
            });
            this.onDeletePassageway(idList);
          }
        },
      ],
      operation: [
        // 通道详情
        {
          text: this.language.securityWorkbench.accessDetails,
          permissionCode: '09-3-1-1-3',
          className: 'fiLink-view-detail',
          handle: (data: PassagewayModel) => {
            this.isPassagewayDetail = true;
            this.passagewayDetail = data;
          }
        },
        // 编辑
        {
          text: this.language.frequentlyUsed.edit,
          className: 'fiLink-edit',
          permissionCode: '09-3-1-1-4',
          handle: (data: PassagewayModel) => {
            this.openPassageway('update', data.id);
          },
        },
        // 删除
        {
          text: this.language.frequentlyUsed.delete,
          className: 'fiLink-delete red-icon',
          needConfirm: true,
          permissionCode: '09-3-1-1-2',
          // 确认删除
          confirmContent: `${this.language.frequentlyUsed.confirmDelete}?`,
          handle: (data: PassagewayModel) => {
            this.onDeletePassageway([data.id]);
          }
        }
      ],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition = event;
        this.onInitialization();
      },
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.onInitialization();
      }
    };
  }

  /**
   * 跳转到新增/编辑页面
   * @param jumpType 跳转类型
   * @param id 主键ＩＤ
   */
  public openPassageway(jumpType: string, id?: string): void {
    this.$router.navigate(
      [`business/application/security/workbench/passageway-information/${jumpType}`], {
        queryParams: {id: id}
      }).then();
  }

  /**
   * 删除通道方法
   * @param idList 主键数组
   */
  public onDeletePassageway(idList: Array<string>): void {
    const parameter = {
      idList: idList
    };
    this.$applicationService.deleteChannel(parameter)
      .subscribe((result: ResultModel<PassagewayModel>) => {
        if (result.code === ResultCodeEnum.success) {
          this.$message.success(this.language.frequentlyUsed.deleteSucceeded);
          // 删除跳第一页
          this.queryCondition.pageCondition.pageNum = 1;
          this.onInitialization();
        } else {
          this.$message.error(result.msg);
        }
      });
  }

  /**
   * 改变通道状态事件
   * param event
   * param data
   */
  public changeChannelStatus(event: boolean, data: PassagewayModel) {
    const parameter = {
      id: data.id,
      status: event
    };
    this.$applicationService.updateChannelStatus(parameter)
      .subscribe((result: ResultModel<string>) => {
        if (result.code === ResultCodeEnum.success) {
          this.$message.success(event ? this.language.informationWorkbench.enabledSuccessfully
            : this.language.informationWorkbench.disableSuccessfully);
        } else {
          this.$message.error(result.msg);
        }
        this.onInitialization();
      }, () => {
        const tempId = `${data.channelId}${data.equipmentId}`;
        this.dataSet.find(item => `${item.channelId}${item.equipmentId}` === tempId).state = !event;
      });
  }
}
