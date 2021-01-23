# Promise
根据 [Promises/A+](https://promisesaplus.com/) 规范实现的 Promise，通过[promises-aplus-tests](https://github.com/promises-aplus/promises-tests)测试。

# 目录
- src/*.ts 实际书写的 ts 文件
- dist/*.js 编译出的代码
# 运行
1. 拉取仓库到本地。
2. 到仓库目录下运行 `npm install` 安装依赖。
3. `npm run start` 或者 `npm run build` 编译出 `./dist` 文件。
4. 运行 `npm run test`进行 promise 测试。

# 脚本
- npm run start 启动 ts 热编译
- npm run build 编译书写完毕的代码
- npm run test 测试编写的promise