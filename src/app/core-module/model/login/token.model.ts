/**
 * token 模型
 */
export class TokenModel {
  /**
   * 额外信息
   */
  additionalInformation: any;
  /**
   * 过期时间
   */
  expiration: number;
  /**
   * 是否过期
   */
  expired: boolean;
  /**
   * 到期时间
   */
  expiresIn: number;
  /**
   * token
   */
  refreshToken: TokenValueModel;
  /**
   * 范围
   */
  scope: string[];
  /**
   * token 类型
   */
  tokenType: string;
  /**
   * token 值
   */
  value: string;
}

export class TokenValueModel {
  /**
   * 过期时间
   */
  expiration: number;
  /**
   * 值
   */
  value: string;
}
