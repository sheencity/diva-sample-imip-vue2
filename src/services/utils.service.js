import { Observable } from 'rxjs';

export class UtilService {
  // 过去 7 天的日期
  lastSevenDate = [];

  constructor() {
    for (let i = 24; i <= 168; i += 24) {
      const dateItem = new Date(new Date().getTime() - i * 60 * 60 * 1000);
      const m = this.formatDate(dateItem.getMonth() + 1);
      const d = this.formatDate(dateItem.getDate());
      // mm/dd
      const dateValue = `${m}/${d}`;
      this.lastSevenDate.unshift(dateValue);
    }
  }

  formatDate(time) {
    if (time.toString().length === 1) {
      return '0' + time.toString();
    }
    return time;
  }

  /**
   * 获取当前日期 yyyy-mm-dd
   */
  getDate() {
    return new Date(new Date().getTime())
      .toLocaleDateString()
      .replace(/\//g, '-');
  }

  /**
   * 获取当前时间 hh:mm
   */
  getCurrentTime() {
    const date = new Date(new Date().getTime());
    const h = this.formatDate(date.getHours()),
      m = this.formatDate(date.getMinutes());
    return `${h}:${m}`;
  }

  /**
   * 2 秒获取一个随机数
   * @param data
   */
  getRandomIndex(data) {
    return new Observable((observer) => {
      let value = 0;
      const interval = setInterval(() => {
        observer.next(value % data);
        value++;
      }, 2000);
      return () => clearInterval(interval);
    });
  }

  /**
   * 批量修改css
   * @param {HTMLElement} target 目标DOM
   * @param {Object} styles 要更改的CSS
   */
  css(target, styles) {
    for (var k in styles) {
      target.style[k] = styles[k];
    }
  }

  /**
   * 设置延时
   * @param {number} time 毫秒
   */
  delay(time = 50) {
    return new Promise((resolve) => setTimeout(() => resolve(), time));
  }
}
