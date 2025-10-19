<template>
   <div class="sudoku-container">
    <div class="sudoku-grid">
      <div 
        v-for="(row, rowIndex) in props.arr" 
        :key="'row-' + rowIndex" 
        class="sudoku-row"
      >
        <div
          v-for="(cell, colIndex) in row"
          :key="'cell-' + rowIndex + '-' + colIndex"
          class="sudoku-cell"
          :class="{
            'highlighted': isHighlighted(rowIndex, colIndex),
            'selected': isSelected(rowIndex, colIndex),
            'border-right-bold': (colIndex + 1) % 3 === 0,
            'border-bottom-bold': (rowIndex + 1) % 3 === 0,
            'fixed': cell.fixed,
            'error': cell.error,
			'color-blue': cell.try && cell.try==1,
			'color-yellow': cell.try && cell.try==2
          }"
          @click="handleCellClick(rowIndex, colIndex)"
        >
		  <div v-if="cell.value">{{cell.value}}</div>
		  <div class="notes-box" v-else>
			  <div v-for="notesIndex in 9" class="notes-item" :key="'cell-' + rowIndex + '-' + colIndex+ '-' +notesIndex">{{cell.notes[notesIndex-1]||''}}</div>
		  </div>
        </div>
      </div>
    </div>
   </div>   
</template>
   
<script setup>   
import { ref, computed, onMounted } from 'vue'
   
const props = defineProps({
   arr: {
    type: Array,
    default: () => Array(9).fill().map(() => Array(9).fill({ value: 0, fixed: false }))
   },
   selectedCell: {
    type: Object,
    default: () => ({ row: null, col: null })
   }   
})
   
const emit = defineEmits(['cellClick'])
   
// 内部选中的单元格（如果父组件没有传入selectedCell）   
const internalSelected = ref({ row: null, col: null })
   
// 判断单元格是否高亮（同行、同列或同宫）   
const isHighlighted = (row, col) => {
   const selected = props.selectedCell.row !== null ? props.selectedCell : internalSelected.value
   if (selected.row === null || selected.col === null) return false
  
  return (
    row === selected.row ||
    col === selected.col ||
    (Math.floor(row / 3) === Math.floor(selected.row / 3) && 
     Math.floor(col / 3) === Math.floor(selected.col / 3))
   )   
}
   
// 判断单元格是否被选中   
const isSelected = (row, col) => {
   const selected = props.selectedCell.row !== null ? props.selectedCell : internalSelected.value
   return row === selected.row && col === selected.col   
}
   
// 处理单元格点击事件   
const handleCellClick = (row, col) => {
   if (props.selectedCell.row !== null) {
    // 如果父组件控制选中状态，只触发事件
    emit('cellClick', { row, col })
   } else {
    // 否则更新内部选中状态并触发事件
    internalSelected.value = { row, col }
    emit('cellClick', { row, col })
   }   
}
onMounted(()=>{
	
})
</script>
   
<style scoped>   
.sudoku-container {
   display: flex;
   justify-content: center;
}
   
.sudoku-grid {
   display: inline-block;
   border: 2px solid #333;
   background-color: #fff;   
}
   
.sudoku-row {
   display: flex;   
}
   
.sudoku-cell {
   width: 40px;
   height: 40px;
   display: flex;
   align-items: center;
   justify-content: center;
   border: 1px solid #ddd;
   font-size: 20px;
   font-weight: bold;
   cursor: pointer;
   transition: all 0.2s;
   position: relative;
   user-select: none;
   color: limegreen;
}
   
.sudoku-cell:hover {
   background-color: #f0f0f0;   
}
   
.border-right-bold {
   border-right: 2px solid #333 !important;   
}
   
.border-bottom-bold {
   border-bottom: 2px solid #333 !important;   
}
   
.highlighted {
   background-color: #e6f7ff;   
}
   
.selected {
   background-color: #b3e0ff !important;   
}
   
.fixed {
   color: #333;   
}
   
.error {
   color: #ff4d4f;
   background-color: #fff2f0;   
}

.notes-box{
	display: flex;
	width: 100%;
	height: 100%;
	flex-wrap: wrap;
}
.notes-item{
	width: 33.33%;
	height: 33.33%;
	color: #555;
	box-sizing: border-box;
	font-size: 10px;
	padding: 1;
}

.color-blue{
	color: royalblue;
}

.color-yellow{
	color: #eed424;
}
/* 小屏幕适配 */   
@media (max-width: 600px) {
   .sudoku-cell {
    width: 40px;
    height: 40px;
    font-size: 16px;
   }   
}   
</style>
