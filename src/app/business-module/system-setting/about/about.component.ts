import {Component, OnInit} from '@angular/core';
import {BasicConfig} from '../share/service/basic-config';
import {NzI18nService} from 'ng-zorro-antd';
import {ColumnConfigService} from '../share/service/column-config.service';
import {SystemParameterService} from '../share/service';
import {ResultModel} from '../../../shared-module/model/result.model';
import {AboutInfoModel} from '../share/mode/about-Info.model';

/**
 * 关于
 */
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent extends BasicConfig implements OnInit {

  // 关于信息
  public aboutInfo: AboutInfoModel;

  constructor(public $nzI18n: NzI18nService,
              private $agreementManageService: SystemParameterService,
              private $columnConfigService: ColumnConfigService,
  ) {
    super($nzI18n);
  }

  public ngOnInit(): void {
    this.formColumn = this.$columnConfigService.getAboutFormConfig({});
    this.searchFromData();
  }

  /**
   * 搜索数据
   */
  public searchFromData(): void {
    this.$agreementManageService.about().subscribe((result: ResultModel<AboutInfoModel>) => {
      if (result.code === 0) {
        this.aboutInfo = result.data;
        if (this.aboutInfo.licenseAuthorize === '1') {
          this.aboutInfo.license = this.language.systemSetting.Authorized;
        } else {
          this.aboutInfo.license = this.language.systemSetting.Unauthorized;
        }
        this.formStatus.resetData(result.data);
      }
    });
  }
}
