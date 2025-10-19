<template>
	<div class="sudoku-home">
		<div class="headbox">
			<div class="back-bnt" title="返回" @click="back"> ← </div>
			<my-timer :is-running="running" :start-time="startTime" style="margin-bottom: 30px;"></my-timer>
		</div>
		<div ref="sudokubox">
			<sudoku :arr="arr" @cellClick="handleCellClick" :selected-cell="selectedCell"></sudoku>
		</div>
		<num-keys @numDown="handleNumInput" @eraseDown="handleErase" style="margin-top: 30px;"></num-keys>
		<notes-box v-if="notesShow" :style="popupStyle" :selected="getSelected()||{}"
			@noteClick="noteClick"></notes-box>
		<div class="tip">两次点击同一个单元格可做笔记</div>
		<!-- 完成对话框 -->
		<div v-if="showWin" class="win">
			<div class="win-title">
				数独完成
			</div>
			<div class="win-time">
				耗时：
				<div>{{formatTime(useTime)}}</div>
			</div>
			<div class="minibox">
				<mini-sudoku class="mini"
					:sudoku-array="sudoku_tool.stringToSudokuArray(route.query.arrstr)"></mini-sudoku>
				<mini-sudoku class="mini" :sudoku-array="miniArr"></mini-sudoku>
			</div>
			<div class="ctrlbox">
				<div class="back-bnt" @click="closeWin">继续</div>
				<div class="back-bnt" @click="back">返回</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import {
		useRouter,
		useRoute
	} from 'vue-router';
	import {
		onMounted,
		ref,
		computed
	} from "vue";
	import {
		sudoku_tool,
		dateTime
	} from '../utils/util';
	import Sudoku from '../components/Sudoku.vue';
	import NumKeys from '../components/NumKeys.vue';
	import NotesBox from '../components/NotesBox.vue';
	import MyTimer from '../components/Timer.vue';
	import MiniSudoku from '../components/MiniSudoku.vue';

	const route = useRoute()
	const router = useRouter()
	const sudokubox = ref(null)
	const popupStyle = ref({});

	const selectedNotes = ref([])
	const arr = ref([])
	const areas = ref([])
	const notesShow = ref(false)
	const selectedCell = ref({
		row: null,
		col: null
	})
	const running = ref(true)
	const showWin = ref(false)
	const startTime = ref(Date.now())
	const useTime = ref(0)
	const miniArr = computed(() => arr.value.map(item => item.map(cell => cell.value)))


	const back = () => {
		router.go(-1)
	}

	const handleCellClick = ({
		row,
		col
	}) => {
		if (selectedCell.value.row === row && selectedCell.value.col === col) {
			var cell = getSelected()
			if (!cell.value) {
				//数独rect
				let rect = sudokubox.value.getBoundingClientRect()
				//计算popupStyle
				let left = rect.left
				let top = rect.top
				let width = rect.width
				let height = rect.height
				let al = 158
				let col = selectedCell.value.col;
				let row = selectedCell.value.row

				if (col > 4) {
					left += width * col / 9 - al
				} else {
					left += width * (col + 1) / 9 + 1
				}
				if (row > 4) {
					top += height * row / 9 - al
				} else {
					top += height * (row + 1) / 9 + 1
				}

				popupStyle.value = {
					left: `${left}px`,
					top: `${top}px`
				}
				//显示notes
				notesShow.value = !notesShow.value
			}
		} else {
			selectedCell.value = {
				row,
				col
			}
			notesShow.value = false
		}
	}
	const change = () => {
		sudoku_tool.cError(areas.value)
		sudoku_tool.removeNotes(areas.value)
		if (running.value) {
			let complete = sudoku_tool.isComplete(areas.value)
			if (complete) {
				running.value = false;
				useTime.value = Date.now() - startTime.value
				showWin.value = true
			}
		}
		notesShow.value = false
	}
	const closeWin = () => {
		showWin.value = false
	}
	const formatTime = (elapsed) => {
		let diff = dateTime.dateDiff(0, elapsed)
		const hour = diff.hours.toString().padStart(2, '0');
		const minutes = diff.minutes.toString().padStart(2, '0');
		const seconds = diff.seconds.toString().padStart(2, '0');
		const milliseconds = Math.floor(diff.milliseconds / 10).toString().padStart(2, '0');
		return `${hour}:${minutes}:${seconds}.${milliseconds}`;
	}

	const getCell = (row, col) => {
		return arr.value[row][col]
	}
	const getSelected = () => {
		return getCell(selectedCell.value.row, selectedCell.value.col)
	}
	const handleNumInput = (num) => {
		if(selectedCell.value.row==null)return;
		var cell = getSelected()
		if (cell.value != num && !cell.fixed) {
			cell.value = num
			change()
		}
	}
	const handleErase = () => {
		if(selectedCell.value.row==null)return;
		var cell = getSelected()
		if (cell.value != 0 && !cell.fixed) {
			cell.value = 0
			change()
		} else if (cell.value == 0) {
			cell.notes = []
		}
	}
	const noteClick = (item) => {
		let cell = getSelected()
		let notes = cell.notes
		const index = notes.indexOf(item);

		if (index !== -1) {
			// 如果存在，则移除
			cell.notes = notes.filter(n => n !== item);
		} else {
			// 如果不存在，则添加到数组末尾
			cell.notes = [...notes, item];
		}
		if (cell.notes.length > 0 && typeof cell.notes[0] === 'number') {
			cell.notes.sort((a, b) => a - b);
		}
	}


	onMounted(() => {
		arr.value = sudoku_tool.normalised(sudoku_tool.stringToSudokuArray(route.query.arrstr))
		areas.value = sudoku_tool.area(arr.value)
		sudoku_tool.cError(areas.value)
	})
</script>

<style scoped>
	.headbox {
		display: flex;
	}

	.back-bnt {
		font-size: 25px;
		font-weight: 700;
		border-radius: 5px;
		background-color: #f5f5f5;
		padding: 8px 16px;
		color: #3a4a6d;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
		transition: all 0.2s;
		margin-bottom: 30px;
		margin-right: 15px;
	}

	.back-bnt:hover {
		background-color: #f0f0f0;
		color: black;
		transform: scale(1.1);
		cursor: pointer;
	}

	.tip {
		font-size: 12px;
		color: #666;
		line-height: 1.4;
		margin: 10px 0;
		padding: 0 5px;
	}


	.win {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 340px;
		padding: 30px 20px 20px;
		background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
		border-radius: 6px;
		border: #3a4a6d solid 4px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
		text-align: center;
		z-index: 100;
		animation: fadeIn 0.5s ease-out;
	}

	.win-title {
		font-size: 24px;
		font-weight: bold;
		color: #3a4a6d;
		margin-bottom: 20px;
	}

	.win-time {
		font-size: 20px;
		color: #5c6b8a;
		margin-bottom: 30px;
		text-align: left;
		padding: 0 30px;
	}

	.win-time div {
		text-align: center;
		font-size: 40px;
		color: #3a4a6d;
	}

	.minibox {
		display: flex;
		align-items: center;
		gap: 10px;
		justify-content: center;
		border-radius: 10px;
		background-color: rgba(170, 170, 170, 0.25);
		padding: 10px;
		margin-bottom: 30px;
	}

	.mini {
		transition: all 0.2s;
	}


	.mini:hover {
		transform: scale(1.04);
	}

	.ctrlbox {
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	.ctrlbox .back-bnt {
		padding: 8px 30px;
	}
</style>