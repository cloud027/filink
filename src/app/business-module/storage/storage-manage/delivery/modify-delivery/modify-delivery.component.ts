import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {StorageLanguageInterface} from '../../../../../../assets/i18n/storage/storage.language.interface';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../../shared-module/component/form/form-operate.service';
import {Router} from '@angular/router';
import {RuleUtil} from '../../../../../shared-module/util/rule-util';
import {StorageApiService} from '../../../share/service/storage-api.service';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {DeliveryListModel} from '../../../share/model/delivery-list.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {DELIVERY_NUM_EMPTY} from '../../../share/const/storage.const';
import * as _ from 'lodash';
/**
 * 修改物料出库页面
 */
@Component({
  selector: 'app-modify-delivery',
  templateUrl: './modify-delivery.component.html',
  styleUrls: ['./modify-delivery.component.scss']
})
export class ModifyDeliveryComponent implements OnInit {
  // 是否显示编辑弹窗
  @Input() public showUpdateDeliveryModel: boolean = false;
  // 是否展示修改出库物料数量的弹窗
  @Input() public showEditDeliveryNum: boolean = false;
  // 当前修改数量所选的物料数据
  @Input() public editDeliveryData;
  @Input() public deliveryId: string;
  // 弹窗显示变化
  @Output() public visibleChange = new EventEmitter<boolean>();
  // 编辑确定事件
  @Output() public handleOkEvent = new EventEmitter();
  // 国际化
  public storageLanguage: StorageLanguageInterface;
  public commonLanguage: CommonLanguageInterface;
  // 修改出库数量表单配置
  public editNumFormColumn: FormItem[] = [];
  // 修改出库数量表单确认按钮是否可以点击
  public isEditNumDisabled: boolean = true;
  // 修改出库数量确认按钮加载状态
  public isEditNumLoading: boolean = false;
  // 表单是否在加载状态
  public isSpin: boolean = false;
  // 修改出库数量的表单操作实现类
  private formEditStatus: FormOperate;

  constructor(public $nzI18n: NzI18nService,
              public $router: Router,
              public $storageService: StorageApiService,
              public $message: FiLinkModalService,
              private $ruleUtil: RuleUtil) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 初始国际化
    this.storageLanguage = this.$nzI18n.getLocaleData(LanguageEnum.storage);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // 初始化表单
    this.initEditNumForm();
    if (this.deliveryId) {
      this.queryDeliveryById();
    }
  }


  /**
   * 获取修改数量表单实例对象
   */
  public editNumInstance(event: { instance: FormOperate }): void {
    this.formEditStatus = event.instance;
    this.formEditStatus.group.statusChanges.subscribe(() => {
      this.isEditNumDisabled = !this.formEditStatus.getRealValid();
    });
    // 当前编辑的出库物料数据，给表单中的物料数量和出库数量赋值
    if (!_.isEmpty(this.editDeliveryData)) {
      this.formEditStatus.resetControlData('remainingNum', this.editDeliveryData.remainingNum);
      if(this.editDeliveryData.deliveryNum !== '--') {
        this.formEditStatus.resetControlData('deliveryNum', this.editDeliveryData.deliveryNum);
      }
    }
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
    const data = this.formEditStatus.group.getRawValue();
    this.handleOkEvent.emit(data);
  }

  /**
   * 初始化编辑出库数量表单数据
   */
  private initEditNumForm(): void {
    this.editNumFormColumn = [
      {
        // 物料数量
        label: this.storageLanguage.materialNum,
        key: 'remainingNum',
        type: 'input',
        col: 24,
        require: true,
        disabled: true,
        rule: [{required: true}]
      },
      {
        // 出库数量
        label: this.storageLanguage.deliveryNum,
        key: 'deliveryNum',
        type: 'input',
        col: 24,
        require: true,
        placeholder: this.storageLanguage.editNumberTips,
        rule: [{required: true}, this.$ruleUtil.positiveInteger(), RuleUtil.getNameMinLengthRule()],
        asyncRules: [
          {
            // 异步校验出库数量是否大于当前入库的数量并给出提示信息
            asyncRule: (control: FormControl) => {
              return Observable.create(observer => {
                if (control.value <= this.editDeliveryData.remainingNum) {
                  observer.next(null);
                  observer.complete();
                } else {
                  observer.next({error: true, duplicated: true});
                  observer.complete();
                }
              });
            },
            asyncCode: 'duplicated', msg: this.storageLanguage.editNumberTips
          }
        ]
      }
    ];
  }

  /**
   * 出库数据编辑回显
   */
  public queryDeliveryById(): void {
    this.isSpin = true;
    this.$storageService.queryDeliveryById(this.deliveryId).subscribe((res: ResultModel<DeliveryListModel>) => {
      this.isSpin = false;
      if (res.code === ResultCodeEnum.success) {
        this.editDeliveryData = res.data;
        this.formEditStatus.resetData(res.data);
        if (this.editDeliveryData.deliveryNum === DELIVERY_NUM_EMPTY) {
          this.formEditStatus.resetControlData('deliveryNum', '');
        }
      }
    }, () => {
      this.isSpin = false;
    });
  }
}
