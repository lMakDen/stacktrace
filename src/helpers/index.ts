import isArray from "lodash/isArray";

const parseNormalJson = (str) => {
  try {
    /**
     * Normal JSON like:
     * {"0":{"functionName":"Object.l","fileName":"https://cdn.pdffiller.com/jsfiller/live/jsfiller/develop.11714/assets/client.90ad5511.chunk.js","lineNumber":1,"columnNumber":277021,"source":"    at Object.l (https://cdn.pdffiller.com/jsfille…p.11714/assets/client.90ad5511.chunk.js:1:277021)"},"1":{"fileName":"https://cdn.pdffiller.com/jsfiller/live/jsfiller/develop.11714/assets/client.90ad5511.chunk.js","lineNumber":1,"columnNumber":465867,"source":"    at https://cdn.pdffiller.com/jsfiller/live/jsf…op.11714/assets/client.90ad5511.chunk.js:1:465867"},"2":{"functionName":"t.exports","fileName":"https://cdn.pdffiller.com/vendors-commons/6.0.4/commons.90820ffd2fec779ebed9.js","lineNumber":58,"columnNumber":21194,"source":"    at t.exports (https://cdn.pdffiller.com/vendor…s/6.0.4/commons.90820ffd2fec779ebed9.js:58:21194)"}}
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
     * {'0':{'functionName':'Object.l','fileName':'https://cdn.pdffiller.com/jsfiller/live/jsfiller/develop.11714/assets/client.90ad5511.chunk.js','lineNumber':1,'columnNumber':277021,'source':'    at Object.l (https://cdn.pdffiller.com/jsfille…p.11714/assets/client.90ad5511.chunk.js:1:277021)'},'1':{'fileName':'https://cdn.pdffiller.com/jsfiller/live/jsfiller/develop.11714/assets/client.90ad5511.chunk.js','lineNumber':1,'columnNumber':465867,'source':'    at https://cdn.pdffiller.com/jsfiller/live/jsf…op.11714/assets/client.90ad5511.chunk.js:1:465867'},'2':{'functionName':'t.exports','fileName':'https://cdn.pdffiller.com/vendors-commons/6.0.4/commons.90820ffd2fec779ebed9.js','lineNumber':58,'columnNumber':21194,'source':'    at t.exports (https://cdn.pdffiller.com/vendor…s/6.0.4/commons.90820ffd2fec779ebed9.js:58:21194)'}}
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
     * {0: {functionName: "Object.l", fileName: "https://cdn.pdffiller.com/jsfiller/live/jsfiller/develop.11714/assets/client.90ad5511.chunk.js", lineNumber: 1, columnNumber: 277021, source: "    at Object.l (https://cdn.pdffiller.com/jsfille…p.11714/assets/client.90ad5511.chunk.js:1:277021)"}, 1: {fileName: "https://cdn.pdffiller.com/jsfiller/live/jsfiller/develop.11714/assets/client.90ad5511.chunk.js", lineNumber: 1, columnNumber: 465867, source: "    at https://cdn.pdffiller.com/jsfiller/live/jsf…op.11714/assets/client.90ad5511.chunk.js:1:465867"}, 2: {functionName: "t.exports", fileName: "https://cdn.pdffiller.com/vendors-commons/6.0.4/commons.90820ffd2fec779ebed9.js", lineNumber: 58, columnNumber: 21194, source: "    at t.exports (https://cdn.pdffiller.com/vendor…s/6.0.4/commons.90820ffd2fec779ebed9.js:58:21194)"}}
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
   * at pe (https://cdn.pdffiller.com/jsfiller/live/jsfiller/release-2.23.8-JSF-2020-12-30.12644/assets/LazyRoot.4df6eaf8.chunk.js:1:60478)
   * at de (https://cdn.pdffiller.com/jsfiller/live/jsfiller/release-2.23.8-JSF-2020-12-30.12644/assets/LazyRoot.4df6eaf8.chunk.js:1:60826)
   * at e.onChangeScales (https://cdn.pdffiller.com/jsfiller/live/jsfiller/release-2.23.8-JSF-2020-12-30.12644/assets/LazyRoot.4df6eaf8.chunk.js:1:67206)
   * at Array.<anonymous> (https://cdn.pdffiller.com/jsfiller/live/jsfiller/release-2.23.8-JSF-2020-12-30.12644/assets/LazyRoot.4df6eaf8.chunk.js:1:67792)
   *   at g (https://cdn.pdffiller.com/vendors-commons/6.0.4/commons.90820ffd2fec779ebed9.js:21:4119)
   * at https://cdn.pdffiller.com/jsfiller/live/jsfiller/release-2.23.8-JSF-2020-12-30.12644/assets/client.ca9f297a.chunk.js:39:37612
   *   at https://cdn.pdffiller.com/jsfiller/live/jsfiller/release-2.23.8-JSF-2020-12-30.12644/assets/client.ca9f297a.chunk.js:50:46746
   *   at https://cdn.pdffiller.com/jsfiller/live/jsfiller/release-2.23.8-JSF-2020-12-30.12644/assets/vendors~managers.e25944d0.chunk.js:24:169652
   *   at https://cdn.pdffiller.com/jsfiller/live/jsfiller/release-2.23.8-JSF-2020-12-30.12644/assets/vendors~managers.e25944d0.chunk.js:24:158632
   *   at https://cdn.pdffiller.com/jsfiller/live/jsfiller/release-2.23.8-JSF-2020-12-30.12644/assets/vendors~managers.e25944d0.chunk.js:40:40237
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
