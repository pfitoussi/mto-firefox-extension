export const filterInput = (text) => text.split('\n').filter((e) => !!e);

export const createUrl = (text, prefixUrl) =>
  filterInput(text).reduce(
    (acc, cur) => `${acc}${prefixUrl}${encodeURI(cur)}\n`,
    ''
  );
