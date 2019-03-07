<template>
	<div>
		模块1 首页<br> 分页信息{{page}}
		<br> api2List数据:
		<pre>
				{{api2List}}
			</pre>
		<br>

		<br>api3List数据:
		<pre>
				{{api3List}}
			</pre>
		<br>

		<el-button type="primary" @click="search">模块1 查询api3</el-button>
	</div>
</template>

<script>
	const vmData = {
		page: {
			pageSize: 10,
			pageNum: 1
		},
		api2List: [],
		api3List: []
	};

	export default {
		name: "Dashboard",
		data() {
			return vmData
		},
		components: {

		},
		beforeCreate: function() {

		},
		created: function() {
			this.$api.item1.api2({
				...this.page
			}, (newPage, list) => {
				this.page = newPage;
				this.api2List = list;
			}, (err) => {

			});
		},
		computed: {

		},
		methods: {
			search() {
				this.$api.item1.api3({
					code: "123"
				}, {}, (list) => {
					this.api3List = list;
				}, (err) => {

				});
			}
		},
	}
</script>

<style lang="less" scoped>

</style>