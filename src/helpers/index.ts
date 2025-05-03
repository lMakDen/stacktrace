import isArray from "lodash/isArray";

const parseNormalJson = (str) => {
  try {
    /**
     * Normal JSON like:
     * {"0":{"functionName":"Object.l","fileName":"url","lineNumber":1,"columnNumber":277021,"source":"    at Object.l (url)"},"1":{"fileName":"url","lineNumber":1,"columnNumber":465867,"source":"    at url"},"2":{"functionName":"t.exports","fileName":"url","lineNumber":58,"columnNumber":21194,"source":"    at t.exports (url)"}}
     */
    const parsedStackTrace = JSON.parse(str);
    const arr = isArray(parsedStackTrace)
      ? parsedStackTrace
      : Object.values(parsedStackTrace);

    return arr;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return false;
  }
};

function parseBadJson(str) {
  try {
    /**
     * Bad JSON like:
     * {'0':{'functionName':'Object.l','fileName':'url','lineNumber':1,'columnNumber':277021,'source':'    at Object.l (url)'},'1':{'fileName':'url','lineNumber':1,'columnNumber':465867,'source':'    at url'},'2':{'functionName':'t.exports','fileName':'url','lineNumber':58,'columnNumber':21194,'source':'    at t.exports (url)'}}
     */
    const parsedStackTrace = JSON.parse(str.replace(/'/g, '"'));
    const arr = isArray(parsedStackTrace)
      ? parsedStackTrace
      : Object.values(parsedStackTrace);

    // eslint-disable-next-line no-console
    console.log("bad json");
    return arr;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return false;
  }
}

function parseObjectLinkJson(str) {
  try {
    /**
     * Bad JSON like:
     * {0: {functionName: "Object.l", fileName: "url", lineNumber: 1, columnNumber: 277021, source: "    at Object.l (url)"}, 1: {fileName: "url", lineNumber: 1, columnNumber: 465867, source: "    at url"}, 2: {functionName: "t.exports", fileName: "url", lineNumber: 58, columnNumber: 21194, source: "    at t.exports (url)"}}
     */
    // eslint-disable-next-line no-eval
    const parsedStackTrace = eval(`[${str}]`)[0];
    const arr = isArray(parsedStackTrace)
      ? parsedStackTrace
      : Object.values(parsedStackTrace);

    return arr;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return false;
  }
}

function parseStringStacktrace(str) {
  /**
   * TypeError: Cannot read property 'width' of undefined
   * at pe (url)
   * at de (url)
   * at e.onChangeScales (url)
   * at Array.<anonymous> (url)
   *   at g (url)
   * at url
   *   at url
   *   at url
   *   at url
   *   at url
   */
  const regExp = /\(?(https:\/\/.+):(\d+):(\d+)\)?/gm;
  const matchAll = str.matchAll(regExp);
  const matchArray = Array.from(matchAll);
  return matchArray.map((match) => {
    return {
      fileName: match[1],
      lineNumber: +match[2],
      columnNumber: +match[3],
    };
  });
}

export const parse = (str) => {
  let result = parseNormalJson(str);
  if (!result) {
    result = parseBadJson(str);
  }
  if (!result) {
    result = parseObjectLinkJson(str);
  }
  if (!result) {
    result = parseStringStacktrace(str);
  }

  return result;
};
