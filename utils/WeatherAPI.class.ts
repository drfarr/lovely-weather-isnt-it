/**
 * We're typing all the data we get back from the response from VisualCrossingWebServices api.
 * There's also a class that we can use in our own API to consume the response from the API.
 */

export enum Unit {
  "metric" = "metric",
  "imperial" = "imperial",
}
// The values that represent the weather condition for the `icon` field.
export enum WeatherIcon {
  "snow" = "snow",
  "snow-showers-day" = "snow-showers-day",
  "snow-showers-night" = "snow-showers-night",
  "thunder-rain" = "thunder-rain",
  "thunder-showers-day" = "thunder-showers-day",
  "thunder-showers-night" = "thunder-showers-night",
  "rain" = "rain",
  "showers-day" = "showers-day",
  "showers-night" = "showers-night",
  "fog" = "fog",
  "wind" = "wind",
  "cloudy" = "cloudy",
  "partly-cloudy-day" = "partly-cloudy-day",
  "partly-cloudy-night" = "partly-cloudy-night",
  "clear-day" = "clear-day",
  "clear-night" = "clear-night",
}
/**
 * This object has many more params from the API.
 * But only seems to contain label information for properties.
 * For now we only use the mint (min tempreature) value to obtain the units of the data i.e centigrade.
 */
interface IColumn {
  mint: {
    id: string;
    name: string;
    type: number;
    unit: string;
  };
}
/**
 * The main response body from VisualCrossingWebServices api
 */
export interface IResponse {
  columns: IColumn;
  locations: Record<string, ILocation>;
  message: string[] | null;
  queryCost: number;
  remainingCost: number;
}

/**
 * These are the weather condition values for your `location` API response
 */
interface ICurrentConditions {
  wdir: number;
  temp: number;
  sunrise: string;
  visibility: number;
  wspd: number;
  icon: WeatherIcon;
  stations: string;
  heatindex: null;
  cloudcover: number | null;
  datetime: string;
  precip: number;
  moonphase: number;
  snowdepth: null;
  sealevelpressure: number;
  dew: number;
  sunset: string;
  humidity: number;
  wgust: null;
  windchill: null;
}
/**
 * These are the values for your `location` API response
 */
export type ILocation = {
  stationContributions: null;
  id: string;
  address: string;
  name: string;
  index: number;
  latitude: number;
  longitude: number;
  distance: number;
  time: number;
  tz: string;
  currentConditions: ICurrentConditions;
  values: IDailyValues[];
  alerts: null;
};

/**
 * The values that are available for each `day`
 *
 */
export interface IDailyValues {
  wdir: number;
  uvindex: number;
  datetimeStr: string;
  preciptype: string;
  cin: number;
  cloudcover: number;
  pop: number;
  mint: number;
  datetime: number;
  precip: number;
  solarradiation: number;
  dew: number;
  humidity: number;
  temp: number;
  maxt: number;
  visibility: number;
  wspd: number;
  severerisk: number;
  solarenergy: number;
  heatindex: null;
  snowdepth: number;
  sealevelpressure: number;
  snow: number;
  wgust: number;
  conditions: string;
  windchill: null;
  cape: number;
}

/**
 * A class that allows us to call VisualCrossingWebServices api to get weather data.
 *
 * @example
 *
 * const api =  new WeatherAPI();
 * const response = api.query("Brighton")
 * const data = api.getData();
 */
export default class WeatherAPI {
  private token: string = process.env.NEXT_PUBLIC_API_TOKEN as string;
  private queryString: string | null = null;
  private url: string | undefined;
  private units: Unit = Unit.metric;
  public data: IResponse | null = null;

  constructor(units?: Unit) {
    this.units = units ?? Unit.metric;
    this.url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/forecast`;
  }

  /**
   * A setter for updating the data property of class to hold the data from the API call.
   * @param data
   */

  private setData(data: IResponse): void {
    this.data = data;
  }

  /**
   * A getter for retrieving the data property of class to hold the data from the API call.
   * @param value
   * @returns Promise<IResponse | null>
   */
  public getData(): IResponse | null {
    return this.data;
  }

  /**
   * Query the weather API with a string containing the location you want to retrieve.
   * @param value
   * @returns Promise<IResponse | null>
   */
  public async query(value: string): Promise<void> {
    this.queryString = value;

    const requestUrl = `${this.url}/?locations=${encodeURIComponent(
      this.queryString
    )}&key=${this.token}&aggregateHours=24&contentType=json&unitGroup=${
      this.units === Unit.metric ? "uk" : "us"
    }`;
    const response = await fetch(requestUrl);
    const data = await response.json();
    this.setData(data);
  }
}
