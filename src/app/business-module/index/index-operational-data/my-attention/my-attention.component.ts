import {Component, Input, OnInit} from '@angular/core';

/**
 * 我的关注
 */
@Component({
  selector: 'app-my-attention',
  templateUrl: './my-attention.component.html',
  styleUrls: ['./my-attention.component.scss']
})
export class MyAttentionComponent implements OnInit {
  // 聚合类型
  @Input() polymerizationChange: string;

  constructor() { }

  public ngOnInit(): void {
  }

}
