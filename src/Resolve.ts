import _Promise from './index';
import { I_Resolved_handle } from './interface';


const resolvedByX: I_Resolved_handle = function (promise, x, promiseFulfilled, promiseRejected) {
  switch(x.status) {
    case 'pending':
      // x 可能是个循环的 promise 链
      x.then(function (value) {
        // value 也可能还为promise
        Resolve(promise, value, promiseFulfilled, promiseRejected);
      }, promiseRejected);
      break;
    case 'fulfilled':
      promiseFulfilled(x.value);
      break;
    case 'rejected':
      promiseRejected(x.reason);
      break;
  }
}

const resolvedByXThen: I_Resolved_handle = function (promise, x, promiseFulfilled, promiseRejected) {
  // 首先取得 x 的then
  let then;
  let executionFlag = false;
  try {
    then = x.then;
  } catch (error) {
    promiseRejected(error);
  }

  // 下防的 fulfilled / rejected 以及 抓取 then.call 的错误只需要执行一个
  if (typeof then === 'function') {
    // y 也可能为 thenable
    function fulfilled (y) {
      if (executionFlag) return;
      executionFlag = true;
      Resolve(promise, y, promiseFulfilled, promiseRejected);
    }
    function rejected (reason) {
      if (executionFlag) return;
      executionFlag = true;
      promiseRejected(reason);
    }
    try {
      then.call(x, fulfilled, rejected);
    } catch (error) {
      if (executionFlag) return;
      executionFlag = true;
      promiseRejected(error);
    }
  } else {
    promiseFulfilled(x);
  }
}

// 2.3 [[Resolve]] then Promise Resolution Procedure
// x 为 thenable时，尽可能的兼容和展开x。否则直接使用x fulfilled promise 
const Resolve: I_Resolved_handle = function (promise, x, promiseFulfilled, promiseRejected) {
  // same object TypeError
  if (promise === x) {
    throw new TypeError('same object');
  }
  // 如果 x 为 promise 根据 x 的状态来决定 resolve/reject 当前的 promise
  if (x instanceof _Promise) {
    resolvedByX(promise, x, promiseFulfilled, promiseRejected);
  // 这一步是为了让所有的promise实现库兼容其他的promise库
  } else if (
    Object.prototype.toString.call(x) === '[object Object]'
    ||
    Object.prototype.toString.call(x) === '[object Function]'
  ) {
    resolvedByXThen(promise, x, promiseFulfilled, promiseRejected);
  } else {
    promiseFulfilled(x);
  }
}

export default Resolve;

