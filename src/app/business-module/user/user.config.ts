import { NzI18nService } from 'ng-zorro-antd';

export const DeptLevel = {
  deptLevelOne: '1',
  deptLevelTwo: '2',
  deptLevelThree: '3',
  deptLevelFour: '4',
  deptLevelFive: '5'
};


export function getDeptLevel(i18n: NzI18nService, code = null) {
    return codeTranslate(DeptLevel, i18n, code);
}


/**
 * 枚举翻译
 * param codeEnum
 * param {NzI18nService} i18n
 * param {any} code
 * returns {any}
 */
function codeTranslate(codeEnum, i18n: NzI18nService, code = null) {
    if (code) {
        for (const i of Object.keys(codeEnum)) {
            if (codeEnum[i] === code) {
                return i18n.translate(`unit.config.${i}`);
            }
        }
    } else {
        return Object.keys(codeEnum)
            .map(key => ({ label: i18n.translate(`unit.config.${key}`), code: codeEnum[key] }));
    }
}
