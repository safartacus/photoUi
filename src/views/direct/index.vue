<template>
  <div class="window">
    <DirectMessageList/>
  </div>
</template>


<script>
import DirectMessageList from '@/components/MessageList'
export default {
  name: 'Direct',
  components: {
    DirectMessageList,
  }
}
</script>

<style scoped>
.window{
  position:relative;
  
  margin:50px auto;
  
  width:840px;
  height:640px;
  
  border-radius:4px;
  border:1px solid #C1C1BF;
  
  box-shadow: 0 0 100px hsla(0,0%,0%, .3);
  
  background:white;
  
  overflow:hidden;  
  }
</style>