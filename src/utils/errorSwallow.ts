export default function errorSwallow<TReturn, TError>(func: () => TReturn) {
  try {
    return func();
  } catch (ex) {
    return ex as TError;
  }
}
