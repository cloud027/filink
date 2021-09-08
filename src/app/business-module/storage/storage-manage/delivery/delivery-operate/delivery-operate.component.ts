import {Component, OnInit, ViewChild} from '@angular/core';
import {StorageLanguageInterface} from '../../../../../../assets/i18n/storage/storage.language.interface';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {StorageApiService} from '../../../share/service/storage-api.service';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {NzI18nService, NzTreeNode} from 'ng-zorro-antd';
import {Router, ActivatedRoute} from '@angular/router';
import * as _ from 'lodash';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../../shared-module/component/form/form-operate.service';
import {TreeSelectorConfigModel} from '../../../../../shared-module/model/tree-selector-config.model';
import {OperateTypeEnum} from '../../../../../shared-module/enum/page-operate-type.enum';
import {DepartmentUnitModel} from '../../../../../core-module/model/work-order/department-unit.model';
import {UserForCommonUtil} from '../../../../../core-module/business-util/user/user-for-common.util';
import {RuleUtil} from '../../../../../shared-module/util/rule-util';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {UserForCommonService} from '../../../../../core-module/api-service';
import {UserListModel} from '../../../../../core-module/model/user/user-list.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {SelectModel} from '../../../../../shared-module/model/select.model';
import {SessionUtil} from '../../../../../shared-module/util/session-util';

/**
 * 出库操作页面-提交出库信息
 */
@Component({
  selector: 'app-delivery-operate',
  templateUrl: './delivery-operate.component.html',
  styleUrls: ['./delivery-operate.component.scss']
})
export class DeliveryOperateComponent implements OnInit {
  // 单位选择
  @ViewChild('department') private departmentTemp;
  // 人员选择
  @ViewChild('collectUserTemp') private collectUserTemp;
  // 国际化
  public storageLanguage: StorageLanguageInterface;
  public commonLanguage: CommonLanguageInterface;
  // 列表配置
  public formColumn: FormItem[] = [];
  // 按钮loading
  public isLoading: boolean = false;
  // 按钮禁用
  public isDisabled: boolean = true;
  // 单位选择器配置
  public areaSelectorConfig = new TreeSelectorConfigModel();
  // 显示单位选择器
  public areaSelectVisible: boolean = false;
  // 所选单位名称
  public selectUnitName: string = '';
  // 所选单位信息
  public unitInfo: any = {};
  // 页面类型
  public pageType: string = OperateTypeEnum.add;
  // 选中结果
  public selectData = [];
  // 当前所选进行出库操作的数据id
  public deliveryIds: string[] = [];
  // 单位下人员信息列表
  public deptChargeUserList: SelectModel[] = [];
  // 选择的用户
  public collectUser: string;
  // 表单操作实现类
  private formStatus: FormOperate;
  // 树数据
  private treeNodes: any = [];
  constructor(public $nzI18n: NzI18nService,
              public $router: Router,
              public $storageApiService: StorageApiService,
              public $message: FiLinkModalService,
              private $ruleUtil: RuleUtil,
              private $active: ActivatedRoute,
              private $userForCommonService: UserForCommonService) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 初始国际化
    this.storageLanguage = this.$nzI18n.getLocaleData(LanguageEnum.storage);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // 初始化表单
    this.initForm();
    this.$active.queryParams.subscribe(params => {
      this.deliveryIds = params.deliveryId;
    });
    // 获取单位信息
    this.getDept();
  }

  /**
   * 获取表单实例对象
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isDisabled = !(this.formStatus.getRealValid() && this.selectUnitName);
    });

    // 进行出库操作时，表单中的出库人员默认为当前用户 不可更改
    const userInfo = SessionUtil.getUserInfo();
    this.formStatus.resetControlData('deliveryUserName', userInfo.userName);
  }

  /**
   * 返回
   */
  public goBack(): void {
    this.$router.navigate(['/business/storage/delivery']).then();
  }

  /**
   * 提交
   */
  public submit(): void {
    const data = this.formStatus.getRealData();
    // 处理传给后台的数据
    data.ids = this.deliveryIds;
    data.deliveryUser = SessionUtil.getUserInfo().id;
    data.collectDeptName = this.selectUnitName;
    data.collectUserName = this.deptChargeUserList.filter(item => item.code === this.collectUser)[0].label;
    this.isLoading = true;
    this.$storageApiService.submitDelivery(data).subscribe((res: ResultModel<string>) => {
      this.isLoading = false;
      if (res.code === ResultCodeEnum.success) {
        this.$message.success(this.storageLanguage.deliveryOperateSuccess);
        this.goBack();
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.isLoading = false;
    });
  }

  /**
   * 打开单位选择器
   */
  public showDeptSelectorModal(): void {
    this.areaSelectorConfig.treeNodes = this.treeNodes;
    this.areaSelectVisible = true;
  }

  /**
   * 单位选中结果
   */
  public deptSelectChange(event: DepartmentUnitModel[]): void {
    this.selectData = event;
    if (event[0]) {
      if (this.selectUnitName !== event[0].deptName) {
        this.formStatus.resetControlData('collectUser', null);
      }
      UserForCommonUtil.setAreaNodesStatus(this.treeNodes, event[0].id, this.unitInfo.id);
      this.selectUnitName = event[0].deptName;
      this.formStatus.resetControlData('collectDept', event[0].id);
      // 选择领用单位后，才可以选择领用人员
      this.queryUsersByDeptId(event[0].id);
      this.formStatus.group.controls['collectUser'].enable();
    } else {
      UserForCommonUtil.setAreaNodesStatus(this.treeNodes, null, this.unitInfo.id);
      this.selectUnitName = '';
      this.formStatus.resetControlData('collectDept', null);
      this.formStatus.group.controls['collectUser'].disable();
      this.formStatus.resetControlData('collectUser', null);
    }
  }

  /**
   * 初始化表单
   */
  private initForm(): void {
    this.formColumn = [
      {
        // 出库人员
        label: this.storageLanguage.deliveryUserName,
        key: 'deliveryUserName',
        type: 'input',
        require: true,
        disabled: true,
        rule: [{required: true}]
      },
      {
        // 领用单位
        label: this.storageLanguage.deptName,
        key: 'collectDept',
        type: 'custom',
        col: 24,
        require: true,
        rule: [],
        template: this.departmentTemp,
      },
      {
        // 领用人员
        label: this.storageLanguage.collectUserName,
        key: 'collectUser',
        type: 'custom',
        require: true,
        disabled: true,
        rule: [{required: true}],
        template: this.collectUserTemp,
      },
      {
        // 出库事由
        label: this.storageLanguage.deliveryReason,
        key: 'deliveryReason',
        type: 'input',
        require: true,
        rule: [{required: true}, RuleUtil.getNameMinLengthRule(), this.$ruleUtil.getRemarkMaxLengthRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()]
      },
      {
        // 备注
        label: this.storageLanguage.remark,
        key: 'remark',
        type: 'textarea',
        col: 24,
        require: false,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule()]
      },
    ];
  }

  /**
   * 获取部门列表信息
   * returns {Promise<any>}
   */
  private getDept() {
    this.$userForCommonService.queryTotalDept().subscribe((result: ResultModel<any>) => {
      this.treeNodes = result.data || [];
      // 初始化单位选择器配置
      this.initAreaSelectorConfig(result.data);
    });
  }
  /**
   * 获取部门下所有责任人
   * @param deptId string
   */
  private queryUsersByDeptId(deptId: string): void {
    this.$userForCommonService.queryUsersByDeptId(deptId).subscribe((result: ResultModel<UserListModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        if (! _.isEmpty(result.data)) {
          this.deptChargeUserList = [];
          result.data.forEach(item => {
            this.deptChargeUserList.push({label: item.userName, code: item.id});
          });
        }
      }
    });
  }
  /**
   * 初始化单位选择器配置
   */
  private initAreaSelectorConfig(nodes: NzTreeNode[]): void {
    this.areaSelectorConfig = {
      width: '500px',
      height: '300px',
      title: this.storageLanguage.selectUnit,
      treeSetting: {
        check: {
          enable: true,
          chkStyle: 'radio',
          radioType: 'all'
        },
        data: {
          simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'deptFatherId',
            rootPid: null
          },
          key: {
            name: 'deptName',
            children: 'childDepartmentList'
          },
        },
        view: {
          showIcon: false,
          showLine: false
        }
      },
      treeNodes: nodes
    };
  }
}
