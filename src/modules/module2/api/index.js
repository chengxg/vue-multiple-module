//全局公共全局模块
import * as app from '@/api/app'
import {
  decorateApiURL
} from '@/api'

//模块的配置
import config from '../config.js'

//该模块的 api
import * as item1 from './modules/item1'
decorateApiURL(item1);

//导出模块 api引用
export default {
  app,
  item1
}
