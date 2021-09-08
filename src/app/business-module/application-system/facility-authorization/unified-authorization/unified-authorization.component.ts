import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {Router} from '@angular/router';
import {DateHelperService, NzI18nService, NzModalService} from 'ng-zorro-antd';
import {FacilityAuthLanguageInterface} from '../../../../../assets/i18n/facility-authorization/facilityAuth-language.interface';
import {
  FilterCondition,
  QueryConditionModel,
  SortCondition
} from '../../../../shared-module/model/query-condition.model';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {ApplicationService} from '../../share/service/application.service';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';


import {CommonUtil} from '../../../../shared-module/util/common-util';
import {AuthorizationUtil} from '../../share/util/authorization.util';
import {FacilityForCommonService} from '../../../../core-module/api-service';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {AuthorityFilterEnum, AuthorityStatusEnum, AuthorityTypeEnum} from '../../share/enum/authority.enum';
import {FacilityListModel} from '../../../../core-module/model/facility/facility-list.model';
import {AuthorityModel, DeviceAndDoorDataModel} from '../../share/model/authority.model';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';



/**
 * 设施统一授权列表
 */
@Component({
  selector: 'app-unified-authorization',
  templateUrl: './unified-authorization.component.html',
  styleUrls: ['./unified-authorization.component.scss']
})
export class UnifiedAuthorizationComponent implements OnInit {
  // 授权用户模板
  @ViewChild('authUserTemp') authUserTemp: TemplateRef<HTMLDocument>;
  // 被授权用户模板
  @ViewChild('userTemp') userTemp: TemplateRef<HTMLDocument>;
  // 权限状态模板
  @ViewChild('authStatusTemp') authStatusTemp: TemplateRef<HTMLDocument>;
  // 授权范围列表模板
  @ViewChild('facilityListTemp') facilityListTemp: TemplateRef<HTMLDocument>;
  // 设施状态模板
  @ViewChild('deviceStatusTemp') deviceStatusTemp: TemplateRef<HTMLDocument>;
  // 设施类型模板
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<HTMLDocument>;
  @ViewChild('doorLocksTemp') doorLocksTemp: TemplateRef<HTMLDocument>;
  // 门锁模板
  @ViewChild('thTemplate') thTemplate: TemplateRef<HTMLDocument>;
  // 期限模板
  @ViewChild('termTemp') termTemp: TemplateRef<HTMLDocument>;
  // 设施授权国际化接口
  public language: FacilityAuthLanguageInterface;
  // 设施国际化接口
  public facilityLanguage: FacilityLanguageInterface;
  // 表格翻页配置
  public pageBean: PageModel = new PageModel(10, 1, 1);
  // 表格配置
  public tableConfig: TableConfigModel;
  // 查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 过滤条件
  public filterObject = {};
  // 设施数据源
  public facilityDataSet: FacilityListModel[] = [];
  // 设施表格翻页配置
  public facilityPageBean: PageModel = new PageModel(10, 1, 1);
  // 设施表格配置
  public facilityTableConfig: TableConfigModel;
  // 设施查询条件
  public facilityQueryCondition: QueryConditionModel = new QueryConditionModel();
  // 列表
  public formColumn: FormItem[] = [];
  // 表单操作实现
  public formStatus: FormOperate;
  // 表格总数据
  public _dataSet: AuthorityModel[] = [];
  // 拷贝对象
  public query_Conditions: QueryConditionModel = new QueryConditionModel();
  // 拷贝对象
  public _query_Conditions_: QueryConditionModel = new QueryConditionModel();
  // 设施id集合
  public deviceIds: string[] = [];
  // 门锁
  public devicesAndDoorsData: DeviceAndDoorDataModel[] = [];
  // 权限状态
  public authorityStatusEnum = AuthorityStatusEnum;
  // 权限工具
  public authorizationUtil = AuthorizationUtil;
  // 授权类型
  public authorityType = AuthorityTypeEnum.unifiedAuthority ;
  // 当前用户权限能看到的设施类型
  public deviceTypeCanSeeList;
  constructor(public $router: Router,
              public $nzI18n: NzI18nService,
              public $message: FiLinkModalService,
              public $dateHelper: DateHelperService,
              private $facilityForCommonService: FacilityForCommonService,
              private $modal: NzModalService,
              // 接口服务
              private $applicationService: ApplicationService
  ) {
    this.deviceTypeCanSeeList = CommonUtil.codeTranslate(DeviceTypeEnum, this.$nzI18n);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facilityAuth);
    this.facilityLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.initTableConfig();
    this.refreshData();
    this.deviceTypeCanSeeList = AuthorizationUtil.getUserCanLookDeviceType(this.deviceTypeCanSeeList);
  }

  /**
   * 翻页
   * @param event 翻页数据
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }


  /**
   * 获取统一授权列表信息
   */
  public refreshData(): void {
    this.tableConfig.isLoading = true;
    this.$applicationService.queryUnifyAuthList(this.queryCondition).subscribe((res: ResultModel<{ data: AuthorityModel[] }>) => {
      this.tableConfig.isLoading = false;
      if (res.code === 0) {
        this._dataSet = res.data.data || [];
        // 配置翻页
        this.setPageConfig(res.data);
      } else {
        this.$message.error(res.msg);
      }

    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 设施翻页
   * @param event 翻页数据
   */
  public facilityPageChange(event: PageModel): void {
    this.facilityQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.facilityQueryCondition.pageCondition.pageSize = event.pageSize;
    AuthorizationUtil._refreshData(this);
  }

  /**
   * 跳转到第一页
   */
  public goToFirstPage(): void {
    this.queryCondition.pageCondition.pageNum = 1;
    this.refreshData();
  }

  /**
   * 设置翻页
   * @param data 授权列表数据
   */
  public setPageConfig(data): void {
    this.pageBean.Total = data.totalCount;
    this.pageBean.pageIndex = data.pageNum;
    this.pageBean.pageSize = data.size;
  }



  /**
   * 查询单个统一授权信息
   * @param id 授权id
   */
  public queryAuthInfoById(id: string): void {
    // 先置空
    this.deviceIds = [];
    this.$applicationService.queryUnifyAuthById(id).subscribe((res: ResultModel<AuthorityModel>) => {
      this.devicesAndDoorsData = res.data.authDeviceList || [];
      const data: DeviceAndDoorDataModel[] = res.data.authDeviceList || [];
      data.forEach(item => {
        this.deviceIds.push(item.deviceId);
      });
      // 创建模态框
      const modal = this.$modal.create({
        nzTitle: this.language.unifiedAuthRange,
        nzContent: this.facilityListTemp,
        nzOkText: this.language.cancel,
        nzCancelText: this.language.confirm,
        nzOkType: 'danger',
        nzClassName: 'custom-create-modal',
        nzMaskClosable: false,
        nzWidth: '1000',
        nzFooter: [
          {
            label: this.language.confirm,
            show: false,
            onClick: () => {
              this.modalClose(modal);
            }
          },
          {
            label: this.language.cancel,
            show: false,
            type: 'danger',
            onClick: () => {
              this.modalClose(modal);
            }
          },
        ]
      });
      //  创建查询条件
      const query_Conditions = [
        {
          filterField: 'deviceId',
          operator: 'in',
          filterValue: this.deviceIds,
        }
      ];
      query_Conditions.forEach(item => {
        this.facilityQueryCondition.filterConditions.push(item);
      });
      AuthorizationUtil._refreshData(this);
      // 用户过滤时重置
      this.query_Conditions = CommonUtil.deepClone(this.facilityQueryCondition);
      // 用户过滤时重置
      this._query_Conditions_ = CommonUtil.deepClone(this.facilityQueryCondition);
    });
  }



  /**
   * 统一授权列表
   */
  private initTableConfig(): void {
    this.tableConfig = {
      primaryKey: '09-5-1',
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1600px', y: '340px'},
      noIndex: true,
      notShowPrint: true,
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0'}}, width: 62},
        {
          // 序号
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        {
          // 授权任务名称
          title: this.language.name, key: 'name', width: 200, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        {
          // 授权用户
          title: this.language.authUser, key: 'authUserName', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.authUserTemp,
          searchConfig: {type: 'input'}
        },
        {
          // 期限
          title: this.language.term, key: 'authExpirationTime', width: 100,
          type: 'render', configurable: true,
          renderTemplate: this.termTemp
        },
        {
          // 授权时间
          title: this.language.createTime, key: 'createTime', width: 180, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'},
          pipe: 'date'
        },
        {
          // 被授权用户
          title: this.language.user, key: 'userName', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.userTemp,
          searchConfig: {type: 'input'}
        },
        {
          // 权限生效时间
          title: this.language.authEffectiveTime, key: 'authEffectiveTime', width: 180, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'},
          pipe: 'date'
        },
        {
          // 权限失效时间
          title: this.language.authExpirationTime, key: 'authExpirationTime', width: 180, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'},
          pipe: 'date'
        },
        {
          // 权限
          title: this.language.authStatus, key: 'authStatus', width: 100, isShowSort: true,
          configurable: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.authStatusTemp,
          searchConfig: {
            type: 'select',
            selectInfo: [
              {label: this.language.takeEffect, value: 2},
              {label: this.language.prohibit, value: 1}
            ]
          },
          handleFilter: () => {
          },
        },
        {
          // 备注
          title: this.language.remark, key: 'remark', width: 200, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 100, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      topButtons: [
        {
          // 新增
          text: this.language.add,
          iconClassName: 'fiLink-add-no-circle',
          permissionCode: '09-5-1-2',
          handle: () => {
            this.$router.navigate(['/business/application/facility-authorization/unified-details/add']).then();
          }
        },
        {
          // 删除
          text: this.language.delete,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          needConfirm: true,
          confirmContent: this.language.deleteAuthorizationTaskTips,
          canDisabled: true,
          permissionCode: '09-5-1-4',
          handle: (data) => {
            const ids = [];
            data.map(item => {
              ids.push(item.id);
            });
            this.$applicationService.deleteUnifyAuthByIds(ids).subscribe((res: ResultModel<object>) => {
              this.deleteJudgment(res);
            });
          }
        }
      ],
      operation: [
        {
          // 编辑
          text: this.language.modify,
          className: 'fiLink-edit',
          permissionCode: '09-5-1-3',
          handle: (currentIndex) => {
            this.$applicationService.queryUnifyAuthById(currentIndex.id).subscribe((res) => {
              if (res.code === 0) {
                this.openUnifiedDetails(currentIndex.id);
              } else if (res.code === 120610) {
                this.$message.info(this.language.AuthExistTips);
                this.goToFirstPage();
              }
            });

          }
        },
        {
          // 授权范围
          text: this.language.authRange,
          className: 'fiLink-authority',
          permissionCode: '09-5-1-7',
          handle: (currentIndex) => {
            AuthorizationUtil.initFacilityTableConfig(this);
            this.$applicationService.queryUnifyAuthById(currentIndex.id).subscribe((res) => {
              if (res.code === 0) {
                // 置空
                this.facilityQueryCondition.filterConditions = [];
                this.queryAuthInfoById(currentIndex.id);
              } else if (res.code === 120610) {
                this.$message.info(this.language.AuthExistTips);
                this.goToFirstPage();
              }
            });
          }
        },
        {
          // 删除
          text: this.language.delete,
          needConfirm: true,
          confirmContent: this.language.deleteAuthorizationTaskTips,
          className: 'fiLink-delete red-icon',
          permissionCode: '09-5-1-4',
          handle: (currentIndex) => {
            this.$applicationService.queryUnifyAuthById(currentIndex.id).subscribe((result) => {
              if (result.code === 0) {
                this.$applicationService.deleteUnifyAuthById(currentIndex.id).subscribe((res: ResultModel<object>) => {
                  this.deleteJudgment(res);
                });
              } else if (result.code === 120610) {
                this.$message.info(this.language.AuthExistTips);
                this.goToFirstPage();
              }
            });
          }
        }
      ],
      leftBottomButtons: [
        {
          // 启用
          text: this.language.takeEffect,
          canDisabled: true,
          permissionCode: '09-5-1-6',
          handle: (data) => {
            this.handleUnifyAuthIds(data, AuthorityStatusEnum.disable);
          }
        },
        {
          // 禁用
          text: this.language.prohibit,
          canDisabled: true,
          permissionCode: '09-5-1-6',
          handle: (data) => {
            this.handleUnifyAuthIds(data, AuthorityStatusEnum.enable);
          }
        },
      ],
      sort: (event: SortCondition) => {
        const obj = {};
        obj['sortProperties'] = event.sortField;
        obj['sort'] = event.sortRule;
        this.queryCondition.bizCondition = Object.assign(this.filterObject, obj);
        this.refreshData();
      },
      handleSearch: (event: FilterCondition[]) => {
        const obj = {};
        event.forEach(item => {
          if (item.operator === OperatorEnum.gte && item.filterField === AuthorityFilterEnum.createTime) {
            obj['createTime'] = item.filterValue;
          } else if (item.operator === OperatorEnum.gte && item.filterField === AuthorityFilterEnum.authEffectiveTime) {
            obj['authEffectiveTime'] = item.filterValue;
          } else if (item.operator === OperatorEnum.gte && item.filterField === AuthorityFilterEnum.authExpirationTime) {
            obj['authExpirationTime'] = item.filterValue;
          } else if (item.operator === OperatorEnum.lte && item.filterField === AuthorityFilterEnum.createTime) {
            obj['createTimeEnd'] = item.filterValue;
          } else if (item.operator === OperatorEnum.lte && item.filterField === AuthorityFilterEnum.authEffectiveTime) {
            obj['authEffectiveTimeEnd'] = item.filterValue;
          } else if (item.operator === OperatorEnum.lte && item.filterField === AuthorityFilterEnum.authExpirationTime) {
            obj['authExpirationTimeEnd'] = item.filterValue;
          } else {
            obj[item.filterField] = item.filterValue;
          }
        });
        this.queryCondition.pageCondition.pageNum = 1;
        this.filterObject = obj;
        this.queryCondition.bizCondition = Object.assign(this.filterObject, obj);
        this.refreshData();
      }
    };
  }
  /**
   * 删除后统一消息判断
   */
  private deleteJudgment(res: ResultModel<object>): void {
    if (res.code === 0) {
      this.$message.success(res.msg);
      this.goToFirstPage();
    } else if (res.code === 120360) {
      this.$message.info(res.msg);
      // 当前任务时间未过期，不可删除
    } else if (res.code === 120370) {
      this.$message.info(res.msg);
    } else {
      this.$message.error(res.msg);
    }
  }

  /**
   * 统一启用禁用后操作
   */
  private batchModifyUnifyAuthStatus(params): void {
    this.$applicationService.batchModifyUnifyAuthStatus(params).subscribe((res: ResultModel<any>) => {
      if (res.code === 0) {
        this.$message.success(res.msg);
        this.goToFirstPage();
      } else if (res.code === 120360) {
        this.$message.info(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    });
  }


  /**
   * 跳转修改统一授权页面
   */
  private openUnifiedDetails(userId): void {
    this.$router.navigate(['/business/application/facility-authorization/unified-details/update'], {
      queryParams: {id: userId}
    }).then();
  }


  /**
   * 模态框关闭
   */
  private modalClose(modal): void {
    this.facilityQueryCondition.pageCondition.pageNum = 1;
    this.devicesAndDoorsData = [];
    modal.destroy();
  }

  /**
   * 处理要启用/禁用的授权任务Id
   * @param data 授权信息
   * @param status 状态
   */
  private handleUnifyAuthIds(data: AuthorityModel[], status: AuthorityStatusEnum) {
    const info: string = (status === AuthorityStatusEnum.disable) ? this.language.effectStatusTips : this.language.disabledStatusTips ;
    if (data.length > 0) {
      const ids = [];
      const newArray = data.filter(item => Number(item.authStatus) === status);
      newArray.forEach(item => {
        ids.push(item.id);
      });
      const params = {
        idArray: ids,
        authStatus: status === AuthorityStatusEnum.disable ? AuthorityStatusEnum.enable : AuthorityStatusEnum.disable
      };
      if (ids.length === 0) {
        this.$message.info(info);
      } else {
        this.batchModifyUnifyAuthStatus(params);
      }
    } else {
      return;
    }
  }




}
