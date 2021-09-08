import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PlanProjectLanguageInterface} from '../../../../assets/i18n/plan-project/plan-project.language.interface';
import {CommonLanguageInterface} from '../../../../assets/i18n/common/common.language.interface';
import {LanguageEnum} from '../../../shared-module/enum/language.enum';
import {NzI18nService, NzTreeNode} from 'ng-zorro-antd';
import {FormItem} from '../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../shared-module/component/form/form-operate.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PlanningListTableUtil} from '../../../core-module/business-util/project/planning-list-table.util';
import {RuleUtil} from '../../../shared-module/util/rule-util';
import {PlanProjectApiService} from '../share/service/plan-project.service';
import {ResultCodeEnum} from '../../../shared-module/enum/result-code.enum';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';
import {TreeSelectorConfigModel} from '../../../shared-module/model/tree-selector-config.model';
import {ResultModel} from '../../../shared-module/model/result.model';
import {FacilityForCommonUtil} from '../../../core-module/business-util/facility/facility-for-common.util';
import {FacilityForCommonService} from '../../../core-module/api-service';
import {WisdomPointInfoModel} from '../../../core-module/model/plan/wisdom-point-info.model';
import {AreaModel} from '../../../core-module/model/facility/area.model';

@Component({
  selector: 'app-project-wisdom-detail',
  templateUrl: './project-wisdom-detail.component.html',
  styleUrls: ['./project-wisdom-detail.component.scss']
})
export class ProjectWisdomDetailComponent implements OnInit {
  // 智慧杆型号模板
  @ViewChild('wisdomModelTemp') wisdomModelTemp: TemplateRef<HTMLDocument>;
  @ViewChild('areaTemp') areaTemp: TemplateRef<HTMLDocument>;
  // 项目规划语言包
  public language: PlanProjectLanguageInterface;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;

  // form表单配置
  public formColumn: FormItem[];
  // 表单实例
  public formStatus: FormOperate;
  // 提交loading
  public isSaveLoading = false;
  // 页面标题
  public pageTitle: string;
  // 项目点位id
  public pointId: string;
  // 产品列表弹窗显隐
  public isShowProductList: boolean = false;

  // 选中产品型号的名字
  public selectProductName: string = '';
  // 选中产品型号的产品id

  public selectProductId: string = '';
  // 选中区域名字
  public selectAreaName: string = '';

  // 区域选择器显隐
  public areaSelectVisible: boolean = false;
  // 区域树配置
  public areaSelectorConfig: TreeSelectorConfigModel = new TreeSelectorConfigModel();
  // 区域选择节点
  private areaNodes: NzTreeNode[] = [];
  // 选择的区域code
  public selectAreaCode: string = '';

  // 点位信息
  public pointData: WisdomPointInfoModel;

  constructor(
    private $nzI18n: NzI18nService,
    private $router: Router,
    private $message: FiLinkModalService,
    private $active: ActivatedRoute,
    // 资产公共接口
    private $facilityCommonService: FacilityForCommonService,
    // 项目接口
    private $planProjectApiService: PlanProjectApiService,
    private $ruleUtil: RuleUtil,
  ) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.planProject);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    if (JSON.parse(localStorage.getItem('localLanguage')) === 'EN') {
      this.pageTitle = `${this.language.modify} ${this.language.wisdom}`;
    } else {
      this.pageTitle = `${this.language.modify}${this.language.wisdom}`;
    }
    // 初始化表单
    this.initForm();
    this.$active.queryParams.subscribe(param => {
      if (param.id) {
        this.pointId = param.id;
        this.queryProjectPointById(this.pointId);
      }
    });
    this.queryArea();
  }

  /**
   * 获取表单实例
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
  }

  /**
   * 产品列表显示
   */
  public showProductList(): void {
    this.isShowProductList = !this.isShowProductList;
  }

  /**
   * 区域选择器显隐
   */
  public showAreaSelector(): void {
    this.areaSelectorConfig.treeNodes = this.areaNodes;
    if (this.pointData.areaCode) {
      this.areaSelectVisible = true;
    }
  }

  /**
   * 区域选中结果
   * @param event 选中区域数据
   */
  public areaSelectChange(event: AreaModel): void {
    if (event[0]) {
      this.selectAreaName = event[0].areaName;
      this.selectAreaCode = event[0].areaCode;
      // 重置区域id
      this.formStatus.resetControlData('areaCode', event[0].areaCode);
    } else {
      this.selectAreaName = '';
      this.formStatus.resetControlData('areaCode', null);
    }
  }

  /**
   * 取消
   */
  public cancel(): void {
    // 跳转至项目智慧杆列表页
    this.$router.navigate(['business/project-manage/project-wisdom-list']).then();
  }

  /**
   * 选中产品变化
   * @param event 产品数据
   */
  public selectProductChange(event: WisdomPointInfoModel[]): void {
    if (event.length === 1) {
      this.selectProductName = event[0].productModel;
      this.selectProductId = event[0].productId;
    }
  }

  /**
   * 保存
   */
  public onSaveBasicInfo(): void {
    this.isSaveLoading = true;
    // 获取表单数据
    const projectWisdomInfoData = this.formStatus.getRealData();
    projectWisdomInfoData.pointId = this.pointId;
    projectWisdomInfoData.productId = this.selectProductId;
    projectWisdomInfoData.areaName = this.selectAreaName;
    this.$planProjectApiService.updatePointInfo(projectWisdomInfoData).subscribe((result: ResultModel<string>) => {
      this.isSaveLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.language.updateWisdomSuccess);
        // 跳转至项目智慧杆列表页
        this.$router.navigate(['business/project-manage/project-wisdom-list']).then();
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.isSaveLoading = false;
    });
  }

  /**
   * 初始化表单配置
   */
  private initForm(): void {
    // 获取配置
    this.formColumn = PlanningListTableUtil.getWisdomFormColumnConfig(this.$nzI18n, this);
    // 添加所属项目
    this.formColumn.push(
      { // 所属项目
        label: this.language.belongProject,
        key: 'projectName',
        type: 'input',
        col: 24,
        rule: [RuleUtil.getNameMaxLengthRule(255)],
        customRules: [],
      }
    );
    // 项目名称校验是否重复规则
    this.formColumn.forEach(item => {
      if (item.key === 'pointName') {
        // 校验名称是否已存在
        item.asyncRules = [
          this.$ruleUtil.getNameAsyncRule(value =>
            this.$planProjectApiService.checkProjectPointName({pointId: this.pointId, pointName: value}), res => {
            return res.code === ResultCodeEnum.success && res.data;
          }),
        ];
      }
    });
  }

  /**
   * 查询区域
   */
  private queryArea(): void {
    this.$facilityCommonService.queryAreaListForPageSelection().subscribe((res: ResultModel<NzTreeNode[]>) => {
      this.areaNodes = res.data || [];
      this.initAreaSelectorConfig(this.areaNodes);
      // 递归设置区域的选择情况
      FacilityForCommonUtil.setAreaNodesStatusUnlimited(this.areaNodes, this.pointData.areaCode, null, 'areaCode');
    });
  }

  /**
   * 初始化选择区域配置
   * param nodes
   */
  private initAreaSelectorConfig(nodes: NzTreeNode[]): void {
    const title = `${this.language.select}${this.language.area}`;
    this.areaSelectorConfig = FacilityForCommonUtil.getAreaSelectorConfig(title, nodes);
    // idkey由默认areaId改为areaCode
    this.areaSelectorConfig.treeSetting.data.simpleData.idKey = `areaCode`;
  }

  /**
   * 根据id查询点位信息
   * @param id 点位id
   */
  private queryProjectPointById(id: string): void {
    this.$planProjectApiService.queryProjectPointById(id).subscribe((result: ResultModel<WisdomPointInfoModel>) => {
      const pointData = result.data;
      this.formStatus.resetData(pointData);
      this.selectProductName = pointData.pointModel;
      this.selectProductId = pointData.productId;
      this.selectAreaName = pointData.areaName;
      this.pointData = pointData;
      // 所属规划 项目 智慧杆状态不可编辑
      ['pointStatus', 'planName', 'projectName'].forEach(item => {
        this.formStatus.group.controls[item].disable();
      });
    });
  }
}
