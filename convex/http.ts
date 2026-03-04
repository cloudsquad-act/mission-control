import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/healthz",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    return new Response("Mission Control Online", { status: 200 });
  }),
});

export default http;
