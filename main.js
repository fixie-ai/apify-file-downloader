const Apify = require('apify');
const got = require("got");

Apify.main(async () => {
    const { url } = await Apify.getValue('INPUT');
    console.log('Downloading URL: ', url);
    try {
      const rawData = await got(url).buffer();
      const b64Data = rawData.toString("base64");
      console.log(`Successfully downloaded ${url}: ${rawData.length} bytes`);
      await Actor.pushData({ url: input.url, data: b64Data });
    } catch (error) {
      console.error(`There was a problem with the fetch operation for ${url}: ${error}`);
      return null;
    }
});

