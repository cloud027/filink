/**
 * 密码校验
 */
export class PasswordCheckModel {
  /**
   * 长度
   */
  public minLength: number;
  /**
   * 包含小写个数
   */
  public containLower: string;
  /**
   * 包含大写
   */
  public containUpper: string;
  /**
   * 包含数字
   */
  public containNumber: string;
  /**
   * 特殊字符
   */
  public containSpecialCharacter: string;
  constructor(minLength?, containLower?, containUpper?, containNumber?, containSpecialCharacter?) {
    this.minLength = typeof minLength === 'number' ? minLength : 6;
    this.containLower = containLower || '1';
    this.containUpper = containUpper || '1';
    this.containNumber = containNumber ||'1';
    this.containSpecialCharacter = containSpecialCharacter || '1';
  }
}
