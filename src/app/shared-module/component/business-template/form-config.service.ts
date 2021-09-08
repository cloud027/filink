import { Injectable } from '@angular/core';
import {FormItem} from '../form/form-config';
import {NzI18nService} from 'ng-zorro-antd';

@Injectable()
export class FormConfigService {
  // 名称
  nameItem: FormItem;
  // 行列数
  ranksItem: FormItem;
  // 单双面
  singleDoubleSideItem: FormItem;
  // 方向
  directionItem: FormItem;
  // 国际化
  language: any;
  constructor( private $nzI18n: NzI18nService) {
    this.language = $nzI18n.getLocale();
    this.nameItem = {
      label: this.language.facility.template.name,
      key: 'name',
      type: 'input',
      labelHeight: 400,
      rule: [],
      asyncRules: [],
    };

    this.ranksItem = {
      label: this.language.systemSetting.menuId,
      key: 'menuInfoTrees',
      type: 'custom',
      labelHeight: 400,
      require: true,
      rule: [],
      asyncRules: [],
    };

    this.singleDoubleSideItem = {
      label: this.language.systemSetting.enable,
      key: 'templateStatus',
      type: 'radio',
      radioInfo: {
        data: [{
          label: this.language.systemSetting.selectEnable,
          value: '1'
        },
          {
            label: this.language.systemSetting.prohibit,
            value: '0'
          }],
        label: 'label',
        value: 'value'
      },
      rule: [], asyncRules: []
    };

    this.directionItem = {
      label: this.language.systemSetting.enable,
      key: 'templateStatus',
      type: 'radio',
      radioInfo: {
        data: [{
          label: this.language.systemSetting.selectEnable,
          value: '1'
        },
          {
            label: this.language.systemSetting.prohibit,
            value: '0'
          }],
        label: 'label',
        value: 'value'
      },
      rule: [], asyncRules: []
    };
  }

  /**
   * 获取框模板配置
   * param objItem
   */
  getBoxFormConfig(objItem: any) {
    const formColumn: FormItem[] = [
      this.nameItem,
      this.ranksItem,
      this.singleDoubleSideItem,
      this.directionItem,
    ];
    return formColumn;
  }

  /**
   * 获取框模板配置
   * param objItem
   */
  getFrameConfig(objItem: any) {
    const formColumn: FormItem[] = [
      this.nameItem,
      this.ranksItem,
    ];
    return formColumn;
  }

  /**
   * 获取盘模板配置
   * param objItem
   */
  getBoardConfig(objItem: any) {
    const formColumn: FormItem[] = [
      this.nameItem,
      this.ranksItem,
      this.singleDoubleSideItem,
    ];
    return formColumn;
  }
}
