import { createUrl } from './utils.js';

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

const loadPrefix = Object.keys(prefix).forEach((key) => {
  const child = document.createElement('option');
  child.setAttribute('value', key);
  child.innerText = key;
  engines.appendChild(child);
});

btn.onclick = () => browser.runtime.sendMessage(results.innerText);

document.addEventListener('loadEnd', loadPrefix, { once: true });

urlTargets.addEventListener('input', (event) => {
  results.innerText = createUrl(event.target.value, prefix[engines.value]);
});

engines.addEventListener('change', async (event) => {
  await browser.storage.local.set({ prefixUrl: prefix[event.target.value] });
  results.innerText = createUrl(urlTargets.value, prefix[event.target.value]);
});
