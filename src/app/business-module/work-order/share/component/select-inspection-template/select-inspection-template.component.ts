import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {InspectionLanguageInterface} from '../../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {SelectTemplateModel} from '../../model/template/select-template.model';
import {InspectionTemplateModel} from '../../model/template/inspection-template.model';
import {RuleUtil} from '../../../../../shared-module/util/rule-util';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../../shared-module/component/form/form-operate.service';
import {InspectionWorkOrderService} from '../../service/inspection';
import {TemplateModalModel} from '../../model/template/template-modal.model';
import {InspectionItemForm} from '../../model/template/inspection-item-form.model';

/**
 * 选择模版组件
 */
@Component({
  selector: 'app-select-inspection-template',
  templateUrl: './select-inspection-template.component.html',
  styleUrls: ['./select-inspection-template.component.scss']
})
export class SelectInspectionTemplateComponent implements OnInit {
  @Input()
  set xcVisible(params) {
    this._xcVisible = params;
    this.xcVisibleChange.emit(this._xcVisible);
  }
  get xcVisible() {
    return this._xcVisible;
  }
  @Input() modalParams: TemplateModalModel;
  // 显示隐藏变化
  @Output() xcVisibleChange = new EventEmitter<boolean>();
  // 选中的值变化
  @Output() selectDataChange = new EventEmitter<any>();
  // 国际化
  public language: InspectionLanguageInterface;
  // 列表数据
  public listData: SelectTemplateModel[] = [];
  // 模板数据
  public templateList: SelectTemplateModel[] = [];
  // radio值
  public radioValue: string = '';
  // 全选
  public allChecked: boolean = false;
  public indeterminate: boolean = true;
  // 上次操作
  public lastInspection: SelectTemplateModel[] = [];
  // 是否添加
  public isCreat: boolean = false;
  // 巡检项loading
  public isItemSpinning: boolean = true;
  // 巡检模板
  public isTempSpinning: boolean = true;
  // 内容高度
  public boxHeight: string = '80px';
  // 是否可以新增
  public isAddTemp: boolean = true;
  // 表单
  public formColumn: FormItem[] = [];
  // 是否可保存
  public isSave: boolean = false;
  // 表单实例
  private formStatus: FormOperate;
  // 显示隐藏
  private _xcVisible: boolean = false;
  // 被编辑的id
  private editId: string | null;
  // 当前选择的模板
  private selectTemplateData: InspectionTemplateModel;
  // 输入巡检项
  private inputItemValue: string = '';
  // 输入备注
  private inputRemarkValue: string;

  constructor(
    public $nzI18n: NzI18nService,
    public $message: FiLinkModalService,
    private $ruleUtil: RuleUtil,
    private $inspectionWorkOrderService: InspectionWorkOrderService,
  ) { }

  /**
   * 初始化模版入口
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.getTemplateListData();
    this.initTemplateColumn();
  }

  /**
   * 初始化模版和巡检项
   */
  private initSelectTemplateData(): void {
    if (this.modalParams.selectTemplateData) {
      this.radioValue = this.modalParams.selectTemplateData.templateId;
    } else {
      this.radioValue = this.templateList[0].templateId;
    }
    this.getTemplateDetail1(this.radioValue, '');
  }

  /**
   * 获取巡检模板数据
   */
  public getTemplateListData(): void {
    // 列表数据
    this.$inspectionWorkOrderService.selectTemplate({}).subscribe((result: ResultModel<SelectTemplateModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        if (result.data.length > 0) {
          this.templateList = result.data ? result.data : [];
          this.initSelectTemplateData();
          this.boxHeight = '252px';
          this.isAddTemp = false;
          this.isSave = true;
        }
        this.isTempSpinning = false;
        this.isItemSpinning = false;
      }
    }, () => {
      this.isTempSpinning = false;
      this.isItemSpinning = false;
    });
  }

  /**
   * 取消动作
   */
  public handleCancel(): void {
    this.xcVisible = false;
  }

  /**
   * 确认动作
   */
  public handleOk(): void {
    if (this.isCreat) {
      const formData = this.formStatus.getData();
      if (formData.templateName && formData.templateName.length > 32) {
        return;
      }
      if (formData.templateRemark && formData.templateRemark.length > 255) {
        return;
      }
    }
    if (this.listData.length > 0) {
      if (this.listData.every(v => v.checked === false)) {
        this.$message.error(this.language.chooseItem);
        return;
      }
      const checkedItemList = this.listData.filter(data => data.checked === true);
      this.selectTemplateData.inspectionTemplateItemList = checkedItemList;
      this.selectTemplateData.inspectionItemList = checkedItemList;
      if (!this.selectTemplateData.templateId) {
        this.selectTemplateData.templateId = this.modalParams.selectTemplateData.templateId;
      }
      if (!this.selectTemplateData.templateName) {
        this.selectTemplateData.templateName = this.modalParams.selectTemplateData.templateName;
      }
      this.selectDataChange.emit(this.selectTemplateData);
      this.handleCancel();
    }
  }

  /**
   * 根据模板id查询巡检项
   * @param templateId 模板id
   * @param type 选择类型
   */
  public getTemplateDetail1(templateId: string, type: string): void {
    this.isItemSpinning = true;
    this.$inspectionWorkOrderService.getTemplateInfo(templateId).subscribe((result: ResultModel<InspectionTemplateModel>) => {
      if (result.code === ResultCodeEnum.success) {
        let itemList = [];
        // 查询成功后赋值
        this.selectTemplateData = new InspectionTemplateModel();
        // 判断返回值是否有模板id
        if (result.data && result.data.templateId) {
          itemList = result.data.inspectionTemplateItemList ? result.data.inspectionTemplateItemList : [];
          this.selectTemplateData = result.data;
        } else {
          this.selectTemplateData.templateId = this.modalParams.selectTemplateData.templateId;
          itemList = this.modalParams.selectTemplateData.inspectionItemList;
        }
        this.listData = [];
        const isSelectTemplate = this.modalParams.selectTemplateData && this.modalParams.selectTemplateData.templateId === templateId;
        this.listData = [...itemList];
        // 已有模版勾选状态
        if (isSelectTemplate) {
          this.getSelectInspectionItemList(this.listData, this.modalParams.selectTemplateData.inspectionItemList);
          this.allChecked = (this.listData.length === this.modalParams.selectTemplateData.inspectionItemList.length);
          // 全勾选刷新
          if (this.allChecked) {
            this.updateAllChecked();
          }
        } else {  // 初始化勾选状态
          this.listData.forEach(v => {v.checked = false; });
          this.allChecked = false;
          this.updateAllChecked();
        }
        this.isItemSpinning = false;
        this.lastEdit();
      }
    }, () => {
      this.isItemSpinning = false;
    });
  }
  /**
   * 获取选中的巡检项
   */
  private getSelectInspectionItemList(itemList: InspectionItemForm[], selectItemList: InspectionItemForm[]): void {
    // 初始化服务器巡检项
    itemList.forEach(v => {v.checked = false; });
    for (let i = 0; i < itemList.length; i++) {
      for (let k = 0; k < selectItemList.length; k++) {
        if (selectItemList[k].templateItemId === itemList[i].templateItemId) {
          itemList[i].checked = true;
          continue;
        }
      }
    }
    // 重组服务器巡检项和本地新增巡检项
    for (let i = 0; i < selectItemList.length; i++) {
      let isNotExist = false;
      for (let k = 0; k < itemList.length; k++) {
        if (selectItemList[i].templateItemId === itemList[k].templateItemId) {
          isNotExist = true;
          continue;
        }
      }
      if (!isNotExist) {
        this.listData.push(selectItemList[i]);
      }
    }
  }

  /**
   * 全选
   */
  public updateAllChecked(): void {
    this.indeterminate = false;
    this.lastInspection = [];
    if (this.allChecked) {
      this.listData = this.listData.map(item => {
        this.lastInspection.push(item);
        return {
          ...item,
          checked: true
        };
      });
    } else {
      this.listData = this.listData.map(item => {
        return {
          ...item,
          checked: false
        };
      });
    }
  }

  /**
   * 行内复选框
   * @param data 行数据
   */
  public updateSingleChecked(data: SelectTemplateModel): void {
    if (this.listData.every(item => item.checked === false)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.listData.every(item => item.checked === true)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
    if (data.checked) {
      this.lastEdit();
    } else {
      this.lastInspection.forEach((v, index) => {
        if (data.templateItemId === v.templateItemId) {
          this.lastInspection.splice(index, 1);
        }
      });
    }
  }

  /**
   * 添加行
   */
  public addTemplateRow(): void {
    this.setSubmitData();
    const value = CommonUtil.trim(this.inputItemValue);
    const remarkValue = CommonUtil.trim(this.inputRemarkValue);
    const templateItemId = CommonUtil.getUUid();
    this.editId = templateItemId;
    let flag = true;
    if (value.length === 0 || value.length > 32) {
      return;
    } else {
      if (remarkValue && remarkValue.length > 255) {
        return;
      } else {
        this.listData.forEach(v => {
          if (v.templateItemName === this.inputItemValue) {
            flag = false;
            return;
          }
        });
      }
    }
    if (flag) {
      this.listData.push({
        remark: this.inputRemarkValue,
        sort: `${this.listData.length + 1}`,
        templateItemId: templateItemId,
        templateId: this.selectTemplateData.templateId,
        templateItemName: this.inputItemValue,
        isAdd: true,
        checked: true,
      });
      this.lastInspection.push({
        templateItemId: templateItemId,
        templateItemName: this.inputItemValue
      });
      this.inputItemValue = '';
      this.inputRemarkValue = '';
      this.clearSubmitData();
      this.lastEdit();
    } else {
      this.$message.error(this.language.inspectItemNameDuplicate);
      this.inputItemValue = '';
      this.inputRemarkValue = '';
    }
  }

  /**
   * 删除行
   */
  public deleteRow(templateItemId: string): void {
    for (let i = 0; i < this.listData.length; i++) {
      if (this.listData[i].templateItemId === templateItemId) {
        this.listData.splice(i, 1);
        break;
      }
    }
    this.lastInspection.forEach((entity, index) => {
      if (entity.templateItemId === templateItemId) {
        this.lastInspection.splice(index, 1);
      }
    });
  }

  /**
   * 删除已选择巡检项
   * @param item 行数据
   * @param index 索引
   */
  public deleteItem(item: SelectTemplateModel, index: number): void {
    this.lastInspection.splice(index, 1);
    this.listData.forEach(v => {
      if (v.templateItemId === item.templateItemId) {
        v.checked = false;
      }
    });
  }

  /***
   * 编辑
   * @param item 行数据
   */
  public editTemplate(item: SelectTemplateModel): void {
    if (item.isAdd) {
      this.editId = item.templateItemId;
    }
  }
  /**
   * 上次操作内容
   */
  private lastEdit(): void {
    this.lastInspection = [];
    this.listData.forEach(v => {
      if (v.checked) {
        this.lastInspection.push({
          templateItemId: v.templateItemId,
          templateItemName: v.templateItemName
        });
      }
    });
  }
  /**
   * 已有模板选择
   */
  public selectValue(): void {
    this.getTemplateDetail1(this.radioValue, 'select');
    this.allChecked = false;
  }

  /**
   * 添加行数据
   */
  public saveRow(): void {
    this.isCreat = true;
  }

  /**
   * 关闭新增
   */
  public closeAdd(): void {
    this.isCreat = false;
  }

  /**
   * form表单事件
   */
  public formInstance(event): void {
    this.formStatus = event.instance;
  }

  /**
   * 初始化form表单
   */
  private initTemplateColumn(): void {
    this.formColumn = [
      { // 巡检项
        label: this.language.inspectionItem,
        key: 'templateName',
        type: 'input',
        col: 24,
        width: 500,
        require: true,
        placeholder: this.language.pleaseEnter,
        rule: [
          {required: true},
          RuleUtil.getNameMinLengthRule(),
          RuleUtil.getNameMaxLengthRule(),
          this.$ruleUtil.getNameRule()
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
      {// 备注
        label: this.language.remark,
        key: 'templateRemark',
        type: 'textarea',
        width: 500,
        col: 24,
        rule: [
          this.$ruleUtil.getRemarkMaxLengthRule(),
          this.$ruleUtil.getNameRule(),
          this.$ruleUtil.getNameRule()],
      },
    ];
  }

  /**
   * 表单数据转换
   */
  public setSubmitData(): void {
    const formData = this.formStatus.group.getRawValue();
    this.inputItemValue = formData.templateName;
    this.inputRemarkValue = formData.templateRemark;
  }

  /**
   * 表单数据清空
   */
  public clearSubmitData(): void {
    this.formStatus.resetControlData('templateName' , '');
    this.formStatus.resetControlData('templateRemark' , '');
  }
}
