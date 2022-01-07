import { DataService } from './data.service';
import { DivaService } from './diva.service';
import { EchartService } from './echart.service';
import { UtilService } from './utils.service';
import { WeatherService } from './weather.service';

export const dataService = new DataService();
export const diva = new DivaService();
export const echartService = new EchartService();
export const utilService = new UtilService();
export const weatherService = new WeatherService();
