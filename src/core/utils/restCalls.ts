import * as https from "https";

export async function sendData(url: string, body: string): Promise<void> {
  const parsedUrl = new URL(url);

  const options: https.RequestOptions = {
    hostname: parsedUrl.hostname,
    port: 443,
    path: parsedUrl.pathname,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(body),
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      // eslint-disable-next-line no-console
      console.log(`Status Code: ${res.statusCode}`);

      res.on("data", (d) => {
        process.stdout.write(d);
      });

      res.on("end", resolve);
    });

    req.on("error", reject);

    req.write(body);
    req.end();
  });
}
