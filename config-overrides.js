const { override, fixBabelImports, addLessLoader, addWebpackPlugin } = require('customize-cra');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({ // less
    javascriptEnabled: true,
    modifyVars: { '@primary-color': '#4E1FCF'} // 主题色
  }),
  addWebpackPlugin(new AntdDayjsWebpackPlugin())
);