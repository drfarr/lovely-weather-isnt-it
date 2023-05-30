import WeatherAPI from "@/utils/WeatherAPI.class";
import { NextResponse } from "next/server";
/**
 * Wrapper for a next response makes the code a bit easier to read.
 * @param { data, status, message }
 * @returns  NextResponse<{ data: unknown; message: string; }>
 */
const jsonResponse = ({
  data,
  status,
  message,
}: {
  data: unknown;
  status: number;
  message: string;
}) => {
  return NextResponse.json(
    {
      data,
      message,
    },
    { status }
  );
};

/**
 * An endpoint so we can internally consume external calls to weather apis.
 * @param request
 * @returns
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  if (!query) {
    return jsonResponse({
      data: [],
      message: "No query string provided",
      status: 400,
    });
  }

  try {
    const api = new WeatherAPI();
    await api.query(query);
    const data = api.getData();
    if (data) {
      return jsonResponse({
        data,
        message: "ok",
        status: 200,
      });
    } else {
      return jsonResponse({
        data: [],
        message: "No data",
        status: 200,
      });
    }
  } catch (error) {
    console.error(error);
    return jsonResponse({
      data: [],
      message: error as string,
      status: 500,
    });
  }
}
