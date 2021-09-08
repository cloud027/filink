import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {
  FilterCondition,
  QueryConditionModel,
  SortCondition
} from '../../../../shared-module/model/query-condition.model';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {TenantLanguageInterface} from '../../../../../assets/i18n/tenant/tenant.language.interface';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {TenantApiService} from '../../../tenant/share/sevice/tenant-api.service';
import {SystemForCommonService} from '../../../../core-module/api-service/system-setting';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';

/**
 * 角色切换租户列表弹窗
 */
@Component({
  selector: 'app-tenant-list',
  templateUrl: './tenant-list.component.html',
  styleUrls: ['./tenant-list.component.scss']
})
export class TenantListComponent implements OnInit {
  // 角色切换显示租户列表
  @Input() showTenantList: boolean;
  // 租户列表是否显示传回父组件
  @Output() isShowTenantListEmit = new EventEmitter<boolean>();
  // 点击取消弹窗关闭状态回传给父组件
  @Output() clickCancelEmit = new EventEmitter<boolean>();
  @ViewChild('radioTemp') radioTemp: TemplateRef<any>;
  // 是否展示租户列表
  public isShow: boolean = true;
  // 列表数据
  public dataSet = [];
  // 分页配置
  public pageBean: PageModel = new PageModel(10, 1, 1);
  // 列表配置
  public tableConfig: TableConfigModel = new TableConfigModel();
  // 国际化
  public language: TenantLanguageInterface;
  // 租户列表查询参数
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 选中的租户id
  public selectId: string;
  // 回显时选中的租户id
  public prevSelectId: string;
  // 确定按钮的loading状态
  public isLoading = false;
  // 判断确定按钮是否可以点击
  public submitBtnIsDisable: boolean = true;

  constructor(
    public $nzI18n: NzI18nService,
    public $SystemForCommonService: SystemForCommonService,
    public $tenantApiService: TenantApiService,
    public $message: FiLinkModalService) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 国际化
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.tenant);
    // 加载表格配置
    this.initTableConfig();
    const tenantId = JSON.parse(localStorage.getItem('userInfo')).tenantId;
    this.selectId = tenantId;
    this.prevSelectId = tenantId;
    // 加载数据
    this.tenantRefreshData();
  }

  /**
   * 租户列表数据刷新
   */
  public tenantRefreshData() {
    this.tableConfig.isLoading = true;
    this.$tenantApiService.queryTenantList(this.queryCondition).subscribe((res: ResultModel<any>) => {
      if (res.code === ResultCodeEnum.success) {
        this.tableConfig.isLoading = false;
        this.dataSet = res.data;
        this.submitBtnIsDisable = !this.dataSet.some(item => item.id === this.selectId);
        this.pageBean.Total = res.totalCount;
        this.pageBean.pageIndex = res.pageNum;
        this.pageBean.pageSize = res.size;
        // 解决nz-switch刚刚进页面的时候出现动画问题
        if (!this.tableConfig.showPagination) {
          setTimeout(() => {
            this.tableConfig.showPagination = true;
          });
        }
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 点击取消按钮关闭弹窗
   */
  public handleCancel(): void {
    this.isShow = false;
    this.clickCancelEmit.emit(this.isShow);
  }

  /**
   * 租户选中事件
   * param $event
   * param data
   */
  public selectedChange($event, data): void {
    this.submitBtnIsDisable = false;
  }

  /**
   * 根据选中租户id切换菜单
   */
  public switchAccountToTenant(): void {
    if (this.selectId === this.prevSelectId) {
      this.$message.info(this.language.switchTenantsTip);
      return;
    }
    this.tableConfig.isLoading = true;
    this.isLoading = true;
    const nowLanguage = JSON.parse(localStorage.getItem('localLanguage'));
    this.$SystemForCommonService.switchAccountToTenant(this.selectId, nowLanguage).subscribe((result: ResultModel<any>) => {
      this.tableConfig.isLoading = false;
      this.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        const tenantInfo = result.data.showMenuTemplate.menuInfoTrees;
        const userInfo = JSON.parse(localStorage.getItem('userInfo')) || [];
        userInfo.tenantInfo = tenantInfo;
        userInfo.tenantId = result.data.user.tenantId;
        userInfo.tenantRoleId = result.data.user.role.id;
        userInfo.tenantElement = result.data.user.tenantElement;
        // 缓存保存新的权限
        userInfo.role.permissionList = result.data.user.role.permissionList;
        userInfo.role.roleDeviceTypeDto = result.data.user.role.roleDeviceTypeDto;
        // 角色状态切换为租户
        userInfo.admin = false;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        this.$message.success(this.language.switchedTenantsSuccessfully);
        this.isShow = false;
        this.isShowTenantListEmit.emit(this.isShow);
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
      this.isLoading = false;
    });
  }

  /**
   * 租户列表分页
   */
  public tenantPageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.tenantRefreshData();
  }

  /**
   * 初始化列表参数
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: false,
      isLoading: true,
      outHeight: 108,
      showSizeChanger: true,
      showSearchSwitch: true,
      showPagination: true,
      scroll: {x: '1600px', y: '340px'},
      noIndex: true,
      notShowPrint: true,
      showSearchExport: false,
      rowClick: (rowData) => {
        this.selectId = rowData.id;
        this.submitBtnIsDisable = false;
      },
      columnConfig: [
        { // 选择
          type: 'render',
          title: '',
          fixedStyle: {fixedLeft: true, style: {left: '0px'}},
          width: 62,
          renderTemplate: this.radioTemp
        },
        { // 序号
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        { // 租户名称
          title: this.language.tenantName, key: 'tenantName', width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        { // 电话
          title: this.language.phoneNumber, key: 'phoneNumber', width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 邮箱
          title: this.language.email, key: 'email', width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 通讯地址
          title: this.language.address, key: 'address', width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 备注
          title: this.language.remark, key: 'remark', width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.operate,
          searchable: true,
          searchConfig: {
            type: 'operate',
          }, key: '', width: 100, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition = event;
        this.tenantRefreshData();
      },
      // 筛选
      handleSearch: (event: FilterCondition[]) => {
        event.forEach(item => {
          if (item.filterField === 'phoneNumber') {
            item.operator = 'like';
          }
          if (item.filterField === 'email') {
            item.operator = 'like';
          }
        });
        this.queryCondition.filterConditions = event;
        this.queryCondition.pageCondition.pageNum = 1;
        this.tenantRefreshData();
      }
    };
  }
}
