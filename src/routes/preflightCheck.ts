const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "*",
}

export default async (): Promise<Response> => {
  return new Response('OK', { headers: corsHeaders })
}
