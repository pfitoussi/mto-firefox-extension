const filterInput = (text) => text.split('\n').filter((e) => !!e);

const createUrl = (text, prefixUrl) =>
  filterInput(text).reduce(
    (acc, cur) => `${acc}${prefixUrl}${encodeURI(cur)}\n`,
    ''
  );

export { filterInput, createUrl };
