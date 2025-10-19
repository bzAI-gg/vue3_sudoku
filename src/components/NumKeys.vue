<template>
   <div class="num-keys-container">
    <div class="number-keys">
      <button
        v-for="num in 9"
        :key="num"
        class="num-key"
        @mousedown="handleNumDown(num)"
        @touchstart="handleNumDown(num)"
      >
        {{ num }}
      </button>
    </div>
    <div class="separator"></div>
    <button
      class="erase-key"
      @mousedown="handleEraseDown"
      @touchstart="handleEraseDown"
	  title="擦除"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 19L19 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M6 6L19 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>
   </div>   
</template>
   
<script setup>   
const emit = defineEmits(['numDown', 'eraseDown'])
   
const handleNumDown = (num) => {
   emit('numDown', num)   
}
   
const handleEraseDown = () => {
   emit('eraseDown')   
}   
</script>
   
<style scoped>   
.num-keys-container {
   display: flex;
   align-items: center;
   gap: 12px;
   padding: 12px;
   background-color: #f5f5f5;
   border-radius: 2px;
   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
   
.number-keys {
   display: flex;
   gap: 8px;   
}
   
.num-key {
   width: 44px;
   height: 44px;
   display: flex;
   justify-content: center;
   align-items: center;
   border-radius: 2px;
   border: none;
   background-color: #fff;
   color: #333;
   font-size: 18px;
   font-weight: bold;
   cursor: pointer;
   box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
   transition: all 0.2s;
   user-select: none;   
}
   
.num-key:active {
   transform: scale(0.95);
   background-color: #e0e0e0;   
}
   
.separator {
   width: 2px;
   height: 36px;
   background-color: #ddd;   
}
   
.erase-key {
   width: 42px;
   height: 42px;
   display: flex;
   justify-content: center;
   align-items: center;
   border-radius: 2px;
   border: none;
   background-color: #ff4d4f;
   color: white;
   cursor: pointer;
   box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
   transition: all 0.2s;
   user-select: none;   
}
   
.erase-key:active {
   transform: scale(0.95);
   background-color: #ff7875;   
}
   
/* 触摸设备优化 */   
@media (hover: none) {
   .num-key,
   .erase-key {
    width: 45px;
    height: 45px;
   }
   .number-keys{
	   display: grid;
	   grid-template-columns: repeat(5, 1fr);
   }
}

</style>
