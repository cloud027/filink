import { NzI18nService } from 'ng-zorro-antd';

// ------------------------------------------ 能耗统计------------------------------------------------------
/** 时间范围 */
export enum energyStatisticsTime {
    statisticsHour = 'hours', // 逐时统计
    statisticsDay = 'day', // 逐天统计
    statisticsMonth = 'month' // 逐月统计
}
/** 统计范围 */
export enum energyStatisticsRange {
    statisticsProject = 'statisticsProject', // 项目
    statisticsRegion = 'statisticsRegion', // 区域
}
/** Ecahrts 图表 时间段区域 */
enum EcahrtsTextTimeSlot {
    ActualElectricityConsumption = 'ActualElectricityConsumption',
    TargetPowerConsumption = 'TargetPowerConsumption',
    EnergySavingRate = 'EnergySavingRate',
}
/** Ecahrts 图表 电费排名 */
enum EchartsTextElectricityTariffRank {
    Proportion = 'Proportion',
    electricityFees= 'electricityFees'
}

// 时间范围
export function getStatisticsTime(i18n: NzI18nService, code = null): any {
    return codeTranslate(energyStatisticsTime, i18n, code);
}

// 统计范围
export function getStatisticsRange(i18n: NzI18nService, code = null): any {
    return codeTranslate(energyStatisticsRange, i18n, code);
}

// Ecahrts 图表 时间段区域
export function getEcahrtsTextTimeSlot(i18n: NzI18nService, code = null): any {
    return codeTranslate(EcahrtsTextTimeSlot, i18n, code);
}

// Ecahrts 图表 电费排名
export function getEchartsTextElectricityTariffRank(i18n: NzI18nService, code = null): any {
    return codeTranslate(EchartsTextElectricityTariffRank, i18n, code);
}
// ------------------------------------------ 能耗统计------------------------------------------------------

/**
 * 枚举翻译
 */
function codeTranslate(codeEnum, i18n: NzI18nService, code = null) {
    if (code !== null) {
        for (const i of Object.keys(codeEnum)) {
            if (codeEnum[i] === code) {
                return i18n.translate(`energy.config.${i}`);
            }
        }
    } else {
        return Object.keys(codeEnum).map((key) => ({
            label: i18n.translate(`energy.config.${key}`),
            code: codeEnum[key]
        }));
    }
}
