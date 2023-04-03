import { filterInput, createUrl } from '../utils.js';
const commentTargets = [
  'https://api-v2.soundcloud.com/tracks/*/comments',
  'https://api-v2.soundcloud.com/tracks/*/comments?*',
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

browser.runtime.onMessage.addListener((message) => {
  if (message.type === 'open') openMultipleUrl(message.data);
});

let store = {};
const aggregateComments = ({ trackId, data }) => {
  if (store[trackId]) store[trackId] = [...store[trackId], ...data.collection];
  else store[trackId] = [...data.collection];
  if (data.next_href) fetch(data.next_href);
};

const trackIdReg = /tracks\/(\d+)\/comments/;
browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (!details.url.match(/.*limit=200.*/)) return {};
    const filter = browser.webRequest.filterResponseData(details.requestId);
    const decoder = new TextDecoder('utf-8');
    const encoder = new TextEncoder();
    const trackId = details.url.match(trackIdReg)[1];

    const data = [];

    filter.ondata = (event) => {
      data.push(event.data);
    };

    filter.onstop = () => {
      let str = '';
      for (const buffer of data) {
        str += decoder.decode(buffer, { stream: true });
      }
      str += decoder.decode();

      aggregateComments({ trackId, data: JSON.parse(str) });
      console.log('Store: ', store);
      filter.write(encoder.encode(str));
      filter.close();
    };

    filter.onerror = (event) => {
      // console.log(`Error: ${filter.error}`);
      // console.log(event);
      // console.log(details);
    };

    return {};
  },
  { urls: commentTargets },
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
