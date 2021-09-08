/**
 * Created by wh1709040 on 2019/4/11.
 */
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'serialNumber'})
export class SerialNumberPipe implements PipeTransform {
    /**
     * 序号管道
     * param value 当前索引
     * param pageSize 分页size
     * param pageIndex 当前页码
     */
    transform(value: number, pageSize: number, pageIndex: number) {
        return value + pageSize * (pageIndex - 1) + 1;
    }
}
