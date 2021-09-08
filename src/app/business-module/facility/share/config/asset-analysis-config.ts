import {CommonUtil} from '../../../../shared-module/util/common-util';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {ProductUnitEnum} from '../../../../core-module/enum/product/product.enum';
import {SelectModel} from '../../../../shared-module/model/select.model';

export class AssetAnalysisConfig {
    /**
     * 资产分析型号列表表格配置
     */
    public static productTableConfig(productLanguage, productTypeTemplate, unitTemplate, assetTypeSelectData, assetTypeData, $nzI18n) {
        return [
            {
                type: 'select',
                width: 50,
                fixedStyle: {fixedLeft: true, style: {left: '0px'}},
            },
            { // 序号
                type: 'serial-number',
                width: 62,
                title: productLanguage.serialNum,
                fixedStyle: {fixedLeft: true, style: {left: '50px'}},
            },
            { // 规格型号
                title: productLanguage.productModel, key: 'productModel', width: 150,
                isShowSort: true,
                searchable: true,
                searchConfig: {type: 'input'}
            },
            { // 类型
                title: productLanguage.model, key: 'typeCode', width: 150,
                type: 'render',
                renderTemplate: productTypeTemplate,
                isShowSort: true,
                searchable: true,
                searchConfig: {
                    type: 'select',
                    selectType: 'multiple',
                    selectInfo: this.getProductTypeSelect(assetTypeSelectData, assetTypeData),
                    label: 'label',
                    value: 'code'
                }
            },
            { // 软件版本
                title: productLanguage.softVersion, key: 'softwareVersion', width: 150,
                isShowSort: true,
                searchable: true,
                searchConfig: {type: 'input'}
            },
            { // 硬件版本
                title: productLanguage.hardWareVersion, key: 'hardwareVersion', width: 150,
                isShowSort: true,
                searchable: true,
                searchConfig: {type: 'input'}
            },
            { // 供应商
                title: productLanguage.supplier, key: 'supplierName', width: 150,
                isShowSort: true,
                searchable: true,
                searchConfig: {type: 'input'}
            },
            { // 产品功能
                title: productLanguage.productFeatures, key: 'description', width: 150,
                isShowSort: true,
                searchable: true,
                searchConfig: {type: 'input'}
            },
            { // 计量单位
                title: productLanguage.unit, key: 'unit', width: 100,
                type: 'render',
                renderTemplate: unitTemplate,
                isShowSort: true,
                searchable: true,
                searchConfig: {
                    type: 'select',
                    selectInfo: CommonUtil.codeTranslate(ProductUnitEnum, $nzI18n, null, LanguageEnum.product),
                    label: 'label',
                    value: 'code'
                }
            },
            { // 报废年限
                title: productLanguage.scrapTime, key: 'scrapTime', width: 100,
                isShowSort: true,
                searchable: true,
                searchConfig: {type: 'input'}
            },
            { // 操作列
                title: productLanguage.operate,
                searchable: true,
                searchConfig: {type: 'operate'},
                key: '', width: 180,
                fixedStyle: {fixedLeft: true, style: {right: '0px'}},
            },
        ];
    }

    /**
     * 获取产品类型下拉选
     */
    public static getProductTypeSelect(assetTypeSelectData, assetTypeData): SelectModel[] {
        let selectData = [];
        assetTypeSelectData.forEach(item => {
            selectData = selectData.concat(assetTypeData.filter(data => item === data.code));
        });
        return selectData;
    }
}
