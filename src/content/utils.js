const waitForElm = (selector) => {
  return new Promise((resolve) => {
    const observed = document.querySelector(selector);
    if (observed) {
      return resolve(observed);
    }

    const observer = new MutationObserver((_) => {
      const observed = document.querySelector(selector);
      if (observed) {
        resolve(observed);
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
};