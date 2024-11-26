import {  useState } from "react";
import {  useEffect} from "react";
import TopButtons from "./components/TopButtons";
import Inputs from "./components/Inputs";
import TimeAndLocation from "./components/TimeAndLocation";
import TempAndDetails from "./components/TempAndDetails";
import Forecast from "./components/Forecast";
import getFormattedWeatherData from "./Services/weatherServices";

import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

const App= () =>  { 
    const [query, setQuery] = useState({ q: "ahmedabad" });
    const [units, setUnits] = useState("metric");
    const [weather, setWeather] = useState(null);


  const getweather =async () => {
    const message =query.q ? query.q :"current location";
    toast.info(`Fetching weather data for ${message}`);

    await  getFormattedWeatherData({...query, units}).then( data =>{
      
      setweather(data)
    }) 

    console. log(data);
  };
  useEffect(() => {
     getchWeather  ();
  }, [query, units]);

  const formatBackground = () => {
    if (!weather) return "from-cyan-700 to-blue-700";
    const threshold = units === "metric" ? 20 : 60;
    if (weather.temp <= threshold) return "from-cyan-700 to-blue-700";
    return "from-yellow-700 to-orange-700";
  };


  return (
    <div className={`mx-auto max-w-screen-lg mt-4 py-5 px-32 bg-gradient-to-br shadow-xl shadow-gray-400 ${fotmatBackground()}`}>
      <TopButtons setQuery={setQuery}/>
      <Inputs setQuery={setQuery} setUnits={setUnits}/>
      {weather && (
      <>  
        <TimeAndLocation weather={weather}/>
        <TempAndDetails  weather={weather}/>
        <Forecast title="3 hour step forecast" data={weather.hourly}/>
        <Forecast  title="daily forecast" data={weather.daily} />
      </>
    )}
    <ToastContainer autoClose={2500} hideProgressBar={true} theme="colored"/>
    </div>
  )
}


export default App