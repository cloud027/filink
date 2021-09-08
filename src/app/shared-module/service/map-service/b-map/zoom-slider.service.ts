import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ZoomSliderService {
  data = 8;

  constructor() {
  }

  zoomData() {
    return this.data;
  }
}
