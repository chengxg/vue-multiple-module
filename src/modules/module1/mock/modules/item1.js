import Mock from 'mockjs';
const Random = Mock.Random;
import qs from 'qs'

import {
	mockRule,
	getPagesPathAuthorities,
	mockEnable,
	ajaxGet,
	ajaxPost,
	dataSuccess,
	dataList,
	dataListPage
} from '../../../../mock/apiUtil'

import {
	item1StateEnum
} from '../../statusEnum'

//引用自api中的对应模块
import {
	apiURL
} from '../../api/modules/item1'

export function api1() {
	ajaxPost(apiURL.api1, function(params, body) {
		let code = params.code;
		return dataSuccess({
			"msg": "操作成功"
		}, 0.8)
	});
}

export function api2() {
	ajaxPost(apiURL.api2, function(params, body) {
		return dataListPage({
			"gmtCreate": "@datetime",
			"code": function() {
				return mockRule.generateCode("AC")
			},
			"state": function() {
				return mockRule.getEnumKey(item1StateEnum);
			}
		}, params)
	});
}

export function api3() {
	ajaxPost(apiURL.api3, function(params, body) {
		let code = params.code;
		return dataList({
			"state|1": [0, 1],
			"amount|10000-99999": 12345,
		}, 10, 0.8)
	});
}