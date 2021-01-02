import {
  I_Promise,
  IExecute,
  Thenable,
} from './interface';
import { warpFunctionByAny, delayCallback } from './utils';
import Resolve from './Resolve';

export default class _Promise<R> implements I_Promise<R> {
  status;
  value;
  reason;
  private resolveHandler = [];
  private rejectHandler = [];

  constructor(execute: IExecute) {
    this.status = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this._init(execute);
  }

  private _init = (execute: IExecute) => {
    try {
      execute(this._resolve, this._reject);
    } catch (error) {
      this._reject(error);
    }
  };

  _resolve = value => {
    delayCallback(() => {
      // 只在 pending 的时候执行一次
      if (this.status === 'pending') {
        this.status = 'fulfilled';
        this.value = value;
        this.resolveHandler.forEach(handler => handler(this.value));
      }
    });
  };

  _reject = error => {
    delayCallback(() => {
      // 只在 pending 的时候执行一次
      if (this.status === 'pending') {
        this.status = 'rejected';
        this.reason = error;
        // 没注册任何 catch 的时候输出一下错误提示
        if (this.rejectHandler.length) {
          this.rejectHandler.forEach(errorHandler => errorHandler(this.reason));
        } else {
          // console.error(this.reason);
        }
      }
    });
  };

  // 难点 onFulfilled 和 onRejected 有可能为 thenable
  then = (onFulfilled, onRejected) => {
    // 2.2.1  onFulfilled or onRejected not function must be ignored
    onFulfilled = warpFunctionByAny(onFulfilled);
    onRejected = typeof onRejected === 'function' ? onRejected : function (reason) { throw reason };

    let promise2;

    // 2.2.7 then must be return a promise
    switch(this.status) {
      case 'fulfilled':
      case 'rejected':
        promise2 = new _Promise((resolve, reject) => {
          delayCallback(() => {
            try {
              let x = this.status === 'fulfilled' ? onFulfilled(this.value) : onRejected(this.reason);
              Resolve(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
        break;
      // pending 阶段为注册，需要注册一个函数列表按照顺序执行
      case 'pending':
        promise2 = new _Promise((resolve, reject) => {
          this.resolveHandler.push(value => {
            try {
              let x = onFulfilled(value);
              Resolve(promise2, x, resolve, reject);
            } catch(error) {
              reject(error);
            }
          });
          this.rejectHandler.push(reason => {
            try {
              let x = onRejected(reason);
              Resolve(promise2, x, resolve, reject);
            } catch(error) {
              reject(error);
            }
          });
        });
    }
    return promise2;

  };
 
  catch(onRejected) {
    return this.then(null, onRejected);
  }
}

_Promise.resolve = function (x) {
  return new _Promise((resolve) => resolve(x));
}

// interface for test
_Promise.deferred = function() {
  let resolve: (value?: any | Thenable<any>) => void;
  let reject: (error?: any) => void;
  let promise = new _Promise((r, j) => {
    resolve = r;
    reject = j;
  });
  return {
    promise: promise as any,
    resolve,
    reject,
  };
}

// com module export for test
module.exports = _Promise;
