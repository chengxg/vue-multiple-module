/**
 * 捕获app模块下的一些ajax请求
 * @author chengxg
 * @since 2019-1-11
 */

import Mock from 'mockjs';
const Random = Mock.Random;
import myUtil from '@/utils/myUtil'

import {
	mockRule,
	ajaxGet,
	ajaxPost,
	dataSuccess,
	dataList,
	dataListPage
} from './apiUtil'

import {
	apiURL
} from '@/api/app'