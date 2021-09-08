import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {ProductApiService} from '../../share/service/product-api.service';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {ProductLanguageInterface} from '../../../../../assets/i18n/product/product.language.interface';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {ProductInfoModel} from '../../../../core-module/model/product/product-info.model';
import {EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {ProductFormTableModel} from '../../share/model/product-form-table.model';

/**
 * 产品模版配置组件
 * @author HePo
 */
@Component({
  selector: 'app-product-template',
  templateUrl: './product-template.component.html',
  styleUrls: ['./product-template.component.scss']
})
export class ProductTemplateComponent implements OnInit {

  // 产品对象
  public productInfo: ProductInfoModel = new ProductInfoModel();
  // 产品国际化词条
  public productLanguage: ProductLanguageInterface;
  // 公共国际化词条
  public commonLanguage: CommonLanguageInterface;
  // 页面是否加载
  public pageLoading: boolean = false;
  // 表单数据
  public formColumn: FormItem[] = [];
  // 表单实例
  public formStatus: FormOperate;
  // 设备配置模版每种模版不一样此处给any
  public configTemplate: any[] = [];
  // 确定按钮是否可以点击
  public saveBtnDisabled: boolean = true;
  // 设备枚举
  public equipmentEnum = EquipmentTypeEnum;
  // 设备类型
  private equipmentType: string = '';
  // 模板列表数据
  private tempTableData: ProductFormTableModel[] = [];

  /**
   * 构造器
   */
  constructor(
    private $nzI18n: NzI18nService,
    private $ruleUtil: RuleUtil,
    private $router: Router,
    private $message: FiLinkModalService,
    private $productApiService: ProductApiService,
    private $active: ActivatedRoute,
  ) {
  }

  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    this.productLanguage = this.$nzI18n.getLocaleData(LanguageEnum.product);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // 获取参数
    this.$active.queryParams.subscribe(params => {
      this.productInfo.supplier = params.supplier;
      this.productInfo.hardwareVersion = params.hardwareVersion;
      this.equipmentType = params.typeCode;
      this.productInfo.softwareVersion = params.softwareVersion;
      this.productInfo.productModel = params.productModel;
      this.productInfo.productId = params.productId;
    });
    // 根据产品id和产品型号查询产品的配置信息
    this.queryProductConfig();
  }

  /**
   * 取消
   */
  public onClickCancel(): void {
    this.$router.navigate(['business/product/product-list']).then();
  }

  /**
   * 表单实例化
   */
  public formInstance(event: { instance: FormOperate }, conf) {
    conf.formInstance = event;
    event.instance.group.valueChanges.subscribe(() => {
      this.saveBtnDisabled = this.formChecked();
      if (this.equipmentType === EquipmentTypeEnum.gateway && this.tempTableData.length > 0) {
        this.saveBtnDisabled = !(!this.saveBtnDisabled && this.tempTableData.length > 0);
      }
    });
  }

  /***
   * 回调
   */
  public checkCommit(list): void {
    this.tempTableData = list;
    if (this.equipmentType === EquipmentTypeEnum.gateway && this.tempTableData.length > 0) {
      this.saveBtnDisabled = !(!this.saveBtnDisabled && this.tempTableData.length > 0);
    }
  }
  /**
   * 保存设备配模版
   */
  public saveEquipmentTemplate(): void {
    this.pageLoading = true;
    // 获取每个表单的数据
    const body = {};
    this.configTemplate.forEach(item => {
      body[item.tabId] = {};
      if (!_.isEmpty(item.configurationsList)) {
        item.configurationsList.forEach(v => {
          body[item.tabId][v.id] = {};
          v.configurationList.forEach(form => {
            body[item.tabId][v.id][form.id] = form.formInstance.instance.group.getRawValue();
          });
        });
      }
      if (item.type === 'component') {
        body[item.tabId] = this.tempTableData;
      }
    });
    // 将数据转换成json字符串进行保存
    this.$productApiService.insertConfigTemplate({
      productId: this.productInfo.productId,
      equipmentTemplate: JSON.stringify(body)
    }).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        this.$message.success(this.productLanguage.saveTemplateSuccess);
        this.onClickCancel();
      } else {
        this.$message.error(res.msg);
      }
      this.pageLoading = false;
    }, () => this.pageLoading = false);
  }

  /**
   * 查询产品配置信息
   */
  private queryProductConfig(): void {
    this.$productApiService.queryConfigTemplateByProductId(this.productInfo).subscribe((res: ResultModel<any>) => {
      if (res.code === ResultCodeEnum.success) {
        this.pageLoading = true;
        // 表单字段实例化
        this.initForm(res.data);
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   *  根据产品id查询配置模版进行回显
   */
  private queryConfigTemplateJsonById(): void {
    this.$productApiService.queryTemplateJsonById(this.productInfo.productId).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        // 做数据回显
        if (res.data) {
          const backDisplayData = JSON.parse(res.data);
          if (!_.isEmpty(this.configTemplate)) {
            this.configTemplate.forEach(item => {
              if (!_.isEmpty(item.configurationsList)) {
                item.configurationsList.forEach(v => {
                  if (!_.isEmpty(v.configurationList)) {
                    v.configurationList.forEach(form => {
                      if (backDisplayData && backDisplayData[item.tabId] && backDisplayData[item.tabId][v.id][form.id]) {
                        form.formInstance.instance.resetData(backDisplayData[item.tabId][v.id][form.id]);
                      }
                    });
                  }
                });
              }
              if (item.type === 'component' && Object.keys(backDisplayData[item.tabId]).length > 0) {
                this.tempTableData = backDisplayData[item.tabId];
              } else {
                this.tempTableData = [];
              }
            });
            setTimeout(() => {
              if (this.equipmentType === EquipmentTypeEnum.gateway && this.tempTableData.length > 0) {
                this.saveBtnDisabled = !(!this.saveBtnDisabled && this.tempTableData.length > 0);
              }
            }, 1200);
          }
        }
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 表单实例化
   * onShow字段含义
   * 1 ： 配置展示产品展示
   * 2：  配置展示产品不展示
   * 3： 配置产品都不展示
   */
  private initForm(list): void {
    // 第一遍循环筛选属于产品的配置和需要显示的表单项
    const confList = [];
    list.forEach(item => {
      // 判断是否属于产品配置
      if (item.onShow === '1') {
        if (item.type === 'component') {
          item.configurationsList = [];
        }
        item.configurationsList.forEach(key => {
          key.configurationList.forEach(config => {
            const paramList = [];
            if (!_.isEmpty(config.configParamList)) {
              config.configParamList.forEach(form => {
                // 判断表单项是否需要展示
                if (form.display) {
                  paramList.push(form);
                }
              });
            }
            config.configParamList = paramList;
          });
        });
        confList.push(item);
      }
    });
    // 第二遍循环生成表单
    confList.forEach(item => {
      item.configurationsList.forEach(key => {
        key.configurationList.forEach(config => {
          config.formColumn = FormOperate.createColumnTemp(config.configParamList, null);
        });
      });
    });
    /*confList.push({
      configurationsList: [
        {
          commandId: null,
          configurationList: [],
          id: 'S001',
          name: '默认传感器配置',
          url: null
        }
      ],
      name: '默认传感器',
      onShow: '1',
      tabId: 'defaultSensorConfig',
      type: 'table'
    });*/
    this.configTemplate = confList;

    // 查询数据回显
    if (!_.isEmpty(confList)) {
      this.queryConfigTemplateJsonById();
    }
    this.pageLoading = false;
  }

  /**
   * 所有表单校验
   */
  private formChecked(): boolean {
    let pass = true;
    // 默认通过所有都通过校验
    this.configTemplate.forEach(item => {
      if (item.type !== 'component' && item.configurationsList.length > 0) {
        item.configurationsList.forEach(v => {
          v.configurationList.forEach(form => {
            // 如果有一个没有通过校验
            if (!form['formInstance'].instance.getValid()) {
              pass = false;
            }
          });
        });
      }
    });
    return !pass;
  }
}
