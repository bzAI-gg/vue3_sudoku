<template>
	<div class="notes-box">
		<div class="notes-item my_unselectable" v-for="item in 9" :class="props.selected.notes.indexOf(item)!==-1?'notes-item-had':''" @click="emit('noteClick',item)">
			{{item}}
		</div>
	</div>
</template>

<script setup>
 const props=defineProps({
	 selected:{
		 type:Object,
		 default:()=>{}
	 },
 })
 const emit=defineEmits(['noteClick'])
</script>

<style scoped>
	.notes-box {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(3, 1fr);
		position: absolute;
		width: 150px;
		height: 150px;
		flex-wrap: wrap;
		border-radius: 5px;
		border: coral 3px solid;
	}

	.notes-item {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 22px;
		font-weight: 700;
		color: #aaa;
		background-color: rgba(255, 255, 255, 0.9);
		border-radius: 2px;
		cursor: pointer;
		transition: all 0.2s;
	}
	
	.notes-item:hover{
		background-color: rgba(240, 240, 240, 0.9);
	}
	.notes-item-had {
		color: #333;
	}
</style>