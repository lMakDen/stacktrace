import isArray from "lodash/isArray";

interface StackTraceLine {
  functionName?: string;
  fileName: string;
  lineNumber: number;
  columnNumber: number;
  source?: string;
}

const parseNormalJson = (str: string): StackTraceLine[] | false => {
  try {
    /**
     * Normal JSON like:
     * {"0":{"functionName":"Object.l","fileName":"url","lineNumber":1,"columnNumber":277021,"source":"    at Object.l (url)"},"1":{"fileName":"url","lineNumber":1,"columnNumber":465867,"source":"    at url"},"2":{"functionName":"t.exports","fileName":"url","lineNumber":58,"columnNumber":21194,"source":"    at t.exports (url)"}}
     */
    const parsedStackTrace = JSON.parse(str);
    const arr = isArray(parsedStackTrace)
      ? parsedStackTrace
      : (parsedStackTrace as any) ? Object.values(parsedStackTrace) : [];

    return arr;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return false;
  }
};

function parseBadJson(str: string): StackTraceLine[] | false {
  try {
    /**
     * Bad JSON like:
     * {'0':{'functionName':'Object.l','fileName':'url','lineNumber':1,'columnNumber':277021,'source':'    at Object.l (url)'},'1':{'fileName':'url','lineNumber':1,'columnNumber':465867,'source':'    at url'},'2':{'functionName':'t.exports','fileName':'url','lineNumber':58,'columnNumber':21194,'source':'    at t.exports (url)'}}
     */
    const parsedStackTrace = JSON.parse(str.replace(/'/g, '"'));
    const arr = isArray(parsedStackTrace)
      ? parsedStackTrace
      : (parsedStackTrace as any) ? Object.values(parsedStackTrace) : [];

    // eslint-disable-next-line no-console
    console.log("bad json");
    return arr;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return false;
  }
}

function parseObjectLinkJson(str: string): StackTraceLine[] | false {
  try {
    /**
     * Bad JSON like:
     * {0: {functionName: "Object.l", fileName: "url", lineNumber: 1, columnNumber: 277021, source: "    at Object.l (url)"}, 1: {fileName: "url", lineNumber: 1, columnNumber: 465867, source: "    at url"}, 2: {functionName: "t.exports", fileName: "url", lineNumber: 58, columnNumber: 21194, source: "    at t.exports (url)"}}
     */
    // eslint-disable-next-line no-eval
    const parsedStackTrace = eval(`[${str}]`)[0];
    const arr = isArray(parsedStackTrace)
      ? parsedStackTrace
      : (parsedStackTrace as any) ? Object.values(parsedStackTrace) : [];

    return arr;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return false;
  }
}

function parseStringStacktrace(str: string): StackTraceLine[] {
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
   * 
   * Также поддерживает формат:
   * Error: Network Error at ? (https://static-ak.pdffiller.com/frontend/ShellApp/142100/ShellApp.js:1:41510) at async Promise.all (index 0:0:0) at async r (https://static-ak.pdffiller.com/frontend/MyDocsApp/873100/MyDocsApp.js:1:114955)
   */
  const regExp = /\(?(https:\/\/[^:]+):(\d+):(\d+)\)?/gm;
  const matchAll = (str as any).matchAll(regExp);
  const matchArray = (Array as any).from(matchAll);
  return matchArray.map((match: any) => {
    return {
      fileName: match[1],
      lineNumber: +match[2],
      columnNumber: +match[3],
    };
  });
}

export const parse = (str: string): StackTraceLine[] | false => {
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
