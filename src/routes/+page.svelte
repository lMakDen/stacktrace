<script lang="ts">
  import uniqBy from "lodash/uniqBy";

  import TextArea from "../components/TextArea.svelte";
  import Button from "../components/Button.svelte";
  import List from "../components/List.svelte";

  import { parse } from "../helpers";
  import StackTraceGPS from "stacktrace-gps";

  const jsfillerPathRegExp = /.*\/jsfiller(?!\/node_modules)\/(.*)/;

  let stacktraces: string = "";
  let messageList: string[] = [];

  const decryptStackTrace = async (line: {
    columnNumber: number;
    lineNumber: number;
    fileName: string;
  }) => {
    const gps = new StackTraceGPS();
    const decrypted = await gps.pinpoint({
      columnNumber: line.columnNumber,
      lineNumber: line.lineNumber,
      fileName: line.fileName,
    });
    const fullPath = `${decrypted.fileName}:${decrypted.lineNumber}:${decrypted.columnNumber}`;
    const isFileFromJSF = fullPath.match(jsfillerPathRegExp);
    const message = `is from JSF ${!!isFileFromJSF}, stacktrace decrypted ----> ${fullPath}`;
    messageList = [...messageList, message];
  };

  const handleOnClick = async () => {
    try {
      const arr = parse(stacktraces);
      if (!arr) {
        throw new Error("Parsing error");
      }
      const stacktrace = uniqBy(
        arr,
        (line: {
          fileName: string;
          lineNumber: number;
          columnNumber: number;
        }) => {
          return `${line.fileName}:${line.lineNumber}:${line.columnNumber}`;
        }
      );

      messageList = [];

      for (const line of Object.values(stacktrace)) {
        await decryptStackTrace(line);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTextAreaChange = ({ target }) => {
    stacktraces = target.value;
  };
</script>

<div class="workspace">
  <TextArea onChange={handleTextAreaChange} />
  <Button onClick={handleOnClick} />
  <List list={messageList} />
</div>

<style>
  .workspace_body {
    overflow: hidden;
  }
</style>
