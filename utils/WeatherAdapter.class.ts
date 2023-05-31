import { IDailyValues, IResponse, Unit, WeatherIcon } from "./WeatherAPI.class";

/**
 * These map to the svg image names in the `/public` directory
 */
enum Icon {
  "cloudy-night" = "cloudy-night",
  "cloudy-day" = "cloudy-day",
  "day" = "day",
  "night" = "night",
  "rainy" = "rainy",
  "snowy" = "snowy",
  "thunder" = "thunder",
}

/**
 * These are the parameters in a shape the frontend will always be expecting.
 */
interface IWeatherResourceBase {
  date: string;
  icon: string;
  maxTemp: number;
  minTemp: number;
}

export interface IWeatherResource extends IWeatherResourceBase {
  id: string;
  name: string;
  address: string;
  units: string;
  location: string;
  currentTemp: number;
  sunRiseTime: string;
  sunSetTime: string;
  conditions: string;
  cloudCover: number | null;
  humidity: number | null;
  days: IWeatherResourceBase[];
}

/**
 * This acts as a template class which any class that will be munging data will be expected to follow.
 * The benefits of this is that if we change the weather api provider we ensure there is consistency  in thwe shape of the data going forward.
 */
abstract class WeatherResource {
  abstract data: IWeatherResource;
  abstract parseResponse(data: IResponse | unknown): void;
  abstract getData(): IWeatherResource;
}

export class WeatherResourceAdapter extends WeatherResource {
  public data: IWeatherResource;

  constructor(data: IResponse) {
    super();
    this.data = this.parseResponse(data);
  }

  /**
   *
   * @returns IWeatherResource
   */
  public getData() {
    return this.data;
  }

  /**
   * A private method that takes data of a certain shape and does it's best to format it into the shape
   * of what the frontend will be expecting.
   * @param data
   * @returns IDailyValues[]
   */
  private parseDays(data: IDailyValues[]): IWeatherResourceBase[] {
    if (data.length <= 6) {
      return [];
    }

    return data.slice(1, 6).map((data) => {
      return {
        date: data.datetimeStr,
        // The API doesn't seem to provide a value for the icon we should show :(
        icon: "",
        maxTemp: data.maxt,
        minTemp: data.mint,
      };
    });
  }

  /**
   * A method that accepts data of a certain shape which is formatted to correspond to the icon
   * svgs from the design.
   *
   * TODO: Talk to the designer as we currently don't have svg images for all cases ;p
   *
   * @param data
   * @returns Icon
   */
  private parseIcon(data: WeatherIcon): Icon {
    switch (data) {
      // Clear
      case WeatherIcon["clear-night"]:
        return Icon["night"];
      case WeatherIcon["clear-day"]:
        return Icon["day"];
      case WeatherIcon["partly-cloudy-night"]:
        return Icon["cloudy-night"];
      // Thunder
      case WeatherIcon["thunder-showers-day"]:
      case WeatherIcon["thunder-showers-night"]:
      case WeatherIcon["thunder-showers-day"]:
      case WeatherIcon["thunder-rain"]:
        return Icon["thunder"];
      // Rain
      case WeatherIcon["rain"]:
      case WeatherIcon["showers-day"]:
      case WeatherIcon["showers-night"]:
        return Icon["rainy"];
      // Snow
      case WeatherIcon["snow-showers-day"]:
      case WeatherIcon["snow"]:
      case WeatherIcon["snow-showers-night"]:
        return Icon["snowy"];

      // Cloudy
      case WeatherIcon["fog"]:
      case WeatherIcon["wind"]:
      case WeatherIcon["partly-cloudy-day"]:
      case WeatherIcon["cloudy"]:
      default:
        return Icon["cloudy-day"];
    }
  }

  /**
   * A method which takes the raw payload from the API and munges it into the shape we
   * are expecting on the front end.
   * @param data
   * @returns IWeatherResource
   */
  parseResponse(data: IResponse): IWeatherResource {
    const output = {} as IWeatherResource;

    console.log(data.locations);
    if (data?.locations && data?.columns) {
      const { locations, columns } = data;
      const locationKey = Object.keys(locations)[0];
      const location = locations[locationKey];
      output.id = location.id;
      output.name = location.name;
      output.address = location.address;
      output.units = columns.mint.unit === "degC" ? Unit.metric : Unit.imperial;
      output.date = location.currentConditions.datetime;
      output.currentTemp = location.currentConditions.temp;
      output.icon = this.parseIcon(location.currentConditions.icon);
      output.sunRiseTime = location.currentConditions.sunrise;
      output.sunSetTime = location.currentConditions.sunset;
      output.humidity = location.currentConditions.humidity;
      output.cloudCover = location.currentConditions.cloudcover;
      output.maxTemp = location.values[0].maxt;
      output.minTemp = location.values[0].mint;
      output.conditions = location.values[0].conditions;
      output.days = this.parseDays(location.values);
    }
    return output;
  }
}
