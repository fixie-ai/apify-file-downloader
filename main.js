import { Actor } from "apify";
import got from "got";

await Actor.init();

const { url, datasetId } = await Actor.getInput();

const dataset = await Actor.openDataset(datasetId);

console.log(`Downloading ${url} to dataset ${datasetId}`);

try {
  const response = await got(url);
  const rawData = response.buffer();
  const b64Data = rawData.toString("base64");
  console.log(`Successfully downloaded ${url}: ${rawData.length} bytes`);
  await dataset.pushData({
    url: url,
    mimeType: response.headers["content-type"],
    data: b64Data,
    dataLength: rawData.length,
    timestamp: new Date().toISOString(),
  });
} catch (error) {
  console.error(
    `There was a problem with the fetch operation for ${url}: ${error}`
  );
}

await Actor.exit();
