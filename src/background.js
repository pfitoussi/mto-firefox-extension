import { filterInput, createUrl } from './utils.js';

browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: 'multiple-tab-opener',
    type: 'radio',
    title: 'Open in multiple tab',
    contexts: ['selection'],
    checked: true,
  });
});
browser.runtime.onMessage.addListener((request) => {
  return openMultipleUrl(request);
});

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
