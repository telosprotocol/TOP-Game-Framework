import AsyncStateItem from '@/controller/AsyncStateItem';
type JsonFileType = Record<string, any>;
const jsonFileMap: Record<string, AsyncStateItem<JsonFileType>> = {};

function loadJsonFile(path: string) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', path, true);
  xhr.responseType = 'json';
  xhr.send();
  return new Promise<JsonFileType>((resolve, reject) => {
    xhr.onreadystatechange = function () {
      if (!xhr || xhr.readyState !== 4) {
        return;
      }
      if (
        xhr.status === 0 &&
        !(xhr.responseURL && xhr.responseURL.indexOf('file:') === 0)
      ) {
        return;
      }
      resolve(xhr.response);
    };
    xhr.onerror = function () {
      reject();
    };
  });
}

/**
 *         （    ）
 * @param absPath
 * @returns
 */
export function requireJsonFile(absPath: string) {
  let stateItem = jsonFileMap[absPath];
  if (!stateItem) {
    stateItem = new AsyncStateItem(() => {
      return loadJsonFile(absPath);
    });
  }
  return stateItem.getValue();
}
