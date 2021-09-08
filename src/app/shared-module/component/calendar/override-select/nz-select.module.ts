import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OverrideNzOptionContainerComponent } from './nz-option-container.component';
import { NzOptionLiComponent } from './nz-option-li.component';
import { OverrideNzOptionComponent } from './nz-option.component';
import { NzFilterGroupOptionPipe, NzFilterOptionPipe, NzI18n } from './nz-option.pipe';
import { NzSelectTopControlComponent } from './nz-select-top-control.component';
import { OverrideNzSelectComponent } from './nz-select.component';
import {NzIconDirective} from './nz-icon.directive';

@NgModule({
  imports     : [
    CommonModule,
    FormsModule,
    OverlayModule,
  ],
  declarations: [
    NzFilterGroupOptionPipe,
    NzFilterOptionPipe,
    OverrideNzOptionComponent,
    OverrideNzSelectComponent,
    OverrideNzOptionContainerComponent,
    NzOptionLiComponent,
    NzSelectTopControlComponent,
    NzI18n,
    NzIconDirective,
  ],
  exports     : [
    OverrideNzOptionComponent,
    OverrideNzSelectComponent,
  ]
})
export class OverrideNzSelectModule {
}
