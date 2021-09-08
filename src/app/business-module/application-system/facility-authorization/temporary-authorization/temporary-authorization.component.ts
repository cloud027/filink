import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {Router} from '@angular/router';
import {DateHelperService, NzI18nService, NzModalRef, NzModalService} from 'ng-zorro-antd';
import {FacilityAuthLanguageInterface} from '../../../../../assets/i18n/facility-authorization/facilityAuth-language.interface';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';

import {ApplicationService} from '../../share/service/application.service';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {AuthorityFilterEnum, AuthorityStatusEnum, AuthorityTypeEnum} from '../../share/enum/authority.enum';
import {AuthorizationUtil} from '../../share/util/authorization.util';
import {FacilityListModel} from '../../../../core-module/model/facility/facility-list.model';
import {AuditingModal, AuthorityModel, DeviceAndDoorDataModel} from '../../share/model/authority.model';
import {TimeTypeEnum} from '../../share/enum/program.enum';
import {AuditOperationEnum} from '../../share/enum/operation-button.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
/**
 * 设施临时授权列表
 */
@Component({
  selector: 'app-temporary-authorization',
  templateUrl: './temporary-authorization.component.html',
  styleUrls: ['./temporary-authorization.component.scss']
})
export class TemporaryAuthorizationComponent implements OnInit {
  // 被授权用户名称模板
  @ViewChild('userTemp') userTemp: TemplateRef<HTMLDocument>;
  // 授权用户名称模板
  @ViewChild('authUserTemp') authUserTemp: TemplateRef<HTMLDocument>;
  // 授权用户状态模板
  @ViewChild('authStatusTemp') authStatusTemp: TemplateRef<HTMLDocument>;
  // 授权范围列表列表模板
  @ViewChild('facilityListTemp') facilityListTemp: TemplateRef<HTMLDocument>;
  // 设施状态
  @ViewChild('deviceStatusTemp') deviceStatusTemp: TemplateRef<HTMLDocument>;
  // 设施类型
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<HTMLDocument>;
  // 列表门锁列模板
  @ViewChild('doorLocksTemp') doorLocksTemp: TemplateRef<HTMLDocument>;
  // 列表期限列模板
  @ViewChild('termTemp') termTemp: TemplateRef<HTMLDocument>;
  // 表格总数居
  public dataSet: AuthorityModel[] = [];
  // 翻页配置
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
  // 拷贝对象
  public query_Conditions: QueryConditionModel = new QueryConditionModel();
  // 拷贝对象
  public _query_Conditions_: QueryConditionModel = new QueryConditionModel();
  public formColumn: FormItem[] = [];
  public formStatus: FormOperate;

  public isVisible: boolean = false;
  public isVerifyVisible: boolean = false;
  public isConfirmLoading: boolean = false;
  // 设施授权国际化接口
  public language: FacilityAuthLanguageInterface;
  // 设施国际化接口
  public facilityLanguage: FacilityLanguageInterface;
  // 权限状态 启用2 禁用1
  public authStatus: number = AuthorityStatusEnum.enable;
  // 审核描述
  public auditDescription: string = '';
  // 审核id
  public auditId: string = '';
  // 审核操作
  public AuditOperation: string = '';
  public idsArray: string[] = [];
  public deviceIds: string[] = [];
  public devicesAndDoorsData: DeviceAndDoorDataModel[] = [];
  // 申请用户id
  public applyUserId: string = '';
  public userIdArray: string[] = [];
  // 权限状态常量
  public authorityStatusEnum = AuthorityStatusEnum;
  // 权限工具
  public authorizationUtil = AuthorizationUtil;
  // 授权类型
  public authorityType = AuthorityTypeEnum.temporaryAuthority ;
  // 当前用户权限能看到的设施类型
  public deviceTypeCanSeeList;
  constructor(
    public $router: Router,
    public $nzI18n: NzI18nService,
    public $message: FiLinkModalService,
    public $dateHelper: DateHelperService,
    private $modal: NzModalService,
    private $facilityForCommonService: FacilityForCommonService,
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
   * 刷新临时授权列表
   */
  public refreshData(): void {
    this.tableConfig.isLoading = true;
    this.$applicationService.queryTempAuthList(this.queryCondition).subscribe((res: ResultModel<{ data: AuthorityModel[] }>) => {
      this.tableConfig.isLoading = false;
      this.dataSet = res.data.data;
      // 配置翻页
      this.setPageConfig(res.data);
      this.dataSet.forEach(item => {
        // 审核时间
        item['isExamineShow'] = !item.auditingTime;
      });
    }, () => {
      this.tableConfig.isLoading = false;
    });
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
   * 设施翻页操作
   * @param event 翻页数据
   */
  public facilityPageChange(event: PageModel): void {
    this.facilityQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.facilityQueryCondition.pageCondition.pageSize = event.pageSize;
    AuthorizationUtil._refreshData(this);
  }

  /**
   * 设置翻页
   * @param data 数据
   */
  public setPageConfig(data): void {
    this.pageBean.Total = data.totalCount;
    this.pageBean.pageIndex = data.pageNum;
    this.pageBean.pageSize = data.size;
  }

  /**
   * 审核提交
   */
  public verifyHandleOk(): void {
    this.isConfirmLoading = true;
    // 单个审核
    if (this.AuditOperation === AuditOperationEnum.singleAudit) {
      const params: AuditingModal = {
        id: this.auditId,
        authStatus: Number(this.authStatus),
        auditingDesc: this.auditDescription,
        userId: this.applyUserId
      };
      this.$applicationService.audingTempAuthById(params).subscribe((res: ResultModel<object>) => {
        this.reviewTempAuthJudgment(res);
      });
      // 批量审核
    } else if (this.AuditOperation === AuditOperationEnum.batchAudit) {
      const params: AuditingModal = {
        idList: this.idsArray,
        authStatus: Number(this.authStatus),
        auditingDesc: this.auditDescription,
        userIdList: this.userIdArray
      };
      this.$applicationService.audingTempAuthByIds(params).subscribe((res: ResultModel<object>) => {
        this.reviewTempAuthJudgment(res);
      });
    }

  }

  /**
   * 审核取消
   */
  public verifyHandleCancel(): void {
    this.isVerifyVisible = false;
    this.authStatus = AuthorityStatusEnum.enable;
    this.auditDescription = '';
  }

  /**
   * 跳到第一页
   */
  public goToFirstPage(): void {
    this.queryCondition.pageCondition.pageNum = 1;
    this.refreshData();
  }


  /**
   * 查看临时授权范围
   */
  public queryTemporaryAuth(deviceIds): void {
    // 创建模态框
    const modal = this.$modal.create({
      nzTitle: this.language.temporaryAuthRange,
      nzContent: this.facilityListTemp,
      nzOkText: this.language.cancel,
      nzCancelText: this.language.confirm,
      nzOkType: 'danger',
      nzClassName: 'custom-create-modal',
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
    const query_Conditions: FilterCondition[] = [
      {
        filterField: 'deviceId',
        operator: OperatorEnum.in,
        filterValue: deviceIds
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
  }


  /**
   * 表格初始化
   */
  private initTableConfig(): void {
    this.tableConfig = {
      primaryKey: '09-5-2',
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '2200px', y: '340px'},
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
          title: this.language.name, key: 'name', width: 150, isShowSort: true,
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
          // 被授权用户
          title: this.language.user, key: 'userName', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.userTemp,
          searchConfig: {type: 'input'}
        },
        {
          // 期限
          title: this.language.term, key: 'authExpirationTime', width: 100,
          type: 'render', configurable: true,
          renderTemplate: this.termTemp
        },
        {
          // 申请原因
          title: this.language.applyReason, key: 'applyReason', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 申请时间
          title: this.language.applyTime, key: 'createTime', width: 180, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'},
          pipe: 'date'
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
          // 审核时间
          title: this.language.auditingTime, key: 'auditingTime', width: 180, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'},
          pipe: 'date'
        },
        {
          // 权限状态
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
          // 原因描述
          title: this.language.auditingDesc, key: 'auditingDesc', width: 200, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 操作
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 100, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Object',
      topButtons: [
        {
          // 审核
          text: this.language.examine,
          iconClassName: 'fiLink-check',
          canDisabled: true,
          permissionCode: '09-5-2-2',
          handle: (data) => {
            if (data.some(_item => _item.auditingTime)) {
              this.$message.error(this.language.examineMsg);
              return false;
            }
            const nowTime = CommonUtil.getTimeStamp(new Date());
            const checkTime = data.every(item => {
              const expirationTime = CommonUtil.getTimeStamp(new Date(item.authExpirationTime));
              return expirationTime > nowTime;
            });
            if (checkTime === true) {
              // 置空
              this.idsArray = [];
              // 置空
              this.userIdArray = [];
              // 批量审核操作
              this.AuditOperation = AuditOperationEnum.batchAudit;
              for (const item of data) {
                this.idsArray.push(item.id);
              }
              this.userIdArray = data.map(item => {
                return item.userId;
              });
              this.isVerifyVisible = true;
            } else {
              this.$message.info(this.language.overdueAudit);
            }
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
          permissionCode: '09-5-2-4',
          handle: (data) => {
            const ids = [];
            data.map(item => {
              ids.push(item.id);
            });
            this.$applicationService.deleteTempAuthByIds(ids).subscribe((res: ResultModel<string>) => {
              this.deleteJudgment(res);
            });
          }
        }
      ],
      operation: [
        {
          // 审核
          text: this.language.examine,
          className: 'fiLink-check',
          key: 'isExamineShow',
          permissionCode: '09-5-2-2',
          handle: (currentIndex) => {
            const nowTime = CommonUtil.getTimeStamp(new Date());
            const expirationTime = CommonUtil.getTimeStamp(new Date(currentIndex.authExpirationTime));
            if (expirationTime > nowTime) {
              this.auditId = currentIndex.id;
              this.applyUserId = currentIndex.userId;
              // 单个审核操作
              this.AuditOperation = AuditOperationEnum.singleAudit;
              this.isVerifyVisible = true;
            } else {
              this.$message.info(this.language.overdueAudit);
            }
          }
        },
        {
          // 授权范围
          text: this.language.authRange,
          className: 'fiLink-authority',
          permissionCode: '09-5-2-6',
          handle: (currentIndex) => {
            AuthorizationUtil.initFacilityTableConfig(this);
            // 置空
            this.deviceIds = [];
            // 置空
            this.facilityQueryCondition.filterConditions = [];
            // 查询临时授权信息
            this.$applicationService.queryTempAuthById(currentIndex.id).subscribe((res: ResultModel<AuthorityModel>) => {
              this.devicesAndDoorsData = res.data.authDeviceList;
              const data = res.data.authDeviceList;
              data.forEach(item => {
                this.deviceIds.push(item.deviceId);
              });
              this.queryTemporaryAuth(this.deviceIds);
            });

          }
        },
        {
          // 删除
          text: this.language.delete,
          needConfirm: true,
          confirmContent: this.language.deleteAuthorizationTaskTips,
          className: 'fiLink-delete red-icon',
          permissionCode: '09-5-2-4',
          handle: (currentIndex) => {
            this.$applicationService.deleteTempAuthById(currentIndex.id).subscribe((res: ResultModel<any>) => {
              this.deleteJudgment(res);
            });

          }
        }
      ],
      leftBottomButtons: [],
      sort: (event: SortCondition) => {
        const obj: SortCondition = new SortCondition;
        obj['sortProperties'] = event.sortField;
        obj['sort'] = event.sortRule;
        this.queryCondition.bizCondition = Object.assign(this.filterObject, obj);
        this.refreshData();
      },
      handleSearch: (event: FilterCondition[]) => {
        const obj = {};
        event.forEach(item => {
          if (item.operator === OperatorEnum.gte && item.filterField === AuthorityFilterEnum.createTime) {
            obj['createTime'] = this.changeTime(item.filterValue, TimeTypeEnum.start);
          } else if (item.operator === OperatorEnum.gte && item.filterField === AuthorityFilterEnum.authEffectiveTime) {
            obj['authEffectiveTime'] = this.changeTime(item.filterValue, TimeTypeEnum.start);
          } else if (item.operator === OperatorEnum.gte && item.filterField === AuthorityFilterEnum.authExpirationTime) {
            obj['authExpirationTime'] = this.changeTime(item.filterValue, TimeTypeEnum.start);
          } else if (item.operator === OperatorEnum.gte && item.filterField === AuthorityFilterEnum.auditingTime) {
            obj['auditingTime'] = this.changeTime(item.filterValue, TimeTypeEnum.start);
          } else if (item.operator === OperatorEnum.lte && item.filterField === AuthorityFilterEnum.createTime) {
            obj['createTimeEnd'] = this.changeTime(item.filterValue, TimeTypeEnum.end);
          } else if (item.operator === OperatorEnum.lte && item.filterField === AuthorityFilterEnum.authEffectiveTime) {
            obj['authEffectiveTimeEnd'] = this.changeTime(item.filterValue, TimeTypeEnum.end);
          } else if (item.operator === OperatorEnum.lte && item.filterField === AuthorityFilterEnum.authExpirationTime) {
            obj['authExpirationTimeEnd'] = this.changeTime(item.filterValue, TimeTypeEnum.end);
          } else if (item.operator === OperatorEnum.lte && item.filterField === AuthorityFilterEnum.auditingTime) {
            obj['auditingTimeEnd'] = this.changeTime(item.filterValue, TimeTypeEnum.end);
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
   * 转换时间戳
   * @param time 时间
   * @param type start:开始时间 end:结束时间
   */
  public changeTime(time, type: string) {
    const timeString = CommonUtil.dateFmt('yyyy/MM/dd', new Date(time));
    const date = new Date(type === TimeTypeEnum.start ? `${timeString} 00:00:00` : `${timeString} 23:59:59`);
    return typeof date === 'string' ? Date.parse(date) : CommonUtil.getTimeStamp(date);
  }

  /**
   * 删除后统一消息判断
   */
  private deleteJudgment(res: ResultModel<any>) {
    if (res.code === 0) {
      this.$message.success(res.msg);
      this.goToFirstPage();
      // 临时授权信息已近被删除
    } else if (res.code === 120390) {
      this.$message.info(res.msg);
      this.goToFirstPage();
      // 临时授权信息未过期
    } else if (res.code === 120400) {
      this.$message.info(res.msg);
    } else {
      this.$message.error(res.msg);
    }
  }


  /**
   * 审核后统一判断
   */
  private reviewTempAuthJudgment(res): void {
    this.isConfirmLoading = false;
    this.isVerifyVisible = false;
    this.authStatus = AuthorityStatusEnum.enable;
    this.auditDescription = '';
    if (res.code === 0) {
      this.$message.success(res.msg);
      // 审核成功跳第一页
      this.goToFirstPage();
      // 参数为空
    } else if (res.code === 120380) {
      this.$message.info(res.msg);
      // 审核信息已被删除
    } else if (res.code === 120390) {
      this.$message.info(res.msg);
      this.goToFirstPage();
    } else {
      this.$message.error(res.msg);
    }
  }


  /**
   * 模态框关闭
   */
  private modalClose(modal: NzModalRef<{}, any>): void {
    this.facilityQueryCondition.pageCondition.pageNum = 1;
    this.devicesAndDoorsData = [];
    modal.destroy();
  }


}

