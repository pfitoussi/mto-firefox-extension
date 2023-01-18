import { filterInput, createUrl } from '../utils.js';
const targets = [
  'https://api-v2.soundcloud.com/*comments',
  'https://api-v2.soundcloud.com/*comments?*',
];

browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: 'multiple-tab-opener',
    type: 'normal',
    title: 'Open in multiple tab',
    contexts: ['selection'],
    checked: true,
  });
});

browser.runtime.onMessage.addListener((request) => {
  return openMultipleUrl(request);
});

let bufferByRequest = {};
browser.webRequest.onBeforeRequest.addListener(
  ({ requestId }) => {
    const filter = browser.webRequest.filterResponseData(requestId);
    const decoder = new TextDecoder('utf-8');

    filter.ondata = (event) => {
      if (bufferByRequest.hasOwnProperty(requestId))
        bufferByRequest[requestId].push(decoder.decode(event.data));
      else
        Object.assign(bufferByRequest, {
          [requestId]: [decoder.decode(event.data)],
        });
      filter.write(event.data);
    };

    filter.onstop = (_) => {
      const result = Object.values(bufferByRequest)
        .flatMap((buffers) => buffers.join(''))
        .map((payload) => JSON.parse(payload));

      console.log(result);
      filter.disconnect();
    };

    filter.onerror = (event) => {
      console.log(`Error: ${filter.error}`);
      console.log(event);
    };

    return {};
  },
  { urls: targets },
  ['blocking']
);

browser.contextMenus.onClicked.addListener(
  async ({ menuItemId, selectionText }) => {
    switch (menuItemId) {
      case 'multiple-tab-opener': {
        const { prefixUrl } = await browser.storage.local.get('prefixUrl');
        openMultipleUrl(
          createUrl(
            selectionText,
            prefixUrl ?? 'https://www.google.com/search?q='
          )
        );
        break;
      }
      default:
        throw new Error('Unexpected behavior');
    }
  }
);

const openMultipleUrl = (toParse) =>
  Promise.allSettled(
    filterInput(toParse).map((url) =>
      browser.tabs.create({ url, active: false })
    )
  )
    .catch(console.error)
    .finally(window.close);
