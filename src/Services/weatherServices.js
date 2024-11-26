import {DataTime } from "luxon"

const API_KEY='b51309819b2670c37f90f628e912c037' 
const BASE_URL='https://api.openweathermap.org/data/2.5/'

// https://api.openweathermap.org/data/2.5/onecall?lat=48.8534&lon=2.3488&exclude=current,minutely,hourly,alerts&appid=1fa9ff4126d95b8db54f3897a208e91c&units=metric

const getWeatherData = (infoType, searchParams) => {
  const url = new URL(BASE_URL + "/" + infoType);
  url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });

  return fetch(url)
  .then((res) => res.json());
};

const iconUrlFromCode = (code) =>
  `http://openweathermap.org/img/wn/${code}@2x.png`;

const formatToLocalTime = (
  secs,
  offset,
  format ="cccc, dd LLL yyyy'  | Local time: 'hh:mm a"
) =>DateTime.fromSeconds(secs+offset,{zone:"utc"}).toFormat(format);

const formatCurrent = (data) => {
  const {
    coord: { lat, lon },
    main: { temp, feels_like, temp_min, temp_max, humidity },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
    wind: { speed },
    timezone,
  } = data;

  const { main: details, icon } = weather[0];
  const fotmattedLocalTime= formatToLocalTime(dt,timezone);
  return {
    temp,
    feels_like,
    temp_min,
    temp_max,
    humidity,
    name,
    country,
    sunrise: formatToLocalTime( sunrise, timezone, "hh:mm a"),
    sunset:  formatToLocalTime( sunrise, timezone, "hh:mm a"),
    details,
    speed,
    icon: iconUrlFromCode(icon),
    formattedLocalTime,
    dt,
    timezone,
    lat,
    lon
  };
};

const formatForecastWeather = ( secs, offset, data) => {
  const hourly=data
  .map((f)=> ({
     title: formatToLocalTime(f.dt, offset, "hh:mm a"),
      temp: f.main.temp,
      icon:iconUrlFromCode(f.weather[0].icon),
      date:f.dt_txt,
  }))
  .slice(0,5);

  //daily
  const daily=data
  .filter((f)=>f.dt_txt.slice(-8)==="00:00:00")
  .map((f)=> ({
     title: formatToLocalTime(f.dt, offset, "ccc"),
      temp: f.main.temp,
      icon:iconUrlFromCode(f.weather[0].icon),
      date:f.dt_txt,
  }));
  
  return { daily, hourly };
};

const getFormattedWeatherData = async (searchParams) => {
  const formattedCurrentWeather = await getWeatherData(
    "weather",
    searchParams
  ).then(formatCurrent);

  const {dt, lat, lon, timezone  } = formattedCurrentWeather;

  const formattedForecastWeather = await getWeatherData("forecast", {
    lat,
    lon,
    units: searchParams.units,
  }).then((d)=> formatForecastWeather(dt, timezone, d.list)) ;

  return { ...formattedCurrentWeather, ...formattedForecastWeather };
};


export default getFormattedWeatherData;

export { formatToLocalTime, iconUrlFromCode };