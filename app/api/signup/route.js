export async function POST(req) {
  try {
    const body = await req.json(); 
    console.log("Request body:", body); // check incoming data

    const res = await fetch("https://atologistinfotech.com/api/register.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await res.text(); // read as text first
    console.log("API response:", text);

    // Try to parse JSON safely
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text }; 
    }

    return new Response(JSON.stringify(data), { status: res.ok ? 200 : res.status });
  } catch (err) {
    console.error("Error in API route:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
