import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {AlarmForCommonService} from '../../../../core-module/api-service/alarm';
import {NzI18nService} from 'ng-zorro-antd';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {TreeSelectorConfigModel} from '../../../../shared-module/model/tree-selector-config.model';
import {ActivatedRoute, Router} from '@angular/router';
import {TreeSelectorComponent} from '../../../../shared-module/component/tree-selector/tree-selector.component';
import {AreaModel} from '../../../../core-module/model/facility/area.model';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {OperateTypeEnum} from '../../../../shared-module/enum/page-operate-type.enum';
import {AreaApiService} from '../../share/service/area/area-api.service';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {UserForCommonService} from '../../../../core-module/api-service/user';
import {WorkOrderForCommonService} from '../../../../core-module/api-service/work-order';
import {FacilityApiService} from '../../share/service/facility/facility-api.service';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {DepartmentUnitModel} from '../../../../core-module/model/work-order/department-unit.model';

declare const $: any;
declare const cityData: any;

/**
 * 新增修改区域组件
 */
@Component({
  selector: 'app-area-detail',
  templateUrl: './area-detail.component.html',
  styleUrls: ['./area-detail.component.scss']
})
export class AreaDetailComponent implements OnInit {
  // 责任单位模板
  @ViewChild('accountabilityUnit') private accountabilityUnitTep;
  // 责任单位选择器模板
  @ViewChild('unitTreeSelector') private unitTreeSelector: TreeSelectorComponent;
  // 区域选择器模板
  @ViewChild('areaSelector') private areaSelector;
  // 责任单位自定义模板
  @ViewChild('customTemplate') private customTemplate: TemplateRef<any>;
  // 表单配置
  public formColumn: FormItem[] = [];
  // 表单状态
  public formStatus: FormOperate;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 区域信息
  public areaInfo: AreaModel = new AreaModel();
  // 区域选择器显示隐藏
  public areaSelectVisible: boolean = false;
  // 责任单位显示隐藏
  public isVisible = false;
  // 责任单位树配置
  public treeSetting = {};
  // 责任单位数据
  public treeNodes: DepartmentUnitModel[] = [];
  // 责任单位树配置
  public treeSelectorConfig: TreeSelectorConfigModel;
  // 区域id
  public areaId = '';
  // 区域详情页面类型
  public pageType = OperateTypeEnum.add;
  // 区域详细页面title
  public pageTitle: string;
  // 区域选择器树配置
  public areaSelectorConfig: any = new TreeSelectorConfigModel();
  // 区域选择器数据
  public selectorData: any = {parentId: '', accountabilityUnit: ''};
  // 区域名称
  public areaName = '';
  // 区域禁用
  public areaDisabled = false;
  // 按钮是否加载
  public isLoading = false;
  // 页面是否加载
  public pageLoading = false;
  // 已选择责任单位名称
  public selectUnitName: string = '';
  // 表单校验
  public isDisabled: boolean;
  // 城市选择器的值
  public selectCityInfo = {
    cityName: '',
    districtName: '',
    provinceName: ''
  };
  // 城市选择器禁用
  public cityDisabled = false;
  // 责任单位的选择器树回调
  public treeCallback = {};
  // 区域数据
  private areaNodes: AreaModel[] = [];
  // 修改
  public update = OperateTypeEnum.update;


  constructor(private $nzI18n: NzI18nService,
              private $active: ActivatedRoute,
              private $modalService: FiLinkModalService,
              private $facilityCommonService: FacilityForCommonService,
              private $facilityApiService: FacilityApiService,
              private $userService: UserForCommonService,
              private $inspectionService: WorkOrderForCommonService,
              private $alarmService: AlarmForCommonService,
              private $areaApiService: AreaApiService,
              private $ruleUtil: RuleUtil,
              private $router: Router) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.initTreeSelectorConfig();
    this.initColumn();
    this.pageType = this.$active.snapshot.params.type;
    this.pageTitle = this.getPageTitle(this.pageType);
    if (this.pageType !== OperateTypeEnum.add) {
      this.$active.queryParams.subscribe(params => {
        this.areaId = params.id;
        this.pageLoading = true;
        // 修改区域时级别不能选
        this.areaDisabled = true;
        this.queryDeptList().then(() => {
          this.$facilityCommonService.queryAreaList().subscribe((res: ResultModel<AreaModel[]>) => {
            this.areaNodes = res.data || [];
            this.initAreaSelectorConfig(this.areaNodes);
            this.queryAreaById();
          });
        });
      });
    } else {
      this.queryDeptList().then(() => {
        this.$facilityCommonService.queryAreaList().subscribe((res: ResultModel<AreaModel[]>) => {
          this.areaNodes = res.data  || [];
          // 递归设置区域的选择情况
          FacilityForCommonUtil.setAreaNodesStatusUnlimited(this.areaNodes, null, null);
          this.initAreaSelectorConfig(this.areaNodes);
        });
      });
    }

  }

  /**
   * 表单实例返回
   * param event
   */
  public formInstance(event: {instance: FormOperate}): void {
    this.formStatus = event.instance;
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isDisabled = this.formStatus.getValid();
    });
  }

  /**
   * 打开责任单位选择器
   */
  public showModal(): void {
    this.treeSelectorConfig.treeNodes = this.treeNodes;
    this.isVisible = true;
  }

  /**
   * 打开区域选择器
   */
  public showAreaSelectorModal(): void {
    if (this.areaDisabled) {
      return;
    }
    this.areaSelectorConfig.treeNodes = this.areaNodes;
    this.areaSelectVisible = true;
  }

  /**
   * 责任单位选择结果
   * param event
   */
  public selectDataChange(event: DepartmentUnitModel[]): void {
    this.selectUnitName = '';
    const selectArr = event.map(item => {
      this.selectUnitName += `${item.deptName},`;
      return item.id;
    });
    this.selectUnitName = this.selectUnitName.substring(0, this.selectUnitName.length - 1);
    FacilityForCommonUtil.setTreeNodesStatus(this.treeNodes, selectArr);
    this.formStatus.resetControlData('accountabilityUnit', selectArr);
  }

  /**
   * 区域选中结果
   * param event
   */
  public areaSelectChange(event:  AreaModel): void {
    if (event[0]) {
      FacilityForCommonUtil.setAreaNodesStatusUnlimited(this.areaNodes, event[0].areaId, this.areaInfo.areaId);
      this.areaName = event[0].areaName;
      this.selectorData.parentId = event[0].areaId;
    } else {
      FacilityForCommonUtil.setAreaNodesStatusUnlimited(this.areaNodes, null, this.areaInfo.areaId);
      this.areaName = '';
      this.selectorData.parentId = null;
    }
  }

  /**
   * 点击新增区域
   */
  public addArea(): void {
    this.isLoading = true;
    const data = this.formStatus.group.getRawValue();
    data.provinceName = this.selectCityInfo.provinceName;
    data.cityName = this.selectCityInfo.cityName;
    data.districtName = this.selectCityInfo.districtName;
    data.parentId = this.selectorData.parentId;
    if (this.pageType === OperateTypeEnum.add) {
      // 新增区域
      this.$areaApiService.addArea(data).subscribe((result: ResultModel<string>) => {
        this.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.$modalService.success(this.language.addAreaSuccess);
          this.$router.navigate(['/business/facility/area-list']).then();
        } else {
          this.$modalService.error(result.msg);
        }
      }, () => {
        this.isLoading = false;
      });
    } else if (this.pageType === OperateTypeEnum.update) {
      // 修改区域
      data['areaId'] = this.areaId;
      this.$areaApiService.updateAreaById(data).subscribe((result: ResultModel<string>) => {
        this.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.$router.navigate(['/business/facility/area-list']).then();
          this.$modalService.success(this.language.updateAreaSuccess);
        } else {
          this.$modalService.error(result.msg);
        }
      }, () => {
        this.isLoading = false;
      });
    }
  }

  /**
   * 取消返回
   */
  public goBack(): void {
    this.$router.navigate(['/business/facility/area-list']).then();
  }

  /**
   * 城市选择器值变化
   * param event
   */
  public cityInfoChange(event) {
    this.selectCityInfo = event;
  }

  /**
   * 根据id获取区域详情
   */
  private queryAreaById(): void {
    this.$areaApiService.queryAreaById(this.areaId).subscribe((result: ResultModel<AreaModel>) => {
      this.pageLoading = false;
      if (result.code === ResultCodeEnum.success) {
        const areaInfo = result.data || new AreaModel();
        this.areaInfo = areaInfo;
        this.areaName = this.areaInfo.parentName;
        this.selectorData.parentId = this.areaInfo.parentId;
        this.selectUnitName = this.areaInfo.accountabilityUnitName;
        this.formStatus.resetData(areaInfo);
        if (areaInfo.provinceName && areaInfo.cityName && areaInfo.districtName) {
          const info = {
            provinceName: result.data.provinceName,
            cityName: result.data.cityName,
            districtName: result.data.districtName
          };
          this.selectCityInfo = info;
        }
        // 递归设置区域的选择情况
        FacilityForCommonUtil.setAreaNodesStatusUnlimited(this.areaNodes, areaInfo.parentId, areaInfo.areaId);
        // 递归设置树的节点状态
        FacilityForCommonUtil.setTreeNodesStatus(this.treeNodes, areaInfo.accountabilityUnit || []);
      } else if (result.code === ResultCodeEnum.areaCode) {
        this.$modalService.error(result.msg);
        this.goBack();
      }
    } , () => { this.pageLoading = false; });
  }

  /**
   * 获取所有单位
   */
  private queryDeptList() {
    return new Promise((resolve, reject) => {
      this.$userService.queryAllDepartment().subscribe((result: ResultModel<DepartmentUnitModel[]>) => {
        this.treeNodes = result.data || [];
        resolve();
      });
    });
  }

  /**
   * 初始化树选择器配置
   */
  private initTreeSelectorConfig(): void {
    this.treeSetting = {
      check: {
        enable: true,
        chkboxType: {'Y': '', 'N': ''},
        chkStyle: 'checkbox',
      },
      data: {
        simpleData: {
          idKey: 'id',
          pIdKey: 'deptFatherId',
          enable: true,
          rootPid: null
        },
        key: {
          children: 'childDepartmentList',
          name: 'deptName'
        },
      },
      view: {
        showIcon: false,
        showLine: false
      }
    };
    this.treeSelectorConfig = {
      title: `${this.language.selectUnit}`,
      height: '300px',
      width: '1000px',
      treeSetting: this.treeSetting,
      treeNodes: this.treeNodes,
      onlyLeaves: false,
      selectedColumn: [
        {
          title: `${this.language.deptName}`, key: 'deptName', width: 100,
        },
        {
          title: `${this.language.deptLevel}`, key: 'deptLevel', width: 100,
        },
        {
          title: `${this.language.parentDept}`, key: 'parentDepartmentName', width: 100,
        }
      ]
    };
  }

  /**
   * 初始化表单配置
   */
  private initColumn(): void {
    this.formColumn = [
      {
        label: this.language.areaName,
        key: 'areaName',
        type: 'input',
        require: true,
        rule: [{required: true}, {maxLength: 32},
          this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value => this.$areaApiService.queryAreaNameIsExist(
            {areaId: this.areaId, areaName: value}),
            res => res.code === ResultCodeEnum.success)
        ],
      },
      {
        label: this.language.parentId, key: 'parentId', type: 'custom',
        template: this.areaSelector,
        rule: [], asyncRules: []
      },
      {
        label: this.language.region,
        key: 'managementFacilities',
        type: 'custom',
        rule: [],
        template: this.customTemplate
      },
      {
        label: this.language.address,
        key: 'address',
        type: 'input',
        require: false,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule(), this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
      {
        label: this.language.accountabilityUnit,
        key: 'accountabilityUnit',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        template: this.accountabilityUnitTep
      },
      {
        label: this.language.remarks, key: 'remarks', type: 'input',
        rule: [this.$ruleUtil.getRemarkMaxLengthRule(), this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
    ];
  }

  /**
   * 初始化选择区域配置
   * param nodes
   */
  private initAreaSelectorConfig(nodes): void {
    this.areaSelectorConfig = {
      width: '500px',
      height: '300px',
      title: `${this.language.select}${this.language.area}`,
      treeSetting: {
        check: {
          enable: true,
          chkStyle: 'radio',
          radioType: 'all'
        },
        data: {
          simpleData: {
            enable: true,
            idKey: 'areaId',
          },
          key: {
            name: 'areaName'
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

  /**
   * 获取页面类型(add/update)
   * param type
   * returns {string}
   */
  private getPageTitle(type: OperateTypeEnum): string {
    let title;
    switch (type) {
      case OperateTypeEnum.add:
        title = `${this.language.addArea}${this.language.area}`;
        break;
      case OperateTypeEnum.update:
        title = `${this.language.modify}${this.language.area}`;
        break;
    }
    return title;
  }
}
