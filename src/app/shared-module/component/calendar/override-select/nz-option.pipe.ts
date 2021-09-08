import { Pipe, PipeTransform } from '@angular/core';
import {NzI18nService, NzOptionGroupComponent} from 'ng-zorro-antd';
import { OverrideNzOptionComponent } from './nz-option.component';

export type TFilterOption = (input?: string, option?: OverrideNzOptionComponent) => boolean;

@Pipe({ name: 'nzFilterOption' })
export class NzFilterOptionPipe implements PipeTransform {
  transform(options: OverrideNzOptionComponent[], searchValue: string, filterOption: TFilterOption, serverSearch: boolean): OverrideNzOptionComponent[] {
    if (serverSearch || !searchValue) {
      return options;
    } else {
      return (options as OverrideNzOptionComponent[]).filter(o => filterOption(searchValue, o));
    }
  }
}

@Pipe({ name: 'nzFilterGroupOption' })
export class NzFilterGroupOptionPipe implements PipeTransform {
  transform(groups: NzOptionGroupComponent[], searchValue: string, filterOption: TFilterOption, serverSearch: boolean): NzOptionGroupComponent[] {
    if (serverSearch || !searchValue) {
      return groups;
    } else {
      return (groups as NzOptionGroupComponent[]).filter(g => {
        // @ts-ignore
        return g.listOfNzOptionComponent.some(o => filterOption(searchValue, o));
      });
    }
  }
}

@Pipe({name: 'nzI18n'})
export class NzI18n implements PipeTransform {
  constructor(private _locale: NzI18nService) {}

  transform(path: string, keyValue?: object): string {
    return this._locale.translate(path, keyValue);
  }
}

export function defaultFilterOption(searchValue: string, option: OverrideNzOptionComponent): boolean {
  if (option && option.nzLabel) {
    return option.nzLabel.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
  } else {
    return false;
  }
}
