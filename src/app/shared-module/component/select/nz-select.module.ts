import {OverlayModule} from '@angular/cdk/overlay';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NzOptionContainerComponent} from './nz-option-container.component';
import {NzOptionGroupComponent} from './nz-option-group.component';
import {NzOptionLiComponent} from './nz-option-li.component';
import {NzOptionComponent} from './nz-option.component';
import {NzI18n, NzOptionPipe, NzSubOptionPipe} from './nz-option.pipe';
import {NzSelectTopControlComponent} from './nz-select-top-control.component';
import {NzSelectUnselectableDirective} from './nz-select-unselectable.directive';
import {NzSelectComponent} from './nz-select.component';
import {NzIconDirective} from './nz-icon.directive';

@NgModule({
  imports: [CommonModule, FormsModule, OverlayModule],
  providers: [],
  declarations: [NzOptionPipe, NzSubOptionPipe, NzOptionComponent, NzSelectComponent, NzI18n, NzIconDirective,
    NzOptionContainerComponent, NzOptionGroupComponent, NzOptionLiComponent, NzSelectTopControlComponent, NzSelectUnselectableDirective],
  exports: [NzOptionComponent, NzSelectComponent, NzOptionContainerComponent, NzOptionGroupComponent, NzSelectTopControlComponent]
})
export class XcNzSelectModule {
}
