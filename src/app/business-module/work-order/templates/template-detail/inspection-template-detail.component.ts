import {Component, ElementRef, TemplateRef, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {NzI18nService, NzModalService, NzInputDirective} from 'ng-zorro-antd';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {ActivatedRoute} from '@angular/router';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {InspectionTemplateModel} from '../../share/model/template/inspection-template.model';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {OperateTypeEnum} from '../../../../shared-module/enum/page-operate-type.enum';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {SelectTemplateModel} from '../../share/model/template/select-template.model';
import {InspectionWorkOrderService} from '../../share/service/inspection';
import {InspectionTemplateConfigModel} from '../../share/model/template/inspection-template-config.model';
declare const $: any;

@Component({
  selector: 'app-template-detail',
  templateUrl: './inspection-template-detail.component.html',
  styleUrls: ['./inspection-template-detail.component.scss']
})
export class InspectionTemplateDetailComponent implements OnInit, OnDestroy {
  // 巡检项表格-
  @ViewChild('tempTable') tempTable: TemplateRef<any>;
  // 添加巡检项
  @ViewChild('addTemplate') addTemplate: TemplateRef<any>;
  // 输入
  @ViewChild(NzInputDirective, { read: ElementRef }) inputElement: ElementRef;
  // form表单配置
  public formColumn: FormItem[] = [];
  // 表单校验
  public idFormDisabled: boolean = false;
  // 国际化
  public InspectionLanguage: InspectionLanguageInterface;
  // 工单ID
  public procId: string = null;
  // 页面标题
  public pageTitle: string;
  // 列表初始加载图标
  public isLoading: boolean = false;
  // 巡检项列表
  public listOfData: SelectTemplateModel[] = [];
  // 被编辑的id
  public editId: string = '';
  // 添加按钮
  public addBtnClass: boolean = false;
  // 弹窗显示隐藏
  public xcVisible: boolean = false;
  // 是否可以提交
  public canCommit: boolean = true;
  // 表单巡检项模版
  public formTemplateColumn: FormItem[] = [];
  // 巡检项模板实例
  private formTemplateStatus: FormOperate;
  // 巡检模板表单实例
  private formStatus: FormOperate;
  // 页面类型
  private pageType: string;
  // 是否可编辑
  private disabledIf: boolean = false;
  // 模板名称
  private templateName: string;
  // 巡检总数
  private inspectionCount: number;
  // 巡检项名称
  private inputItemValue: string = '';
  // 备注
  private inputRemarkValue: string = '';

  constructor(
    private $activatedRoute: ActivatedRoute,
    private $nzI18n: NzI18nService,
    private $modelService: NzModalService,
    private $modalService: FiLinkModalService,
    private $ruleUtil: RuleUtil,
    private $inspectionWorkOrderService: InspectionWorkOrderService,
  ) { }

  public ngOnInit(): void {
    this.InspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.getInspectionTotal();
    this.judgePageJump();
    this.initTemplateColumn();
    const that = this;
    // 鼠标点击空白处收起列表行编辑
    $('body').on('click', function(event) {
      const flag = $(event.target).hasClass('text-area');
      const dom = $(event.target).parents('.for-text');
      if (!flag && (!dom || dom.length === 0)) {
        that.editId = null;
      }
    });
  }
  public ngOnDestroy(): void {
    // 移除body点击事件
    $('body').off('click');
  }

  /***
   * 获取巡检项最大数量
   */
  private getInspectionTotal(): void {
    this.$inspectionWorkOrderService.getInspectionTotal('1').subscribe((result: ResultModel<InspectionTemplateConfigModel>) => {
      if (result.code === ResultCodeEnum.success) {
        this.inspectionCount = Number(result.data.value);
        this.addBtnClass = true;
      }
    }, () => {
      this.addBtnClass = false;
    });
  }

  /**
   * 删除行
   * @param data 行数据
   */
  public deleteRow(data: SelectTemplateModel): void {
    if (this.listOfData.length === 1) {
      this.$modalService.error(this.InspectionLanguage.noneDelete);
      return;
    }
    const modal = this.$modelService.confirm({
      nzTitle: this.InspectionLanguage.prompt,
      nzContent: this.InspectionLanguage.isDeleteTemplate,
      nzOkType: 'default',
      nzMaskClosable: false,
      nzCancelText: this.InspectionLanguage.handleOk,
      nzOkText: this.InspectionLanguage.handleCancel,
      nzOnOk: () => { },
      nzOnCancel: () => {
        this.listOfData = this.listOfData.filter(d => d.templateItemId !== data.templateItemId);
        this.formStatus.resetControlData('templateItemName', this.listOfData.length);
        modal.destroy();
      },
    });
  }

  /**
   * 开始编辑
   * @param templateId 模板id
   * @param event 鼠标事件对象
   */
  public startEdit(templateId: string, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.editId = templateId;
  }
  /**
   * 判断页面跳转
   */
  private judgePageJump(): void {
    this.$activatedRoute.queryParams.subscribe(params => {
      this.pageType = params.status;
      if (params.procId && this.pageType === OperateTypeEnum.update) {
        this.procId = params.procId;
        this.pageTitle = `${this.InspectionLanguage.edit} ${this.InspectionLanguage.inspectionTemplate}`;
        this.$inspectionWorkOrderService.getTemplateInfo(this.procId).subscribe((result: ResultModel<InspectionTemplateModel>) => {
          if (result.code === ResultCodeEnum.success) {
            this.defaultData(result.data);
          }
        });
      } else {
        this.disabledIf = false;
        this.pageTitle = `${this.InspectionLanguage.addArea} ${this.InspectionLanguage.inspectionTemplate}`;
      }
      this.initColumn();
    });
  }

  /**
   * 初始化form表单
   */
  private initColumn(): void {
    this.formColumn = [
      { // 模板名称
        label: this.InspectionLanguage.templateName,
        key: 'templateNames',
        type: 'input',
        width: 300,
        require: true,
        disabled: this.disabledIf,
        placeholder: this.InspectionLanguage.pleaseEnter,
        rule: [
          {required: true},
          RuleUtil.getNameMinLengthRule(),
          RuleUtil.getNameMaxLengthRule(),
          RuleUtil.getAlarmNamePatternRule(this.InspectionLanguage.nameCodeMsg)
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value => this.$inspectionWorkOrderService.checkTemplateName(value.replace(/(^\s*)|(\s*$)/g, ''), this.procId),
            res => res.code === ResultCodeEnum.success)
        ],
        modelChange: (controls, event, key, formOperate) => {
          this.templateName = CommonUtil.trim(event);
        }
      },
      {// 巡检项
        label: this.InspectionLanguage.inspectionItem,
        key: 'templateItemName',
        type: 'custom',
        require: true,
        template: this.addTemplate,
        rule: [],
        asyncRules: [],
      },
      {// 巡检项
        label: '',
        key: 'template',
        type: 'custom',
        template: this.tempTable,
        rule: [],
        asyncRules: [],
      },
    ];
  }
  /**
   * 接受表单传进来的参数并赋值
   * @param event 表单对象
   */
  public formInstance(event: {instance: FormOperate}): void {
    this.formStatus = event.instance;
    this.formStatus.group.valueChanges.subscribe(param => {
      if (CommonUtil.trim(param.templateNames) && this.listOfData.length > 0) {
        // 校验添加弹窗是否打开
        if (this.xcVisible) {
          const itemData = this.formTemplateStatus.getData();
          // 名称或者备注都未填写
          if (!itemData.templateName && !itemData.remark) {
            this.idFormDisabled = true;
          } else {
            this.idFormDisabled = this.formTemplateStatus.getValid();
          }
        } else {
          // 添加窗未打开不用校验添加内容
          this.idFormDisabled = true;
        }
      } else {
        this.idFormDisabled = false;
      }
    });
  }

  /**
   * 校验名称
   */
  private checkName(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.$inspectionWorkOrderService.checkTemplateName(this.templateName, this.procId).subscribe((result: ResultModel<string>) => {
        resolve(result.code === ResultCodeEnum.success);
      });
    });
  }
  /**
   * 添加/修改/
   */
  public saveTemplateData(): void {
    if (this.noRepeatData()) {
      return;
    }
    if (this.xcVisible) {
      const itemData = this.formTemplateStatus.getData();
      if (itemData.templateName && itemData.templateName.length > 32) {
        return;
      }
      if (itemData.templateRemark && itemData.templateRemark.length > 255) {
        return;
      }
    }
    const data = this.formStatus.group.getRawValue();
    const newArr = [];
    if (!data.templateNames || data.templateNames === '') {
      this.$modalService.error(this.InspectionLanguage.hasNullValue);
      return;
    }
    this.isLoading = true;
    this.listOfData.forEach(v => {
      if (v.templateItemName && v.templateItemName.length > 0) {
        newArr.push({
          sort: '',
          templateItemName: v.templateItemName,
          templateItemId: v.templateItemId,
          remark: v.remark,
        });
      }
    });
    for (let i = 0; i < newArr.length; i++) {
      newArr[i].sort = (i + 1).toString();
    }
    const param = new SelectTemplateModel();
    param.templateName = CommonUtil.trim(data.templateNames);
    param.inspectionTemplateItemList = newArr;
    if (this.pageType === OperateTypeEnum.add) {
      // 调用新增接口
      this.$inspectionWorkOrderService.addInspectionTemplate(param).subscribe((result: ResultModel<string>) => {
        this.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.goBack();
          this.$modalService.success(this.InspectionLanguage.operateMsg.addSuccess);
        } else {
          this.$modalService.error(result.msg);
        }
      }, () => {
        this.isLoading = false;
      });
    } else if (this.pageType === OperateTypeEnum.update) {
      param.templateId = this.procId;
      // 调用修改接口
      this.$inspectionWorkOrderService.updateTemplate(param).subscribe((result: ResultModel<string>) => {
        this.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.goBack();
          this.$modalService.success(this.InspectionLanguage.operateMsg.editSuccess);
        } else {
          this.$modalService.error(result.msg);
        }
      }, () => {
        this.isLoading = false;
      });
    }
  }
  /**
   * 返回
   */
  public goBack(): void {
    window.history.back();
  }

  /**
   * 获取初始值
   * @param data 行数据
   */
  private defaultData(data: InspectionTemplateModel): void {
    this.formStatus.resetControlData('templateNames', data.templateName);
    const arr = [];
    data.inspectionTemplateItemList.forEach(v => {
      arr.push({
        templateItemId: v.templateItemId,
        templateItemName: v.templateItemName,
        remark: v.remark,
        option: this.InspectionLanguage.delete
      });
    });
    this.listOfData = arr;
    this.formStatus.resetControlData('templateItemName', this.listOfData.length);
  }

  /**
   * 打开弹窗
   */
  public showAddModel(): void {
    if (this.addBtnClass) {
      this.xcVisible = true;
      // 展开
      $('.temp-form').slideDown();
    }
  }
  /**
   * 取消
   */
  public handleCancel() {
    this.xcVisible = false;
    this.inputItemValue = '';
    this.inputRemarkValue = '';
    this.clearSubmitData();
    // 收起
    $('.temp-form').slideUp();
  }

  /**
   * 添加巡检项确定
   */
  public handleOk(): void {
    if (!this.inspectionCount || !this.addBtnClass) {
      return;
    }
    if (this.listOfData.length >= this.inspectionCount) {
      this.$modalService.error(this.InspectionLanguage.inspectionMaxTotal + this.inspectionCount.toString());
      return;
    }
    this.setSubmitData();
    let flag = true;
    if (CommonUtil.trim(this.inputItemValue) === '') {
      this.$modalService.error(this.InspectionLanguage.pleaseEnterInspectItem);
      return;
    } else {
      if (this.inputRemarkValue && this.inputRemarkValue.length > 255) {
        return;
      }
      this.listOfData.forEach(v => {
        if (v.templateItemName === this.inputItemValue) {
          flag = false;
          return;
        }
      });
    }
    if (flag) {
      this.listOfData.push({
        templateItemId: CommonUtil.getUUid(),
        templateItemName: CommonUtil.trim(this.inputItemValue),
        remark: this.inputRemarkValue ? CommonUtil.trim(this.inputRemarkValue) : '',
        option: this.InspectionLanguage.delete
      });
      this.inputItemValue = '';
      this.inputRemarkValue = '';
      this.clearSubmitData();
      this.formStatus.resetControlData('templateItemName', this.listOfData.length);
    } else {
      this.$modalService.error(this.InspectionLanguage.inspectItemNameDuplicate);
    }
  }

  /**
   * 校验巡检项
   */
  public checkValue(): void {
    if (!this.xcVisible) {
      return;
    }
    this.setSubmitData();
    const value = CommonUtil.trim(this.inputItemValue);
    const remarkValue = CommonUtil.trim(this.inputRemarkValue);
    this.canCommit = value.length === 0 || value.length > 32 || (remarkValue && remarkValue.length > 255);
  }

  public formTemplateInstance(event): void {
    this.formTemplateStatus = event.instance;
  }

  /**
   * 表格初始化
   */
  private initTemplateColumn(): void {
    this.formTemplateColumn = [
      { // 巡检项
        label: this.InspectionLanguage.inspectionItem,
        key: 'templateName',
        type: 'input',
        require: true,
        placeholder: this.InspectionLanguage.pleaseEnter,
        rule: [
          {required: true},
          RuleUtil.getNameMinLengthRule(),
          RuleUtil.getNameMaxLengthRule(),
          RuleUtil.getAlarmNamePatternRule(this.InspectionLanguage.nameCodeMsg)
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        modelChange: (controls, event, key, formOperate) => {
          this.checkValue();
          this.formStatus.resetControlData('template', event);
        }
      },
      {// 备注
        label: this.InspectionLanguage.remark,
        key: 'templateRemark',
        type: 'textarea',
        rule: [
          this.$ruleUtil.getRemarkMaxLengthRule(),
          this.$ruleUtil.getNameRule(),
          this.$ruleUtil.getNameRule()
        ],
        modelChange: (controls, event, key, formOperate) => {
          this.formStatus.resetControlData('template', event);
        }
      },
    ];
  }
  /**
   * 表单数据转换
   */
  public setSubmitData(): void {
    const formData = this.formTemplateStatus.getData();
    this.inputItemValue = formData.templateName;
    this.inputRemarkValue = formData.templateRemark;
  }

  /**
   * 表单数据清空
   */
  public clearSubmitData(): void {
    this.formTemplateStatus.resetControlData('templateName' , '');
    this.formTemplateStatus.resetControlData('templateRemark' , '');
  }

  /**
   * 去重处理/必填项为空判断处理
   */
  public noRepeatData(): boolean {
    let isNoValid = false;
    const nameList = this.listOfData.map(entity => entity.templateItemName);
    const newArr = [... new Set(nameList)];
    if (newArr.length !== nameList.length) {
      this.$modalService.error(this.InspectionLanguage.inspectItemNameDuplicate);
      isNoValid = true;
    }
    newArr.forEach(name => {
      if (!name || name.length === 0) {
        this.$modalService.error(this.InspectionLanguage.hasNullValue);
        isNoValid = true;
        return;
      }
    });
    return isNoValid;
  }
}
