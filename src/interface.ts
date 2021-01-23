// 定义类型参考 https://github.com/stefanpenner/es6-promise/blob/master/es6-promise.d.ts
// 定义的 Thenable
export interface Thenable <R> {
  then <U> (onFulfilled?: (value: R) => U | Thenable<U>, onRejected?: (error: any) => U | Thenable<U>): Thenable<U>;
  then <U> (onFulfilled?: (value: R) => U | Thenable<U>, onRejected?: (error: any) => void): Thenable<U>;
}

export interface IDeferred {
  promise: I_Promise<void>;
  resolve: (value?: any | Thenable<any>) => void;
  reject: (error?: any) => void;
}

export interface I_Resolve<R> {
  (value?: R | Thenable<R>): void;
}

export interface I_Reject {
  (error?: any): void;
}

export interface IExecute {
  (resolve?: I_Resolve<any>, reject?: I_Reject): void;
}

export interface I_Promise<R> extends Thenable<R> {
  status: 'pending' | 'fulfilled' | 'rejected';
  value: R | void;
  reason: R | void;

  _resolve: (value?: R | Thenable<R>) => void;
  _reject: (error?: any) => void;

  catch<U>(onRejected?: (error: any) => U | Thenable<U>): I_Promise<U>;
}

export interface I_Resolved_handle {
  (
    promise: I_Promise<any>,
    x: Thenable<any> | any,
    promiseFulfilled: I_Resolve<any>,
    promiseRejected: I_Reject,
  ): void;
}
