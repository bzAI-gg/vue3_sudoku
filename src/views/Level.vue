<template>
	<div class="sudoku-home">
		<h2 class="menu-title">难度等级</h2>
		<div class="menu-container">
			<div v-for="(item) in [0,1,2,3,4]" class="menu-item" @click="toList(item)" :key="'l'+item">{{sudoku_tool.lvName(item)}}</div>
			<div class="menu-item back-bnt" @click="back">返回</div>
		</div>
	</div>
</template>

<script setup>
	import {
		useRouter
	} from 'vue-router'
	import { sudoku_tool } from '../utils/util'

	const router = useRouter()

	const toList = (lv) => {
		router.push({
			name: 'LevelList',
			params: {
				lv: lv
			}
		})
	}

	const back = () => {
		router.go(-1)
	}
</script>

<style scoped>
	.back-bnt {
		background-color: #f1f1f1;
		color: #e74c3c;
		border: 1px solid #e74c3c;
	}
</style>