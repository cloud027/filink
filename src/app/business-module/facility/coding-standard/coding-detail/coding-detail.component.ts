import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {FinalValueEnum} from '../../../../core-module/enum/step-final-value.enum';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {CodingStandardApiService} from '../../share/service/coding-standard/coding-standard-api.service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {CodingRangeEnum} from '../../share/enum/coding-standard.enum';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {OperateTypeEnum} from '../../../../shared-module/enum/page-operate-type.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {CodingStandardInfoModel} from '../../share/model/coding-standard-info.model';
import {TreeSelectorConfigModel} from '../../../../shared-module/model/tree-selector-config.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {AreaModel} from '../../../../core-module/model/facility/area.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {NewCodingStepSecondComponent} from '../new-coding-step-second/new-coding-step-second.component';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {AssetAnalysisUtil} from '../../share/util/asset-analysis.util';

declare var $: any;

@Component({
  selector: 'app-coding-detail',
  templateUrl: './coding-detail.component.html',
  styleUrls: ['./coding-detail.component.scss']
})
export class CodingDetailComponent implements OnInit {
  // 获取新增编码第二步表单值
  @ViewChild('secondInfo') secondInfo: NewCodingStepSecondComponent;
  // 资产类型选择器模版
  @ViewChild('assetTypeTemp') public assetTypeTemp: TemplateRef<HTMLDocument>;
  // 区域选择器模版
  @ViewChild('areaTemp') public areaTemp: TemplateRef<HTMLDocument>;
  // 设施语言包
  public language: FacilityLanguageInterface;
  /** 公共国际化*/
  public commonLanguage: CommonLanguageInterface;
  // 页面标题
  public pageTitle: string = '';
  // 选中的步骤数
  public isActiveSteps = FinalValueEnum.STEPS_FIRST;
  // 步骤条的步骤枚举
  public finalValueEnum = FinalValueEnum;
  // 步骤条的值
  public setData = [];
  // 表单参数
  public formColumn: FormItem[] = [];
  // 表单状态
  public formInstance: FormOperate;
  // 下一步按钮是否禁用
  public nextButtonDisable: boolean = true;
  // 确定按钮是否禁用
  public submitButtonDisable: boolean = true;
  // 提交loading
  public isSaveLoading: boolean = false;
  // 资产类型弹窗显示
  public isShow: boolean = false;
  // 资产类型树实例
  public treeInstanceLeft: any;
  // 资产类型树数据集
  public nodes: any = [];
  // 树配置
  public assetTypeSelectorConfig: TreeSelectorConfigModel = new TreeSelectorConfigModel();
  // 区域树配置
  public treeSelectorConfig: TreeSelectorConfigModel;
  // 区域树数据
  public treeNodes: AreaModel[];
  // 区域选择器显示控制
  public isVisible: boolean = false;
  // 新增参数
  public stepsFirstParams: CodingStandardInfoModel = new CodingStandardInfoModel();
  // 页面类型 新增修改
  public pageType = OperateTypeEnum.add;
  // 所选区域的名称拼接
  public selectAreaName: string;
  // 所选资产类型的名称拼接
  public selectAssetName: string;
  // 编辑回显第二步数据
  public secondStepData = {
    firstLevel: '',
    secondLevel: '',
    thirdLevel: '',
    fourthLevel: '',
    firstLevelCustomize: '',
    secondLevelCustomize: '',
    thirdLevelCustomize: '',
    fourthLevelCustomize: '',
  };
  public newQueryData: any[];
  // 资产类型选中的结果
  private typeCodeList: any[] = [];
  // 编辑当前编码标准id
  private codingRuleId: any = {};
  private secondEmitInformation: any = {};
  // 判断第二步传参是否存在不可选字段
  private isDisabledField: boolean = false;
  // 设施设备集勾选的节点
  private facilityAndEquipmentNodes = [];


  constructor(
    public $nzI18n: NzI18nService,
    private $facilityCommonService: FacilityForCommonService,
    public $CodingStandardApiService: CodingStandardApiService,
    public $message: FiLinkModalService,
    private $router: Router,
    private $ruleUtil: RuleUtil,
    private $active: ActivatedRoute
  ) {
  }

  ngOnInit() {
    // 国际化
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // 初始化表单
    this.initColumn();
    // 新增编辑页面初始化
    this.initPage();
    // 初始化区域树
    // this.initTreeSelectorConfig();
    AssetAnalysisUtil.initTreeSelectorConfig(this);
    // 步骤条初始化样式
    this.setData = [{
      number: 1,
      activeClass: ' active',
      title: this.language.codingStandard.firstStep
    },
      {
        number: 2,
        activeClass: '',
        title: this.language.codingStandard.secondStep
      }];

  }

  /**
   * 表单实例校验
   */
  public codingFormInstance(event: { instance: FormOperate }): void {
    this.formInstance = event.instance;
    this.formInstance.group.statusChanges.subscribe(() => {
      this.nextButtonDisable = !(this.formInstance.getRealValid());
    });
  }

  /**
   * 打开资产类型选择弹窗
   */
  public showAssetTypeSelect(): void {
    this.setFacilityTreeNodesStatus(this.nodes, this.facilityAndEquipmentNodes);
    this.initTree();
    this.isShow = true;
  }

  /**
   * 打开区域选择器弹窗
   */
  public showAreaSelect(): void {
    this.treeSelectorConfig.treeNodes = this.treeNodes;
    this.isVisible = true;
  }

  /**
   * 点击取消关闭资产类型弹窗
   */
  public handleCancel(): void {
    this.isShow = false;
  }

  /**
   * 点击确定关闭资产类型弹窗
   */
  public handleOk(): void {
    this.isShow = false;
    this.typeCodeList = [];
    const data = this.treeInstanceLeft.getCheckedNodes();
    this.facilityAndEquipmentNodes = data;
    data.forEach(item => {
      // 排除拼接设施设备集title
      if (!item.isParent) {
        this.typeCodeList.push({typeCode: item.typeCode, typeName: item.typeName});
      }
    });
    this.selectAssetName = this.typeCodeList.map(item => item.typeName).join(',');
    this.formInstance.resetControlData('typeCodeList', this.typeCodeList);
  }

  /**
   * 上一步
   * @ param val 当前步骤
   */
  public handPrevSteps(val: number): void {
    this.isActiveSteps = val - 1;
    this.setData[1].activeClass = '';
    this.setData[0].activeClass = 'active';
  }

  /**
   * 下一步
   * @ param val 当前步骤
   */
  public handNextSteps(val: number): void {
    this.isActiveSteps = val + 1;
    this.setData[1].activeClass = 'active';
    this.setData[0].activeClass = '';
    // 获取当前表单数据
    const data = this.formInstance.getRealData();
    for (const key in data) {
      if (!data[key]) {
        if (key === 'scopeCodeList') {
          data[key] = [];
        } else {
          data[key] = '';
        }
      }
    }
    // 保存第一步的数据
    this.stepsFirstParams = data;
  }

  /**
   * 数据提交
   */
  public handStepsSubmit(): void {
    this.isSaveLoading = true;
    const data = Object.assign(this.stepsFirstParams, this.secondEmitInformation);
    if (!this.codingRuleId.codingRuleId) {
      this.$CodingStandardApiService.addCodingRule(data).subscribe((res: ResultModel<any>) => {
        this.isSaveLoading = false;
        if (res.code === ResultCodeEnum.success) {
          this.$message.success(this.language.codingStandard.addCodingSuccess);
          this.$router.navigate(['/business/facility/coding-standard']).then();
        } else {
          this.$message.error(res.msg);
        }
      }, () => {
        this.isSaveLoading = false;
      });
    } else {
      if (!this.isDisabledField) {
        this.$message.info(this.language.codingStandard.chooseValidFields);
        this.isSaveLoading = false;
      } else {
        data.codingRuleId = this.codingRuleId.codingRuleId;
        this.$CodingStandardApiService.updateCodingRule(data).subscribe((res: ResultModel<any>) => {
          this.isSaveLoading = false;
          if (res.code === ResultCodeEnum.success) {
            this.$message.success(this.language.codingStandard.updateCodingSuccess);
            this.$router.navigate(['/business/facility/coding-standard']).then();
          } else {
            this.$message.error(res.msg);
          }
        }, () => {
          this.isSaveLoading = false;
        });
      }
    }
  }

  /**
   * 取消
   */
  public handCancelSteps(): void {
    window.history.go(-1);
  }

  /**
   * 区域选择器选择结果
   */
  public selectDataChange(event) {
    const selectAreaIds = [];
    const nameArr = [];
    if (event.length > 0) {
      event.forEach(item => {
        selectAreaIds.push({scopeId: item.areaId});
        nameArr.push(item.areaName);
      });
    }
    this.selectAreaName = nameArr.join(',');
    FacilityForCommonUtil.setAreaNodesMultiStatus(this.treeNodes, event.map(item => item.areaId));
    this.formInstance.resetControlData('scopeCodeList', selectAreaIds);
  }

  public infoValid(information): void {
    this.submitButtonDisable = !(information.isDisabled);
    this.secondEmitInformation = information.isDisabled ? information.secondStepParam : {};
    this.isDisabledField = information.isDisabledField;
  }


  /**
   * tree初始化
   */
  initTree() {
    // 初始化设施设备集的树
    $.fn.zTree.init($('#assetTypeList'), this.assetTypeSelectorConfig.treeSetting, this.nodes);
    this.treeInstanceLeft = $.fn.zTree.getZTreeObj('assetTypeList');
    if (this.treeInstanceLeft) {
      if (this.nodes.length > 0) {
        this.treeInstanceLeft.expandAll(true);
      }
    }
  }

  /**
   * 获取区域树数据源
   */
  private getAreaTreeData(selectAreaList?: any[]): void {

    this.$facilityCommonService.queryAreaList().subscribe((result: ResultModel<AreaModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.treeNodes = result.data || [];
        AssetAnalysisUtil.addName(this.treeNodes);
        if (selectAreaList) {
          FacilityForCommonUtil.setAreaNodesMultiStatus(this.treeNodes, selectAreaList.map(item => item.scopeId));
        }
        this.treeSelectorConfig.treeNodes = this.treeNodes;
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
    });


  }

  /**
   * 初始化表单
   */
  private initColumn(): void {
    this.formColumn = [
      {
        // 名称
        label: this.language.codingStandard.codingName,
        key: 'codingRuleName',
        type: 'input',
        require: true,
        rule: [
          {required: true},
          RuleUtil.getNameMaxLengthRule(),
          this.$ruleUtil.getNameRule()
        ],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value =>
              this.$CodingStandardApiService.queryCodingRuleNameIsExist({codingRuleId: this.codingRuleId.codingRuleId, codingRuleName: value}),
            res => res.data)
        ]
      },
      { // 资产类型
        label: this.language.codingStandard.assetType,
        key: 'typeCodeList',
        type: 'custom',
        template: this.assetTypeTemp,
        require: true,
        rule: [{required: true}],
      },
      { // 编码范围
        label: this.language.codingStandard.codingRange,
        key: 'scopeType',
        type: 'select',
        placeholder: this.language.pleaseChoose,
        selectInfo: {
          data: CommonUtil.codeTranslate(CodingRangeEnum, this.$nzI18n, null, LanguageEnum.facility),
          label: 'label',
          value: 'code',
        },
        modelChange: (controls, $event) => {
          const areaListColumn = this.formColumn.find(item => item.key === 'scopeCodeList');
          if ($event === CodingRangeEnum.all) {
            if (areaListColumn) {
              areaListColumn.hidden = true;
            }
          } else {
            if (areaListColumn) {
              areaListColumn.hidden = false;
            }
          }
          this.formInstance.group.updateValueAndValidity();
        },
        require: true,
        rule: [{required: true}],
      },
      { // 区域
        label: this.language.area,
        key: 'scopeCodeList',
        type: 'custom',
        template: this.areaTemp,
        hidden: true,
        require: true,
        rule: [{required: true}],
      },
      { // 备注
        label: this.language.remarks, key: 'remark',
        type: 'textarea',
        col: 24,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule(), this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
    ];
  }

  /**
   * 获取资产类型设施设备集
   */
  private queryAssetTypeList(typeCodeList: any[] = []): void {
    this.$CodingStandardApiService.queryDeviceTypeList().subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        const deviceTypeList = [];
        const equipmentTypeList = [];
        result.data.forEach(item => {
          //  设施类型
          if (item.generalClassification === '1') {
            deviceTypeList.push({
              typeCode: item.typeCode,
              typeName: CommonUtil.codeTranslate(DeviceTypeEnum, this.$nzI18n, item.typeCode, 'facility.config'),
              checked: Boolean(typeCodeList.find(_item => item.typeCode === _item.typeCode))
            });
          } else {
            equipmentTypeList.push({
              typeCode: item.typeCode,
              typeName: CommonUtil.codeTranslate(EquipmentTypeEnum, this.$nzI18n, item.typeCode, 'facility'),
              checked: Boolean(typeCodeList.find(_item => item.typeCode === _item.typeCode))
            });
          }
        });
        const deviceObject = {
          typeCode: '1',
          typeName: this.language.codingStandard.facilitySet,
          children: deviceTypeList,
        };
        const equipmentObject = {
          typeCode: '2',
          typeName: this.language.codingStandard.equipmentSet,
          children: equipmentTypeList,
        };
        this.nodes = [deviceObject, equipmentObject];
        const deviceTypSelectList = deviceTypeList.filter(item => item.checked === true);
        const equipmentTypeSelectList = equipmentTypeList.filter(item => item.checked === true);
        const allSelectAssetType: any[] = deviceTypSelectList.concat(equipmentTypeSelectList);
        if (allSelectAssetType.length) {
          this.selectAssetName = allSelectAssetType.map(item => item.typeName).join(',');
          this.formInstance.resetControlData('typeCodeList', typeCodeList);
        }
        if (deviceTypSelectList.length) {
          this.facilityAndEquipmentNodes.push(...deviceTypSelectList, {typeCode: '1', typeName: this.language.codingStandard.facilitySet});
        }
        if (equipmentTypeSelectList.length) {
          this.facilityAndEquipmentNodes.push(...equipmentTypeSelectList, {typeCode: '2', typeName: this.language.codingStandard.equipmentSet});
        }
        this.assetTypeSelectorConfig = {
          width: '800px',
          height: '300px',
          title: this.language.codingStandard.assetType,
          treeSetting: {
            check: {
              enable: true,
              chkStyle: 'checkbox',
              chkboxType: {'Y': 'ps', 'N': 'ps'},
            },
            data: {
              simpleData: {
                enable: true,
                idKey: 'typeCode',
              },
              key: {
                name: 'typeName',
                children: 'children'
              },
            },
            view: {
              showIcon: false,
              showLine: false
            }
          },
        };
      }
    }, () => {
    });
  }

  /**
   * 初始化新增编辑页面
   */
  private initPage(): void {
    this.$active.queryParams.subscribe(params => {
      this.pageType = this.$active.snapshot.params.type;
      this.pageTitle = this.getPageTitle(this.pageType);
      if (this.pageType !== OperateTypeEnum.add) {
        this.$active.queryParams.subscribe(id => {
          this.codingRuleId = {codingRuleId: id.codingRuleId};
          this.queryCodingRuleInfo().then((data) => {
            this.getAreaTreeData(data.scopeCodeList);
            this.queryAssetTypeList(data.typeCodeList);
          });
        });
      } else {
        this.getAreaTreeData();
        this.queryAssetTypeList();
      }
    });
  }

  /**
   * 获取页面标题类型
   * param type
   * returns {string}
   */
  private getPageTitle(type: OperateTypeEnum): string {
    let title;
    switch (type) {
      case OperateTypeEnum.add:
        title = `${this.language.addArea}${this.language.encodingStandard}`;
        break;
      case OperateTypeEnum.update:
        title = `${this.language.modify}${this.language.encodingStandard}`;
        break;
      default:
        title = '';
        break;
    }
    return title;
  }

  /**
   * 编辑获取回显数据
   */
  private queryCodingRuleInfo(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.$CodingStandardApiService.queryCodingRuleInfo(this.codingRuleId).subscribe((res: ResultModel<any>) => {
        if (res.code === ResultCodeEnum.success) {
          const data = res.data;
          const {codingRuleName, scopeType, scopeCodeList, remark} = data;
          // 回显第一步的名称，编码范围，备注表单数据数据，资产类型数据等弹窗加载勾选完成后再回显
          this.formInstance.resetData({codingRuleName, scopeType, scopeCodeList, remark});
          // 回显第二步的数据
          const secondStepData = {
            firstLevel: '',
            secondLevel: '',
            thirdLevel: '',
            fourthLevel: '',
            firstLevelCustomize: '',
            secondLevelCustomize: '',
            thirdLevelCustomize: '',
            fourthLevelCustomize: '',
          };
          data.fieldCodeList.forEach(item => {
            switch (item.fieldOrder) {
              case '1':
                if (item.fieldCode === '7') {
                  secondStepData.firstLevelCustomize = item.fieldText;
                }
                secondStepData.firstLevel = item.fieldCode;
                break;
              case '2':
                if (item.fieldCode === '7') {
                  secondStepData.secondLevelCustomize = item.fieldText;
                }
                secondStepData.secondLevel = item.fieldCode;
                break;
              case '3':
                if (item.fieldCode === '7') {
                  secondStepData.thirdLevelCustomize = item.fieldText;
                }
                secondStepData.thirdLevel = item.fieldCode;
                break;
              case '4':
                if (item.fieldCode === '7') {
                  secondStepData.fourthLevelCustomize = item.fieldText;
                }
                secondStepData.fourthLevel = item.fieldCode;
                break;
            }
          });
          this.secondStepData = secondStepData;
          this.selectAreaName = data.scopeNameStr;
          this.newQueryData = data.fieldCodeList;
          resolve(data);
        } else {
          this.$message.error(res.msg);
        }
      }, () => {
        reject();
      });

    });

  }

  /**
   * 递归设置设施设备集被选状态(部分)
   */
  private setFacilityTreeNodesStatus(data: any, selectData: any[] = []) {
    data.forEach (item => {
      item.checked = Boolean(selectData.find(_item => item.typeCode === _item.typeCode));
      if (item.children) {
        this.setFacilityTreeNodesStatus(item.children, selectData);
      }
    });
  }
}
