let delayHandler;

declare function requestIdleCallback(callback: Function): void;

// 模拟微任务，使用 requestIdleCallback / setTimeOut
export function delayCallback(callback: Function) {
  if (!delayHandler) {
    if (typeof requestIdleCallback === 'function') {
      delayHandler = requestIdleCallback;
    } else if (typeof process !== 'undefined') {
      delayHandler = process.nextTick;
    } else {
      delayHandler = function (handler) {
        setTimeout(handler, 0);
      }
    }
  }
  delayHandler(callback);
}

function placeHolderFunc(v) {
  return v;
}

export function warpFunctionByAny(target: any) {
  if (typeof target === 'function') {
    return target;
  }
  return placeHolderFunc;
}
