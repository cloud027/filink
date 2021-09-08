import { NzI18nService } from 'ng-zorro-antd';

// 日志类型
export enum LogTypeCode {
    Operational_Log = 'findOperateLog',   // 操作日志
    Security_Log = 'findSecurityLog',     // 安全日志
    System_Log = 'findSystemLog'          // 系统日志
}

// 操作类型
export enum OptTypeCode {
    Web_Operational_Log = 'web',   // 网管操作日志
    PDA_Log = 'pda'                // pda日志
}

// 危险级别
export enum DangerLevelCode {
    Prompt = '1',   // 提示
    General = '2',  // 一般
    Danger = '3'    // 危险
}

// 日志统计类型
export enum LogStatisticalTypeCode {
    Log_Type = 'logType',
    Operational_Type = 'operationalType',
    Danger_Level_Type = 'dangerLevelType'
}


export enum allTypeCode {
    Operational_Log = 'operateLog',     // 操作日志
    Security_Log = 'securityLog',       // 安全日志
    System_Log = 'systemLog',           // 系统日志
    Web_Operational_Log = 'web',        // 网管操作日志
    PDA_Log = 'pda',                    // pda日志
    Prompt = '1',                       // 提示
    General = '2',                      // 一般
    Danger = '3'                        // 危险
}

export function getLogType(i18n: NzI18nService, code = null): any {
    return codeTranslate(LogTypeCode, i18n, code);
}


export function getOptType(i18n: NzI18nService, code = null): any {
    return codeTranslate(OptTypeCode, i18n, code);
}

export function getDangerLevel(i18n: NzI18nService, code = null): any {
    return codeTranslate(DangerLevelCode, i18n, code);
}


export function getLogStatisticalType(i18n: NzI18nService, code = null): any {
    return codeTranslate(LogStatisticalTypeCode, i18n, code);
}

export function getAllType(i18n: NzI18nService, code = null): any {
    return codeTranslate(allTypeCode, i18n, code);
}

/**
 * 枚举翻译
 */
function codeTranslate(codeEnum, i18n: NzI18nService, code = null) {
    if (code !== null) {
        for (const i of Object.keys(codeEnum)) {
            if (codeEnum[i] === code) {
                return i18n.translate(`logStatistical.config.${i}`);
            }
        }
    } else {
        return Object.keys(codeEnum)
            .map(key => ({ label: i18n.translate(`logStatistical.config.${key}`), code: codeEnum[key] }));
    }
}
