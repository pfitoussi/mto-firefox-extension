const urlTargets = document.getElementById('urls');
const results = document.getElementById('results');
const btn = document.getElementById('submit');
const engines = document.getElementById('engines');

const prefix = {
  Google: 'https://www.google.com/search?q=',
  Qwant: 'https://www.qwant.com/?q=',
  Bing: 'https://www.bing.com/search?q=',
  Lilo: 'https://search.lilo.org/results.php?q=',
};

const filterInput = (text) => text.split('\n').filter((e) => !!e);

const createUrl = (text, engine) =>
  filterInput(text).reduce(
    (acc, cur) => `${acc}${prefix[engine]}${encodeURI(cur)}\n`,
    ''
  );

const loadPrefix = Object.keys(prefix).forEach((key) => {
  const child = document.createElement('option');
  child.setAttribute('value', key);
  child.innerText = key;
  engines.appendChild(child);
});

btn.onclick = () =>
  Promise.allSettled(
    filterInput(results.innerText).map((url) =>
      browser.tabs.create({ url, active: false })
    )
  )
    .catch(console.error)
    .finally(window.close);

document.addEventListener('loadEnd', loadPrefix, { once: true });

urlTargets.addEventListener('input', (event) => {
  results.innerText = createUrl(event.target.value, engines.value);
});

engines.addEventListener('change', (event) => {
  results.innerText = createUrl(urlTargets.value, event.target.value);
});
