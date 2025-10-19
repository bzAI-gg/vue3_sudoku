<template>
	<div class="sudoku-home">
		<div class="inputbox">
			<div class="input-item">
				<div class="input-title" @click="showInputClick">原数独</div>
				<div class="input-d" :class="showInput?'':'input-d-close'">
					<textarea type="text" rows="3" v-model="sudokuString" placeholder="输入81位数字，0表示空格" />
					<div class="input-bnt my_unselectable" @click="loadFromString">加载</div>
				</div>
			</div>
			<!-- 结果仅显示不可修改 -->
			<div class="input-item">
				<div class="input-title" @click="showInputClick">破解结果</div>
				<div class="input-d" :class="showInput?'':'input-d-close'">
					<textarea type="text" rows="3" v-model="solutionString" readonly />
					<div class="input-bnt my_my_unselectable" @click="copyRes">复制</div>
				</div>
			</div>
		</div>
		<!-- 数独编辑 -->
		<div class="sudoku-box">
			<!-- 数独九宫格 -->
			<sudoku :arr="arr" @cellClick="handleCellClick" :selected-cell="selectedCell"></sudoku>
			<!-- 数字编辑按键 -->
			<NumKeys @num-down="handleNumInput" @erase-down="handleErase" />
		</div>

		<div class="aside-bnt" @click="changeStepShow">{{showStep?'>':'<'}}</div>
		<!-- 破解步骤显示 -->
		<div class="step-box" :class="showStep?'':'step-box-hid'">
			<div class="step">
				<div class="step-title">破解步骤（{{ steps.length }}）</div>
				<!-- 步骤组 -->
				<div class="step-group">
					<div v-for="(step, index) in steps"
						:class="'group-item '+ (index==currentGroup?'group-item-selected':'')"
						@click="selectGroup(index)">
						{{index+1}}
					</div>
				</div>
			</div>
			<div class="step-goup-steps">
				<div v-for="(item, index) in steps[currentGroup]" :key="index" class="step-item"
					:class="{'current-step':currentStep.group==currentGroup&&currentStep.index==index}"
					@click="applyStep(item,index)">
					<span class="step-coord">({{ item.y+1 }}, {{ item.x+1 }})</span>
					<span class="step-value">填入 {{ item.value }}</span>
					<span v-if="item.txt=='单'" class="step-try try-k">唯一可能</span>
					<span v-else-if="item.txt=='区'" class="step-try try-h">唯一候选</span>
					<span v-else-if="item.txt=='试'" class="step-try try-c">尝试填入</span>
				</div>
			</div>
		</div>

		<!-- 破解操作 -->
		<div class="ctrl-box">
			<button class="ctrl-btn" @click="solve">破解</button>
			<button class="ctrl-btn" @click="reset">清空</button>
			<!-- 以下操作为破解后出现 -->
			<button v-if="steps.length > 0" class="ctrl-btn"
				@click="fillBySteps(steps.length-1,steps[steps.length-1].length-1)"
				:disabled="!arr.some(item=>item.some(cell=>cell.value===0))">
				填入
			</button>
			<button v-if="steps.length > 0" class="ctrl-btn" @click="fillBySteps(-1,-1)"
				:disabled="!arr.some(item=>item.some(cell=>!cell.fixed && cell.value!==0))">
				移除
			</button>
			<button v-if="steps.length > 0" class="ctrl-btn" @click="preStep"
				:disabled="currentStep.group==0 && currentStep.index === 0">
				上一步
			</button>
			<button v-if="steps.length > 0" class="ctrl-btn" @click="nextStep"
				:disabled="currentStep.group==steps.length-1 && currentStep.index === steps[steps.length-1].length-1">
				下一步
			</button>
		</div>
		<div class="back-bnt my_unselectable" @click="back">
			{{'<'}}
		</div>
	</div>
</template>

<script setup>
	import {
		ref,
		computed,
		onMounted,
		warn
	} from 'vue';
	import NumKeys from '../components/NumKeys.vue';
	import Sudoku from '../components/Sudoku.vue';
	import {
		sudoku_tool
	} from '../utils/util';
	import {
		useRouter
	} from 'vue-router';

	const router = useRouter()

	const arr = ref([])
	const areas = ref([])
	const selectedCell = ref({
		row: null,
		col: null
	});
	const sudokuString = ref('');
	const solutionString = ref('');
	const steps = ref([]);
	const currentStep = ref({
		group: 0,
		index: 0
	});
	const currentGroup = ref(0)
	const showInput = ref(false)
	const showStep = ref(false)

	const copyRes = () => {
		navigator.clipboard.writeText(solutionString.value);
		alert('结果已复制')
	}

	const handleCellClick = ({
		row,
		col
	}) => {
		if (selectedCell.value.row === row && selectedCell.value.col === col) {

		} else {
			selectedCell.value = {
				row,
				col
			}
		}
	}

	const initByStr = (str) => {
		arr.value = sudoku_tool.normalised(
			sudoku_tool.stringToSudokuArray(
				sudoku_tool.formatSudokuStr(str)))
		areas.value = sudoku_tool.area(arr.value)
		sudoku_tool.cError(areas.value)
	}

	const showInputClick = () => {
		showInput.value = !showInput.value
	}

	const getCell = (row, col) => {
		return arr.value[row][col]
	}
	const getSelected = () => {
		return getCell(selectedCell.value.row, selectedCell.value.col)
	}

	// 处理数字输入
	const handleNumInput = (num) => {
		if (selectedCell.value.row === null) return;

		var cell = getSelected()
		if (cell.value != num) {
			cell.value = num
			//change()
			sudoku_tool.cError(areas.value)
		}
	};

	// 处理擦除
	const handleErase = () => {
		if (selectedCell.value.row === null) return;

		var cell = getSelected()
		if (cell.value != 0) {
			cell.value = 0
			//change()
			sudoku_tool.cError(areas.value)
		}
	};

	// 从字符串加载数独
	const loadFromString = () => {
		selectedCell.value = {
			row: null,
			col: null
		};
		initByStr(sudokuString.value)
		resetIndex()
		steps.value = []
		showStep.value = false
	};

	const selectGroup = (index) => {
		currentGroup.value = index
	}

	// 解数独
	const solve = () => {
		// 这里应该调用解数独的算法
		if (arr.value.some(row => row.some(cell => cell.error))) {
			alert("数独不正确")
			return;
		}
		
		if (arr.value.every(row => row.every(cell => cell.value))) {
			return;
		}
		sudokuString.value = sudoku_tool.sudokuArrayToString(arr.value.map(item => item.map(cell => cell.value)))
		initByStr(sudokuString.value)
		let pj = sudoku_tool.pojie(sudokuString.value)
		if (pj) {
			//破解成功
			solutionString.value = pj.arrstr
			steps.value = Array(pj.step[pj.step.length - 1].rt)
			pj.step.forEach(item => {
				const rt = item.rt; // 获取当前步骤的 rt 值
				if (!steps.value[rt - 1]) {
					steps.value[rt - 1] = []
				}
				steps.value[rt - 1].push(item); // 将当前步骤加入对应 rt 的分组
				arr.value[item.y][item.x].try = item.txt == '单' ? 0 : (item.txt == '区' ? 1 : 2)
			});
			sudoku_tool.fill_sudoku(arr.value, pj.step)
			resetIndex()
			showStep.value = true
		} else {
			//破解失败
			alert('破解失败')
		}
	};

	const resetIndex = () => {
		currentGroup.value = 0
		currentStep.value = {
			group: 0,
			index: 0
		}
	}

	const reset = () => {
		initByStr('')
		solutionString.value = ''
		steps.value = []
		showStep.value = false
	}

	// 应用步骤
	const applyStep = (item, index) => {
		selectedCell.value = {
			row: item.y,
			col: item.x
		}
		currentStep.value = {
			group: currentGroup.value,
			index
		}
		fillBySteps(currentStep.value.group, currentStep.value.index)
	};

	const fillBySteps = (gi, ti) => {
		if (steps.value.length === 0) return
		arr.value.forEach(item => {
			item.forEach(cell => {
				cell.value = cell.fixed ? cell.value : 0
			})
		})
		if (gi == -1 || ti == -1) return
		for (let i = 0; i <= gi; i++) {
			let group = steps.value[i]
			let l = i == gi ? ti : group.length - 1
			for (let j = 0; j <= l; j++) {
				arr.value[group[j].y][group[j].x].value = group[j].value
			}
		}
		sudoku_tool.cError(areas.value)
	}

	const preStep = () => {
		if (currentStep.value.index == 0) {
			if (currentStep.value.group == 0) return
			currentStep.value.group--
			currentStep.value.index = steps.value[currentStep.value.group].length - 1
		} else {
			currentStep.value.index--;
		}
		currentGroup.value = currentStep.value.group
		fillBySteps(currentStep.value.group, currentStep.value.index)
		let step = steps.value[currentStep.value.group][currentStep.value.index]
		selectedCell.value = {
			row: step.y,
			col: step.x
		}
	}

	const nextStep = () => {
		if (currentStep.value.index == steps.value[currentStep.value.group].length - 1) {
			if (currentStep.value.group == steps.value.length - 1) return
			currentStep.value.group++
			currentStep.value.index = 0
		} else {
			currentStep.value.index++;
		}
		currentGroup.value = currentStep.value.group
		fillBySteps(currentStep.value.group, currentStep.value.index)
		let step = steps.value[currentStep.value.group][currentStep.value.index]
		selectedCell.value = {
			row: step.y,
			col: step.x
		}
	}

	const changeStepShow = () => {
		showStep.value = !showStep.value
	}

	// 获取步骤类型名称
	const getStepTypeName = (type) => {
		const types = {
			'naked-single': '唯一候选',
			'hidden-single': '隐藏唯一',
			'guess': '试填'
		};
		return types[type] || type;
	};

	const back = () => {
		router.go(-1)
	}
	onMounted(() => {
		initByStr('0')
	})
</script>

<style scoped>
	.inputbox {
		margin: 10px 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
		flex-wrap: wrap;
	}

	.input-item {
		position: relative;
		background-color: white;
		border-radius: 6px;
		border: 1px solid #ccc;
		box-sizing: border-box;
	}

	.input-title {
		text-align: left;
		padding: 4px 10px;
		cursor: pointer;
	}

	.input-d {
		display: flex;
		overflow: hidden;
		max-height: 100px;
		transition: all 0.5s;
	}

	.input-d-close {
		max-height: 0;
	}

	.input-item textarea {
		padding: 8px;
		font-size: 12px;
		border-bottom-left-radius: 6px;
		border: none;
		border-top: 1px solid #ccc;
		border-right: 1px solid #ccc;
		outline: none;
		width: 270px;
		resize: none;
		word-wrap: break-word;
	}

	.input-bnt {
		display: flex;
		align-items: center;
		border-top: 1px solid #ccc;
		justify-content: center;
		border-bottom-right-radius: 6px;
		width: 60px;
		cursor: pointer;
	}

	.sudoku-box {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-bottom: 20px;
	}

	.aside-bnt {
		display: inline-block;
		position: fixed;
		right: 0;
		background-color: white;
		width: 30px;
		height: 55px;
		line-height: 55px;
		border-start-start-radius: 5px;
		border-end-start-radius: 5px;
		font-size: 19px;
		font-weight: 700;
		cursor: pointer;
		box-shadow: -2px 2px 5px cadetblue;
	}

	.step-box {
		position: fixed;
		right: 40px;
		display: flex;
		border-radius: 4px;
		padding: 5px;
		overflow-y: auto;
		background-color: #e8e8e8;
		box-shadow: 2px 5px 10px cadetblue;
		transition: all 0.5s;
	}

	.step-box-hid {
		right: -500px;
	}

	.step {
		padding-right: 10px;
	}

	.step-title {
		padding: 2px;
	}

	.step-group {
		display: flex;
		flex-direction: column;
		border: lightblue 3px solid;
		max-height: 400px;
		overflow: auto;
		gap: 2px;
	}

	.group-item {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 30px;
		font-size: 20px;
		font-weight: 700;
		height: 30px;
		padding: 5px;
		cursor: pointer;
		background: #f6f6f6;
	}

	.group-item-selected {
		background: skyblue;
	}

	.step-goup-steps {
		border-left: 1px white solid;
		padding: 5px;
		min-width: 250px;
		max-height: 450px;
		overflow-y: auto;
	}

	.step-item {
		padding: 4px 8px;
		cursor: pointer;
		display: flex;
		border-radius: 2px;
		align-items: center;
		background-color: #f5f5f5;
		margin-bottom: 2px;
	}

	.step-item.current-step {
		background-color: skyblue;
		border: 1px solid skyblue;
	}

	.step-item.current-step .step-value {
		color: white;
	}

	.step-coord {
		font-weight: bold;
		color: #333;
		min-width: 40px;
	}

	.step-value {
		flex: 1;
		font-weight: bold;
		color: #2196f3;
		text-align: left;
		padding-left: 10px;
	}

	.step-try {
		padding: 1px 4px;
		border-radius: 3px;
		font-size: 13px;
	}

	.try-k {
		background-color: #4caf50;
		color: white;
	}

	.try-h {
		background-color: royalblue;
		color: white;
	}

	.try-c {
		background-color: #ffeb3b;
		color: #333;
	}

	.ctrl-box {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		margin-bottom: 50px;
	}

	.ctrl-btn {
		padding: 8px 10px;
		background-color: #4caf50;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	.ctrl-btn:hover {
		background-color: #388e3c;
	}

	.ctrl-btn:disabled {
		background-color: #cccccc;
		cursor: not-allowed;
	}

	.ctrl-btn.success {
		background-color: #2196f3;
	}

	.ctrl-btn.success:hover {
		background-color: #1976d2;
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

	@media (max-width: 600px) {
		.inputbox {
			margin-right: 25px;
		}

		.aside-bnt {
			top: 60px;
		}

		.step-box {
			flex-direction: column;
			top: 15px;
			right: 50px;
			background-color: rgba(230, 230, 230, 0.95);
		}

		.step-box-hid {
			right: -500px;
		}

		.step {
			padding-right: 0px;
			padding-bottom: 5px;
		}

		.step-group {
			flex-direction: row;
			max-width: 300px;
		}

		.step-goup-steps {
			border-left: none;
			border-top: 1px white solid;
			min-width: 200px;
		}

		.back-bnt {
			display: none;
		}
	}
</style>