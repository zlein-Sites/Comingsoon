// Serverless function backing the dashboard's realtime storage.
//
// Storage: Netlify Blobs (https://docs.netlify.com/blobs/overview/) — a simple
// key/value store that comes with every Netlify site, no extra provisioning or
// credentials needed once this function is deployed.
//
// Endpoints (both live at /.netlify/functions/data):
//   GET   -> returns the current { projects, updatedAt } JSON blob, or null
//            if nothing has been saved yet.
//   POST  -> accepts { projects }, stamps it with the current time as
//            `updatedAt`, saves it, and returns the stamped record.
//
// The front end polls GET every few seconds so open browsers pick up changes
// made elsewhere, and calls POST (debounced) after every local edit.

import { getStore } from "@netlify/blobs";

const STORE_NAME = "delivery-dashboard";
const KEY = "state";

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export default async (req) => {
  const store = getStore(STORE_NAME);

  if (req.method === "GET") {
    const existing = await store.get(KEY, { type: "json" });
    return json(existing || null);
  }

  if (req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid JSON body" }, 400);
    }
    if (!body || !Array.isArray(body.projects)) {
      return json({ error: "Expected { projects: [...] }" }, 400);
    }

    const record = { projects: body.projects, updatedAt: Date.now() };
    await store.setJSON(KEY, record);
    return json(record);
  }

  return json({ error: "Method not allowed" }, 405);
};
