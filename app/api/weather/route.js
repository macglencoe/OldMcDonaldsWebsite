export async function GET(req) {
  const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API_KEY}&q=Berkeley County, WV&days=14`)
  const data = await res.json()

  return Response.json(data)
}
