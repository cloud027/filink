import { Component, OnInit, ElementRef} from '@angular/core';

/**
 * 告警设置
 */
@Component({
  selector: 'app-alarm-set',
  templateUrl: './alarm-set.component.html',
})
export class AlarmSetComponent implements OnInit {

  constructor(private el: ElementRef) { }

  ngOnInit() {}
}
