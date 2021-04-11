const txtArea = document.getElementById('urls');
const results = document.getElementById('results');
const btn = document.getElementById('submit');
const engines = document.getElementById('engines');

const prefix = {
  google: 'https://www.google.com/search?q=',
  qwant: 'https://www.qwant.com/?q=',
  bing: 'https://www.bing.com/search?q=',
};

const createUrl = (text, engine) =>
  text
    .split('\n')
    .filter((e) => !!e)
    .reduce((acc, cur) => `${acc}${prefix[engine]}${encodeURI(cur)}\n`, '');

btn.onclick = () =>
  Promise.allSettled(
    results.innerText
      .split('\n')
      .filter((url) => !!url)
      .map((url) => browser.tabs.create({ url, active: false }))
  )
    .catch(console.error)
    .finally(() => window.close());

txtArea.addEventListener('input', (event) => {
  results.innerText = createUrl(event.target.value, engines.value);
});

engines.addEventListener('change', (event) => {
  results.innerText = createUrl(txtArea.value, event.target.value);
});
