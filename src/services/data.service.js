import { BehaviorSubject } from 'rxjs';

export class DataService {
  // 天气
  selectedWeather = {
    value: 'sunny', placeholder: '晴天',
  };

  // 罗盘显示
  compass = false;

  // 是否初始化 divaClient
  _diva = new BehaviorSubject(false);
  divaClient = this._diva.asObservable();
}