<template>
	<div ref="box" class="box my_unselectable">
		<div v-for="(item,indexY) in props.sudokuArray" :key="'y'+indexY" class="row">
			<div v-for="(e,indexX) in item" :key="'x'+indexX" :class="[
      'cell',
      (indexX + 1) % 3 === 0 ? 'cell-bx' : '',
      (indexY + 1) % 3 === 0 ? 'cell-by' : '',
	  (Math.floor((indexX) / 3)+Math.floor((indexY) / 3))%2===0?'cell-b':''
    ]">
				{{e==0?' ':e}}
			</div>
		</div>
	</div>
</template>

<script setup>
	const props = defineProps({
		sudokuArray: {
			default: () => [
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
			]
		}
	})
</script>

<style scoped>
	.box {
		width: 150px;
		height: 150px;
		border-left: 2px solid coral;
		border-top: 2px solid coral;
		box-shadow: 5px 5px 7px darkgray;
		background-color: #fafafa;
	}

	.row {
		display: flex;
		width: 100%;
		height: 11.111%;
	}

	.cell {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 11.111%;
		border-right: 1px solid gray;
		border-bottom: 1px solid gray;
		box-sizing: border-box;
		font-size: 12px;
		font-weight: 700;
	}

	.cell-bx {
		border-right: 2px solid coral;
	}

	.cell-by {
		border-bottom: 2px solid coral;
	}
	.cell-b{
		background-color: #a5f5fa;
	}
</style>