import Mock from 'mockjs';

import {
  mockEnable
} from '@/mock/apiUtil'


//更改假数据配置
import config from '../config'

//初始化app中的全局api
//初始化导航栏及侧边栏的菜单 api
import * as app from '@/mock/app';

//初始化该模块的相关api
import * as item1 from './modules/item1'
//启用该模块api
mockEnable(item1);
