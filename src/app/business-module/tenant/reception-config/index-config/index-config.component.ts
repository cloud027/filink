import {Component, OnInit} from '@angular/core';
import {TenantLanguageInterface} from '../../../../../assets/i18n/tenant/tenant.language.interface';
import {TenantApiService} from '../../share/sevice/tenant-api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {TenantIndexModel} from '../../share/model/tenant.model';

@Component({
  selector: 'app-index-config',
  templateUrl: './index-config.component.html',
  styleUrls: ['./index-config.component.scss']
})
export class IndexConfigComponent implements OnInit {
  // 首页配置数据
  public homePageElementList;
  // 备份首页配置数据
  public dataChange;
  // 按钮loading
  public submitLoading = false;
  // 运维左上角默认选中
  public leftTitleDefault = 'deviceEquipmentList';
  // 运维右上角默认选中
  public rightTitleDefault = 'basicInfo';
  // 左上角卡片数据
  public leftCardData = [];
  // 运维右上角卡片数据
  public rightCardData = [];
  // 运维右侧统计状态
  public statisticsStatus = '';
  // 运维左侧卡片状态
  public leftStatus = '';
  // 运维右侧卡片状态
  public rightStatus = '';
  // 运维左侧数据
  public leftData = [];
  // 运维右侧数据
  public rightData = [];
  // 运维卡片数据
  public statisticsData = [];
  // 租户id
  public tenantId: string = '';
  // 是否为点击保存配置
  public confirmSave: boolean = true;
  // 运维数据
  public maintenanceData = new TenantIndexModel();
  // 项目数据
  public projectData = new TenantIndexModel();
  // 规划数据
  public planningData = new TenantIndexModel();
  // 项目左侧数据
  public projectLeftData = new TenantIndexModel();
  // 项目右侧数据
  public projectRightData = new TenantIndexModel();
  // 规划左侧数据
  public planLeftData = new TenantIndexModel();
  // 规划右侧数据
  public planRightData = new TenantIndexModel();

  // 国际化
  public language: TenantLanguageInterface;
  // 公共语言包
  public commonLanguage: CommonLanguageInterface;

  constructor(
    public $tenantApiService: TenantApiService,
    public $router: Router,
    public $nzI18n: NzI18nService,
    public $ruleUtil: RuleUtil,
    public $active: ActivatedRoute,
    private $message: FiLinkModalService,
    private $activatedRoute: ActivatedRoute,
    public modalService: NzModalService,
  ) {
  }

  ngOnInit() {
    // 国际化
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.tenant);
    // 通用国际化
    this.commonLanguage = this.$nzI18n.getLocaleData('common');
    this.queryTenantConfig();
  }

  /**
   * 查询首页/设施/告警配置数据
   */
  public queryTenantConfig() {
    this.$activatedRoute.queryParams.subscribe(params => {
      this.tenantId = params.id;
      this.$tenantApiService.queryElementById(this.tenantId).subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          // 保存首页配置数据
          this.homePageElementList = CommonUtil.deepCopy(result.data.homePageElementList || []);
          // 备份首页配置数据
          this.dataChange = CommonUtil.deepCopy(result.data.homePageElementList || []);
          // 对数据进行分类
          this.homePageElementList.forEach(item => {
            if (item.elementCode === 'maintenance') {
              this.maintenanceData = item;
            }
            if (item.elementCode === 'projectData') {
              this.projectData = item;
            }
            if (item.elementCode === 'planningData') {
              this.planningData = item;
            }
          });

          // 运维数据处理
          this.maintenanceData.children.forEach(item => {
            if (item.elementCode === 'leftTopCard') {
              this.leftData = item.children;
              this.leftStatus = item.isShow;
            }
            if (item.elementCode === 'deviceDetailsCard') {
              this.rightData = item.children;
              this.rightStatus = item.isShow;
            }
            if (item.elementCode === 'right') {
              this.statisticsData = item.children;
              this.statisticsStatus = item.isShow;
            }
          });

          // 规划数据处理
          this.planningData.children.forEach(item => {
            if (item.elementCode === 'planningLeftTopCard') {
              this.planLeftData = item;
            }
            if (item.elementCode === 'planningRight') {
              this.planRightData = item;
              console.log(this.planRightData);
            }
          });

          // 项目数据处理
          this.projectData.children.forEach(item => {
            if (item.elementCode === 'projectLeftTopCard') {
              this.projectLeftData = item;
            }
            if (item.elementCode === 'projectRight') {
              this.projectRightData = item;
              console.log(this.projectRightData);
            }
          });

          // 默认选中卡片
          this.titleClick('deviceEquipmentList', 'leftTopCard');
          this.titleClick('deviceDetails', 'deviceDetailsCard');
        }
      });
    });
  }


  /**
   * 卡片title切换
   * event：标题选中样式的切换
   * card：切换的模块，左侧卡片/右侧卡片/右侧统计条
   */
  public titleClick(event, card) {
    // 左侧卡片
    if (card === 'leftTopCard') {
      this.leftTitleDefault = event;
      this.leftData.forEach(item => {
        if (item.elementCode === event) {
          this.leftCardData = item.children;
        }
      });
    }
    // 右侧卡片
    if (card === 'deviceDetailsCard') {
      this.rightTitleDefault = event;
      this.rightData.forEach(item => {
        if (item.elementCode === event) {
          this.rightCardData = item.children;
        }
      });
    }
    this.getDataChangs();
  }


  /**
   * 模块显示
   * status: 切换的状态
   * card：切换的模块，左侧卡片/右侧卡片/右侧统计条
   */
  public titleIconClick(status, card) {
    const statu = status === '1' ? '0' : '1';
    if (card === 'leftTopCard') {
      this.leftStatus = statu;
      this.maintenanceData.isShow = (statu === '1' || this.rightStatus === '1' || this.statisticsStatus === '1') ? '1' : '0';
      this.leftData.forEach(item => {
        item.isShow = statu;
        item.children.forEach(_item => {
          _item.isShow = statu;
        });
      });
    } else if (card === 'deviceDetailsCard') {
      this.rightStatus = statu;
      this.maintenanceData.isShow = (statu === '1' || this.leftStatus === '1' || this.statisticsStatus === '1') ? '1' : '0';
      this.rightData.forEach(item => {
        item.isShow = statu;
        item.children.forEach(_item => {
          _item.isShow = statu;
        });
      });
    } else if (card === 'right') {
      this.statisticsStatus = statu;
      this.maintenanceData.isShow = (statu === '1' || this.leftStatus === '1' || this.rightStatus === '1') ? '1' : '0';
      this.statisticsData.forEach(item => {
        item.isShow = statu;
      });
    } else if (card === 'projectLeftTopCard') {
      this.projectLeftData.isShow = statu;
      this.projectData.isShow = (statu === '1' || this.projectRightData.isShow === '1') ? '1' : '0';
      this.projectLeftData.children.forEach(item => {
        item.isShow = statu;
      });
    } else if (card === 'projectRightData') {
      this.projectRightData.isShow = statu;
      this.projectRightData.children.forEach(item => {
        item.isShow = statu;
      });
    } else if (card === 'planLeftTopCard') {
      this.planLeftData.isShow = statu;
      this.planningData.isShow = (statu === '1' || this.planRightData.isShow === '1') ? '1' : '0';
      this.planLeftData.children.forEach(item => {
        item.isShow = statu;
      });
    } else if (card === 'planRightData') {
      this.planRightData.isShow = statu;
      this.planRightData.children.forEach(item => {
        item.isShow = statu;
      });
    } else if (card === 'maintenance') {
      this.maintenanceData.isShow = statu;
      this.leftStatus = statu;
      this.leftData.forEach(item => {
        item.isShow = statu;
        item.children.forEach(_item => {
          _item.isShow = statu;
        });
      });
      this.rightStatus = statu;
      this.rightData.forEach(item => {
        item.isShow = statu;
        item.children.forEach(_item => {
          _item.isShow = statu;
        });
      });
      this.statisticsStatus = statu;
      this.statisticsData.forEach(item => {
        item.isShow = statu;
      });
    } else if (card === 'projectData') {
      this.projectData.isShow = statu;
      this.projectData.children.forEach(item => {
        item.isShow = statu;
        item.children.forEach(_item => {
          _item.isShow = statu;
        });
      });
    } else if (card === 'planningData') {
      this.planningData.isShow = statu;
      this.planningData.children.forEach(item => {
        item.isShow = statu;
        item.children.forEach(_item => {
          _item.isShow = statu;
        });
      });
    }
    this.getDataChangs();
  }

  /**
   * 图标点击事件
   * data: 所点击的父级数据
   * elementCode：所点击的数据名称
   * titleClick：是否为标题总开关
   */
  public iconClick(data, elementCode, titleClick?) {
    let status;
    data.forEach(item => {
      if (item.elementCode === elementCode) {
        item.isShow = item.isShow === '1' ? '0' : '1';
        status = item.isShow;
      }
    });
    // 如果为标题切换，则标题下数据状态一同改变
    if (titleClick) {
      let arr = [];
      this.leftData.forEach(item => {
        if (item.elementCode === elementCode) {
          arr = item.children;
        }
      });
      this.rightData.forEach(item => {
        if (item.elementCode === elementCode) {
          arr = item.children;
        }
      });
      arr.forEach(item => {
        item.isShow = status;
      });
    } else {
      /*if (this.maintenanceData.isShow !== '1') {
        return;
      }*/
      this.selectedLinkage(data, status, elementCode);
    }
    this.getDataChangs();
  }

  /**
   *  父子集联动
   */
  public selectedLinkage(data, status, elementCode): void {
    const that = this;
    this.homePageElementList.forEach(a => {
      // 判断运维数据
      if (a.elementCode === 'maintenance') {
        a.children.forEach(b => {
          // 左侧设施设备
          if (b.elementCode === 'leftTopCard' || b.elementCode === 'deviceDetailsCard') {
            // 配置项眼睛状态
            let num = 0;
            b.children.forEach(c => {
              let sum = 0;
              // 统计已经选中的个数
              c.children.forEach(v => {
                if (v.isShow === '1') {
                  sum++;
                  // 判断3个类型的所有已勾选状态
                  num++;
                }
              });
              if (c.elementCode === data[0].elementParentCode) {
                c.isShow = sum > 0 ? '1' : '0';
              }
            });
            b.isShow = num > 0 ? '1' : '0';
            if (b.elementCode === 'leftTopCard') {
              that.leftStatus = b.isShow;
            } else {
              that.rightStatus = b.isShow;
            }
          } else {
            // 右侧统计
            const res = b.children.find(v => v.isShow === '1');
            b.isShow = res ? '1' : '0';
            that.statisticsStatus = b.isShow;
          }
        });
        if (status === '1') {
          a.isShow = '1';
        } else {
          if (that.leftStatus === '0' && that.rightStatus === '0' && that.statisticsStatus === '0') {
            a.isShow = '0';
          }
        }
        that.maintenanceData.isShow = a.isShow;
      } else if (a.elementCode === 'projectData' || a.elementCode === 'planningData') {
        // 项目数据-规划数据
        if (status === '1') {
          a.isShow = '1';
        } else {
          let sum = 0;
          a.children.forEach(b => {
            b.children.forEach(c => {
              if (c.isShow === '1') {
                sum++;
              }
            });
          });
          a.isShow = sum > 0 ? '1' : '0';
        }
        a.children.forEach(b => {
          // 项目左侧数据
          if (b.elementCode === 'projectLeftTopCard' || b.elementCode === 'planningLeftTopCard') {
            const res = b.children.find(v => v.isShow === '1');
            b.isShow = res ? '1' : '0';
            if (b.elementCode === 'projectLeftTopCard') {
              that.projectLeftData.isShow = b.isShow;
            } else {
              that.planLeftData.isShow = b.isShow;
            }
          } else {
            if (b.elementCode === 'projectLeftTopCard') {
              that.projectRightData.isShow = b.children[0].isShow;
            } else {
              that.planRightData.isShow = b.children[0].isShow;
            }
          }
        });
        if (a.elementCode === 'projectData') {
          that.projectData.isShow = a.isShow;
        } else {
          that.planningData.isShow = a.isShow;
        }
      }
    });
  }

  /**
   * 确认事件
   */
  public updateMenuTemplate(): void {
    // 保存配置
    this.updateElement();


  }


  /**
   * 保存数据
   */
  public updateElement() {
    this.submitLoading = true;
    this.getDataChangs();
    const body = {
      tenantId: this.tenantId,
      alarmElementList: null,
      deviceElementList: null,
      homePageElementList: this.homePageElementList
    };
    this.$tenantApiService.updateElementById(body).subscribe((result: ResultModel<any>) => {
      this.submitLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.language.tenantConfigMsg);
        if (this.confirmSave) {
          // 刷新数据
          this.queryTenantConfig();
        }
      } else {
        this.$message.warning(result.msg);
      }
    }, () => {
      this.submitLoading = false;
    });
  }


  /**
   * 数据改变
   */
  public getDataChangs() {
    // 运维数据处理
    this.maintenanceData.children.forEach(item => {
      if (item.elementCode === 'leftTopCard') {
        item.isShow = this.leftStatus;
        item.children = this.leftData;
      }
      if (item.elementCode === 'deviceDetailsCard') {
        item.isShow = this.rightStatus;
        item.children = this.rightData;
      }
      if (item.elementCode === 'right') {
        item.isShow = this.statisticsStatus;
        item.children = this.statisticsData;
      }
    });

    // 项目数据处理
    this.projectData.children.forEach(item => {
      if (item.elementCode === 'projectLeftTopCard') {
        item = this.projectLeftData;
      }
      if (item.elementCode === 'projectRight') {
        item = this.projectRightData;
      }
    });

    // 规划数据处理
    this.planningData.children.forEach(item => {
      if (item.elementCode === 'planningLeftTopCard') {
        item = this.planLeftData;
      }
      if (item.elementCode === 'planningRight') {
        item = this.planRightData;
      }
    });

    this.homePageElementList.forEach(item => {
      if (item.elementCode === 'maintenance') {
        item = this.maintenanceData;
      }
      if (item.elementCode === 'projectData') {
        item = this.projectData;
      }
      if (item.elementCode === 'planningData') {
        item = this.planningData;
      }
    });
  }


  /**
   * 取消按钮，回列表
   */
  public cancel(): void {
    const dataChang = this.comparedDatas();
    if (dataChang) {
      this.confirm();
    } else {
      // 返回租户列表
      this.$router.navigate(['/business/tenant/tenant-list']).then();
    }

  }

  /**
   * 对比数据是否有改变
   */
  public comparedDatas() {
    if (this.homePageElementList && this.dataChange) {
      // 保存首页配置数据
      const data = JSON.stringify(this.homePageElementList).toString();
      const dataChange = JSON.stringify(this.dataChange).toString();
      if (data === dataChange) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }

  }


  /**
   * 确认弹窗
   */
  public confirm(): void {
    this.modalService.warning({
      nzTitle: this.language.saveConfigMsg,
      nzContent: this.language.beenSaveConfigMsg,
      nzOkText: this.commonLanguage.cancel,
      nzOkType: 'danger',
      nzCancelText: this.commonLanguage.confirm,
      nzMaskClosable: false,
      nzOnCancel: () => {
        // true为点击配置保存按钮,false为弹框保存
        this.confirmSave = false;
        // 保存配置
        this.updateElement();
        // 返回租户列表
        this.$router.navigate(['/business/tenant/tenant-list']).then();
      },
      nzOnOk: () => {
        this.$router.navigate(['/business/tenant/tenant-list']).then();
      }
    });
  }


}
