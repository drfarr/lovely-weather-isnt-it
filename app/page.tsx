"use client";
import Card from "@/components/Card";
import Loader from "@/components/Loader";
import Progress from "@/components/Progress";
import useWeather from "@/hooks/useWeather";
import { formatDate, formatHours, formatTempreature } from "@/utils";
import { Unit } from "@/utils/WeatherAPI.class";
import { IWeatherResource } from "@/utils/WeatherAdapter.class";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

interface FormElements extends HTMLFormControlsCollection {
  queryInput: HTMLInputElement;
}
interface QueryFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export default function Home() {
  const [query, setQuery] = useState<string>("brighton");
  const { data: _data, error, loading } = useWeather<IWeatherResource>(query);
  const [displayUnits, setDisplayUnits] = useState(_data?.units);

  const data: IWeatherResource | null = useMemo(() => {
    return _data?.name && !loading ? _data : null;
  }, [_data, loading]);

  useEffect(() => {
    if (data?.units) {
      setDisplayUnits(data?.units);
    }
  }, [data?.units]);

  const handleSubmit = (e: React.SyntheticEvent<QueryFormElement>): void => {
    e.preventDefault();
    const value = e.currentTarget.elements.queryInput.value;

    setQuery(value);
  };

  const formatTemp = (value: number) => {
    return formatTempreature(value, displayUnits ?? Unit.metric);
  };

  return (
    <main>
      <aside
        id="default-sidebar"
        className="fixed top-0 left-0 z-40 w-96 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 bg-primary">
          <div className="">
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"></div>
                <input
                  type="search"
                  id="queryInput"
                  name="search"
                  className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search"
                />
                <button
                  disabled={loading || !query}
                  type="submit"
                  className="text-white absolute right-2.5 bottom-2.5 bg-white hover:bg-teritary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <svg
                    className="w-5 h-5 text-black hover:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {error ? (
            <div className="w-full h-full">
              <h1 className="text-3xl m-10">Oops something went wrong :(</h1>
              <h1 className="text-2xl m-10">Please try again later.</h1>
            </div>
          ) : loading ? (
            <Loader />
          ) : data?.address && !loading ? (
            <ul className="space-y-6 font-medium text-center mt-20">
              <li>
                <h1 className="text-3xl">{data.address}</h1>
              </li>
              <li>
                <h2 className="text-2xl">{formatDate(data.date)}</h2>
              </li>
              <li>
                <Image
                  className="mx-auto"
                  alt={data.icon}
                  width={200}
                  height={50}
                  src={`/icons/${data.icon}.svg`}
                />
              </li>
              <li>
                <h1 className="text-3xl">{formatTemp(data.currentTemp)}</h1>
              </li>
              <li>
                <h1 className="text-2xl">{data.conditions}</h1>
              </li>
            </ul>
          ) : (
            <div className="w-full h-full">
              <h1 className="text-2xl m-10">
                No results found for <i>{query}</i>
              </h1>
              <h1 className="text-xl m-10">Please try another search</h1>
            </div>
          )}
        </div>
      </aside>

      <div className="p-4 sm:ml-64 bg-secondary h-screen ">
        {(!loading && !data?.name) ||
          (!error && (
            <div className="w-2/3 mx-auto">
              <div className="p-4 flex flex-row-reverse ">
                {Object.keys(Unit).map((unit, idx) => {
                  const classes =
                    unit === displayUnits
                      ? "bg-white text-black"
                      : "bg-teritary text-white";
                  return (
                    <a
                      onClick={() => {
                        setDisplayUnits(unit as Unit);
                      }}
                      key={idx}
                      className={`${classes} cursor-pointer rounded-full ml-2 p-2 w-10 h-9"`}
                    >
                      °{unit === Unit.metric ? "C" : "F"}
                    </a>
                  );
                })}
              </div>
              <div className="p-4">
                <h2 className="text-2xl mb-4">Daily Overview</h2>
                {loading ? (
                  <Loader />
                ) : data?.address && !loading ? (
                  <div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <Card title="Humdity" value={`${data.humidity}%`}>
                        <Progress value={data.humidity ?? 0} />
                      </Card>
                      <Card title="Cloud Cover" value={`${data.cloudCover}%`}>
                        <Progress value={data.cloudCover ?? 0} />
                      </Card>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <Card title="Min Temp" value={formatTemp(data.minTemp)} />
                      <Card title="Max Temp" value={formatTemp(data.maxTemp)} />
                      <Card
                        title="Sunrise"
                        value={formatHours(data.sunRiseTime)}
                      />
                      <Card
                        title="Sunset"
                        value={formatHours(data.sunSetTime)}
                      />
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="p-4 inline-flex w-full flex-col">
                <h2 className="text-2xl mb-4 h-24">
                  {data?.days?.length} Day Forecast
                </h2>

                <div className="grid grid-cols-5 gap-4 mb-4">
                  {loading ? (
                    <Loader />
                  ) : data && data.days.length ? (
                    data.days.map((data, idx) => {
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-center h-24 rounded bg-primary dark:bg-gray-800"
                        >
                          <Card
                            tall
                            title={formatDate(data.date)}
                            value={`${formatTemp(data.maxTemp)} / 
                        ${formatTemp(data.minTemp)}`}
                          >
                            <Image
                              alt={data.icon}
                              width={100}
                              height={50}
                              src={`/icons/${"cloudy"}.svg`}
                            />
                          </Card>
                        </div>
                      );
                    })
                  ) : null}
                </div>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}
