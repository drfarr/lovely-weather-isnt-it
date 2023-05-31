"use client";
import Card from "@/components/Card";
import useWeather from "@/hooks/useWeather";
import { formatDate, formatHours, formatTempreature } from "@/utils";
import { Unit } from "@/utils/WeatherAPI.class";
import { IWeatherResource } from "@/utils/WeatherAdapter.class";
import Image from "next/image";
import { useState } from "react";

interface FormElements extends HTMLFormControlsCollection {
  queryInput: HTMLInputElement;
}
interface QueryFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export default function Home() {
  const [query, setQuery] = useState<string>("brighton");
  const { data, error, loading } = useWeather<IWeatherResource>(query);

  if (error) {
    return "Something went wrong";
  }

  if (loading) {
    return "Loading";
  }

  if (!data?.name && !loading) {
    return "No data";
  }

  const handleSubmit = (e: React.SyntheticEvent<QueryFormElement>): void => {
    e.preventDefault();
    const value = e.currentTarget.elements.queryInput.value;

    setQuery(value);
  };

  const formatTemp = (value: number) => {
    return formatTempreature(value, data?.units ?? Unit.metric);
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

          {data && (
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
          )}
        </div>
      </aside>

      <div className="p-4 sm:ml-64 bg-secondary h-screen">
        <div className="w-2/3 mx-auto">
          <div className="p-4 ">
            <button
              type="submit"
              className="rounded-full bg-blue-700 p-2 w-9 h-9"
            >
              °F
            </button>
            <button
              type="submit"
              className="rounded-full bg-blue-700 p-2 w-9 h-9"
            >
              °C
            </button>
          </div>
          <div className="p-4">
            <h2 className="text-2xl mb-4">Daily Overview</h2>
            {data && (
              <div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Card title="Humdity" value={data.humidity} />
                  <Card title="Cloud Cover" value={data.cloudCover} />
                </div>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <Card title="Min Temp" value={formatTemp(data.minTemp)} />
                  <Card title="Max Temp" value={formatTemp(data.maxTemp)} />
                  <Card title="Sunrise" value={formatHours(data.sunRiseTime)} />
                  <Card title="Sunset" value={formatHours(data.sunSetTime)} />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 inline-flex w-full flex-col">
            <h2 className="text-2xl mb-4 h-24">
              {data?.days?.length} Day Forecast
            </h2>

            <div className="grid grid-cols-5 gap-4 mb-4">
              {data &&
                data.days.length &&
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
                })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
