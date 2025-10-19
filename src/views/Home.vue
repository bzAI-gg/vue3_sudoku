<template>
	<div class="sudoku-home">
		<h2 class="menu-title">数独</h2>
		<div class="menu-container">
			<router-link class="menu-item" to="/level">开始游戏</router-link>
			<router-link class="menu-item" to="/setting">游戏设置</router-link>
			<router-link class="menu-item" to="/pojie">破解数独</router-link>
			<div class="menu-item exit-btn" @click="handleExit">退出</div>
		</div>
	</div>
</template>

<script setup>
	import {
		ref
	} from 'vue'

	const handleExit = () => {
		// 退出逻辑   
		console.log('退出游戏')
	}
</script>

<style scoped>
	.exit-btn {
		background-color: #f1f1f1;
		color: #e74c3c;
		border: 1px solid #e74c3c;
	}
</style>