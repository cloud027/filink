/**
 * 语言
 */
import {SystemLanguageEnum} from '../../enum/alarm/system-language.enum';

export class LanguageModel {
  /**
   * id
   */
  public languageId: string;
  /**
   * 语言名称
   */
  public languageName: string;
  /**
   * 语言类型
   */
  public languageType: SystemLanguageEnum;
  /**
   * 语言名称
   */
  public label: string;
  /**
   * 语言类型
   */
  public value: SystemLanguageEnum;
}
