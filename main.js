import { Actor } from "apify";
import got from "got";

await Actor.init();

const { url, datasetId } = await Actor.getInput();

console.log(`Requested dataset ID is ${datasetId}`);
let dataset;
if (datasetId) {
  console.log(`Getting specific dataset`);
  dataset = await Actor.openDataset(datasetId);
} else {
  console.log(`Getting default dataset`);
  dataset = await Actor.openDataset();
}
const actualDatasetId = dataset.getInfo().id;
console.log(`Downloading ${url} to dataset ${actualDatasetId}`);

try {
  const response = await got(url);
  if (!response || !response.ok) {
    throw new Error(`Error fetching ${url}: ${response}`);
  }
  const rawData = response.rawBody;
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
