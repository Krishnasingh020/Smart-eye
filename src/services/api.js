// small helper: fetch /vehicles or fallback to websocket
export async function fetchVehicles() {
  try {
    const res = await fetch("http://127.0.0.1:8000/vehicles");
    if (!res.ok) throw new Error("Bad /vehicles response");
    return await res.json();
  } catch (e) {
    console.error("fetchVehicles error:", e);
    return null;
  }
}
