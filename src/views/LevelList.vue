<template>
	<div class="sudoku-home">
		<h2 class="title">难度等级：{{sudoku_tool.lvName(props.lv)}}</h2>
		<div class="box-container">
			<div v-for="(item,index) in list" class="mini-box" @click="open(item)">
				<mini-sudoku class="mini" :sudoku-array="item"></mini-sudoku>
				<div class="index">{{(Number(props.lv)+1)+'-'+(index+1)}}</div>
			</div>
		</div>
		<div class="back-bnt" @click="back">
			{{'<'}}
		</div>
	</div>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		sudoku_tool,
		loadLevel
	} from '../utils/util';
	import {
		useRouter
	} from 'vue-router';
	import MiniSudoku from '../components/MiniSudoku.vue';

	const router = useRouter()

	const props = defineProps({
		lv: {
			default: () => 0
		}
	})
	
	const list = ref([])

	const back = () => {
		router.go(-1)
	}
	const open = (item) => {
		router.push({
			name: 'Game',
			query:{
				arrstr:sudoku_tool.sudokuArrayToString(item)
			}
		})
	}

	 onMounted(async() => {
		let ls=await loadLevel.load(props.lv)
		list.value = ls.map(item=>sudoku_tool.stringToSudokuArray(item))
	})
</script>

<style scoped>
	.title {
		padding: 10px;
	}

	.box-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 20px;
		padding: 5px 20px 100px;
	}

	.mini {
		transition: all 0.2s;
	}

	.mini:hover {
		cursor: pointer;
		transform: scale(1.06);
	}

	.index {
		margin-top: 10px;
		font-size: 18px;
		font-weight: 700;
	}

	.back-bnt {
		position: absolute;
		right: 20px;
		bottom: 60px;
		width: 60px;
		height: 60px;
		line-height: 60px;
		font-size: 25px;
		font-weight: 700;
		border-radius: 50%;
		background-color: #5eacff;
		color: white;
		box-shadow: 5px 5px 5px gray;
		transition: all 0.2s;
	}

	.back-bnt:hover {
		background-color: #4e9cfa;
		transform: scale(1.04);
		cursor: pointer;
	}
</style>