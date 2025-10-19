<template>
	<div class="timer-container">
		<span class="timer-icon">⏱️</span>
		<span class="time-display">{{ formattedTime }}</span>
	</div>
</template>

<script setup>
	import {
		ref,
		onUnmounted,
		watch,
		computed
	} from 'vue';
	import {
		dateTime
	} from '../utils/util';

	const props = defineProps({
		isRunning: Boolean,
		startTime: Number
	});

	const elapsed = ref(0);
	let timerId = null;

	const updateTime = () => {
		if (props.isRunning) {
			elapsed.value = Date.now() - props.startTime;
			timerId = requestAnimationFrame(updateTime);
		}
	};

	watch(() => props.isRunning, (running) => {
		if (running) {
			updateTime();
		} else {
			cancelAnimationFrame(timerId);
		}
	}, {
		immediate: true
	});

	const formattedTime = computed(() => {
		let diff = dateTime.dateDiff(0, elapsed.value)
		const hour = diff.hours.toString().padStart(2, '0');
		const minutes = diff.minutes.toString().padStart(2, '0');
		const seconds = diff.seconds.toString().padStart(2, '0');
		const milliseconds = Math.floor(diff.milliseconds / 10).toString().padStart(2, '0');
		return `${hour}:${minutes}:${seconds}.${milliseconds}`;
	});

	onUnmounted(() => {
		cancelAnimationFrame(timerId);
	});
</script>

<style scoped>
	.timer-container {
		font-family: 'Courier New', monospace;
		font-size: 1.5rem;
		background: #f5f5f5;
		padding: 8px 10px;
		border-radius: 5px;
		display: inline-flex;
		align-items: center;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	}

	.timer-icon {
		margin-right: 8px;
		font-size: 1.2em;
	}

	.time-display {
		letter-spacing: 1px;
		color: #2c3e50;
	}
</style>