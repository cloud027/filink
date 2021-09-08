import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {CommonLanguageInterface} from '../../../assets/i18n/common/common.language.interface';
import {FacilityLanguageInterface} from '../../../assets/i18n/facility/facility.language.interface';
import {InspectionLanguageInterface} from '../../../assets/i18n/inspection-task/inspection.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {Injectable} from '@angular/core';

@Injectable()
export class AsyncRuleUtil {

  language: CommonLanguageInterface;
  facilityLanguage: FacilityLanguageInterface;
  inspectionLanguage: InspectionLanguageInterface;

  // 国际化

  constructor(private $i18n: NzI18nService) {
    this.language = this.$i18n.getLocaleData('common');
    this.facilityLanguage = this.$i18n.getLocaleData('facility');
    this.inspectionLanguage = this.$i18n.getLocaleData('inspection');
  }

  /**
   * 可以为0，但不能以0开头的整数
   * param msg
   */
  mustInt(msg?: string) {
    return {
      asyncRule: (control: FormControl) => {
        return Observable.create(observer => {
          if (/^([0-9]|[1-9][0-9]+)$/.test(control.value)) {
            observer.next(null);
            observer.complete();
          } else {
            observer.next({error: true, duplicated: true});
            observer.complete();
          }
        });
      },
      asyncCode: 'duplicated', msg: msg || this.language.mustInt
    };
  }

  // 名称效验
  nameReg(msg?: string) {
    return {
      asyncRule: (control: FormControl) => {
        return Observable.create(observer => {
          if (/^(?!_)[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(control.value)) {
            observer.next(null);
            observer.complete();
          } else {
            observer.next({error: true, duplicated: true});
            observer.complete();
          }
        });
      },
      asyncCode: 'duplicated', msg: msg || this.language.incorrectInput
    };
  }


  // IPV4效验
  IPV4Reg(msg?: string) {
    const ipv6 = /^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$/;
    const ipv4 = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
    return {
      asyncRule: (control: FormControl) => {
        return Observable.create(observer => {
          if (ipv4.test(control.value) || ipv6.test(control.value)) {
            observer.next(null);
            observer.complete();
          } else {
            observer.next({error: true, duplicated: true});
            observer.complete();
          }
        });
      },
      asyncCode: 'duplicated', msg: msg || this.language.correctIpAddress
    };
  }

  HttpIPV4Reg(msg?: string) {
    const ipv4 = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
    return {
      asyncRule: (control: FormControl) => {
        return Observable.create(observer => {
          if (ipv4.test(control.value)) {
            observer.next(null);
            observer.complete();
          } else {
            observer.next({error: true, duplicated: true});
            observer.complete();
          }
        });
      },
      asyncCode: 'duplicated', msg: msg || this.language.correctIpAddress
    };
  }

  HttpReg(msg?: string) {
    const http = /^(http:\/\/).+$/;
    return {
      asyncRule: (control: FormControl) => {
        return Observable.create(observer => {
          if (http.test(control.value)) {
            observer.next(null);
            observer.complete();
          } else {
            observer.next({error: true, duplicated: true});
            observer.complete();
          }
        });
      },
      asyncCode: 'duplicated', msg: msg || this.language.correctIpAddress
    };
  }

  HttpsReg(msg?: string) {
    const https = /^(https:\/\/).+$/;
    return {
      asyncRule: (control: FormControl) => {
        return Observable.create(observer => {
          if (https.test(control.value)) {
            observer.next(null);
            observer.complete();
          } else {
            observer.next({error: true, duplicated: true});
            observer.complete();
          }
        });
      },
      asyncCode: 'duplicated', msg: msg || this.language.correctIpAddress
    };
  }
    // 验证密码
    passWordReg(msg ?: string) {
      return {
        asyncRule: (control: FormControl) => {
          return Observable.create(observer => {
            if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&.])[A-Za-z\d$@$!%*?&.]{6, 255}/.test(control.value)) {
              observer.next(null);
              observer.complete();
            } else {
              observer.next({error: true, duplicated: true});
              observer.complete();
            }
          });
        },
        asyncCode: 'duplicated', msg: msg || this.language.correctPassword
      };
    }

    // 邮箱秘钥校验
    mailReg(msg ?: string) {
      return {
        asyncRule: (control: FormControl) => {
          return Observable.create(observer => {
            if (/^([a-zA-Z0-9_]){1,32}$/.test(control.value)) {
              observer.next(null);
              observer.complete();
            } else {
              observer.next({error: true, duplicated: true});
              observer.complete();
            }
          });
        },
        asyncCode: 'duplicated', msg: msg || this.language.correctPleaseInput
      };
    }

    emailRegExp(msg ?: string) {
      return {
        asyncRule: (control: FormControl) => {
          return Observable.create(observer => {
            if (/^[a-z0-9A-Z]+([._\\-]*[a-z0-9A-Z])*@([a-z0-9A-Z]+[-a-z0-9A-Z]*[a-z0-9A-Z]+.){1,63}[a-z0-9A-Z]+$/.test(control.value)) {
              observer.next(null);
              observer.complete();
            } else {
              observer.next({error: true, duplicated: true});
              observer.complete();
            }
          });
        },
        asyncCode: 'duplicated', msg: msg || this.language.correctMailAddress
      };
    }

    ////////////////////////////////////

    /**
     * 获取数字检验规则
     */
    getNumberRule(code) {
      if (code === '1') {
        return {
          asyncRule: (control: FormControl) => {
            return Observable.create(observer => {
              if (/^.*(?=.*\d)/.test(control.value)) {
                observer.next(null);
                observer.complete();
              } else {
                observer.next({error: true, duplicated: true});
                observer.complete();
              }
            });
          },
          asyncCode: 'duplicated', msg: this.language.leastOneNumber
        };
      } else if (code === '0') {
        return null;
      }
    }


    /**
     * 获取小写字母检验规则
     */
    getLowerRule(code) {
      if (code === '1') {
        return {
          asyncRule: (control: FormControl) => {
            return Observable.create(observer => {
              if (/^.*(?=.*[a-z])/.test(control.value)) {
                observer.next(null);
                observer.complete();
              } else {
                observer.next({error: true, duplicated: true});
                observer.complete();
              }
            });
          },
          asyncCode: 'duplicated', msg: this.language.leastOneLowerCase
        };
      } else if (code === '0') {
        return null;
      }
    }


    /**
     * 获取大写字母检验规则
     */
    getUpperRule(code) {
      if (code === '1') {
        return {
          asyncRule: (control: FormControl) => {
            return Observable.create(observer => {
              if (/^.*(?=.*[A-Z])/.test(control.value)) {
                observer.next(null);
                observer.complete();
              } else {
                observer.next({error: true, duplicated: true});
                observer.complete();
              }
            });
          },
          asyncCode: 'duplicated', msg: this.language.leastOneCapitalCase
        };
      } else if (code === '0') {
        return null;
      }
    }

    /**
     * 获取特殊字符检验规则
     */

    getSpecialCharacterRule(code) {
      if (code === '1') {
        return {
          asyncRule: (control: FormControl) => {
            return Observable.create(observer => {
              if (/^.*(?=.*[!@#$%.\-_&*<>?\(\)\[\]{}\\|;:])/.test(control.value)) {
                observer.next(null);
                observer.complete();
              } else {
                observer.next({error: true, duplicated: true});
                observer.complete();
              }
            });
          },
          asyncCode: 'duplicated', msg: this.language.leastSpString
        };
      } else if (code === '0') {
        return null;
      }
    }
  }

