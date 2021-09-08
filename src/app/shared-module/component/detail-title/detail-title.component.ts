import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-detail-title',
  templateUrl: './detail-title.component.html',
  styleUrls: ['./detail-title.component.scss']
})
export class DetailTitleComponent implements OnInit {

  @Input() pageTitle = '';
  constructor() { }

  ngOnInit() {
  }

}
