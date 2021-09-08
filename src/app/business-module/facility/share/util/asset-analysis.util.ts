import {AreaModel} from '../../../../core-module/model/facility/area.model';

export class AssetAnalysisUtil {
    /**
     * 初始化单位选择器配置
     */
    public static initTreeSelectorConfig(that): void {
        const treeSetting = {
            check: {
                enable: true,
                chkStyle: 'checkbox',
                chkboxType: {'Y': '', 'N': ''},
            },
            data: {
                simpleData: {
                    enable: false,
                    idKey: 'areaId',
                },
                key: {
                    name: 'areaName',
                    children: 'children'
                },
            },
            view: {
                showIcon: false,
                showLine: false
            }
        };
        that.treeSelectorConfig = {
            title: that.selectArea,
            width: '1000px',
            height: '300px',
            treeNodes: that.treeNodes,
            treeSetting: treeSetting,
            onlyLeaves: false,
            selectedColumn: [
                {
                    title: that.language.assetAnalysis.areaName, key: 'areaName', width: 100,
                },
                {
                    title: that.language.assetAnalysis.areaLevel, key: 'areaLevel', width: 100,
                }
            ]
        };
    }

    /**
     * 添加区域树数据
     */
    public static addName(data: AreaModel[]): void {
        data.forEach(item => {
            item.id = item.areaId;
            item.value = item.areaId;
            item.areaLevel = item.level;
            if (item.children && item.children.length) {
                this.addName(item.children);
            }
        });
    }

    /**
     * 递归获取区域的areaId和areaName
     * @param data 区域树数据
     */
    public static selectAllArea(data: AreaModel[], that) {
        const allAreaNameList = [];
        data.forEach(item => {
            that.allAreaIdList.push(item.areaId);
            that.selectAreaIds.push(item.areaId);
            allAreaNameList.push(item.areaName);
            if (item.children && item.children.length) {
                this.selectAllArea(item.children, that);
            }
        });
        that.allAreaName = allAreaNameList.toString();
        that.areaName = allAreaNameList.toString();
    }
}
