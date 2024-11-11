<template>
  <div>
    <aside class="conv-list-view">
        <header class="conv-list-view__header">
          <div class="cf">
            <ul class="function-list">
              <li class="icon-lupe"></li>
            </ul>
          </div>
        </header>
        <ul class="conv-list">
          <li v-for="(msg, index) in messages" :key="index" @click="setRecipientId(msg.sender._id)">
            <div class="status">
              <i class="status__indicator--unread-message"></i>    
              <figure class="status__avatar">
                <Avatar/>
              </figure>
              <div class="meta">
                <div class="meta__name">{{msg.sender.userName}}</div>
                <div class="meta__sub--dark">{{msg.text}}</div>
              </div>
            </div>
          </li>
        </ul>
    </aside>
    <section class="chat-view">
      <DirectMessage v-if="recipientId" :recipientId="recipientId"/>
      <span v-else>No message Found</span>
    </section>
  </div>
</template>

<script>
import DirectMessage from '@/components/DirectMessage'
import Avatar from '@/components/Avatar'
import axios from 'axios';

export default {
    name: 'DirectMessageList',
    components:{
      DirectMessage,
      Avatar
    },
    data() {
      const user = JSON.parse(localStorage.getItem('user')); // Parse JSON to get user object
      return {
        recipientId: null,
        user,
        messages: [] // `messages` verisini burada tanımlıyoruz
      };
    },
    created() {
      this.loadMessages(); // Bileşen yüklendiğinde mesajları yükle
    },
    
    methods: {
      async loadMessages() {
        try {
          console.log(this.user)
          const response = await axios.get(`http://localhost:3000/messages/getLatest?recipientId=${this.user._id}`, {
            headers: { 
              'Content-Type': 'multipart/form-data',
              'Access-Control-Allow-Credentials': 'true'
            },
            withCredentials: true
          });
          this.messages = response.data;
        } catch (error) {
          console.error('Mesajlar yüklenirken hata oluştu:', error);
        }
      },
      setRecipientId(id) {
      this.recipientId = id; // Tıklanan kişinin ID'sini al
     }
    }
}
</script>

<style>

.conv-list-view{  
 position:absolute;

 width:270px;
 height:100%;

 box-shadow:0 0 4px hsla(0, 0%, 50%, .7);

 background:white;

 z-index:1;
}

.conv-list-view__header{
height:50px;
border-bottom:1px solid #F0F0F0;
}

.conv-list{

position:absolute;
left:0;right:0;
margin:0;padding:0;


li{
  box-sizing:border-box;
  
  padding:.5em .5em;
  width:100%;
  
  border-bottom:1px solid #E3E3E3;
  
  overflow-x:hidden; 
}
.selected{
  background-color:#FBFBFB; 
  box-shadow:0  1px 1px 0 hsla(0, 0%, 90%, .3) inset,
             0 -1px 1px 0 hsla(0, 0%, 90%, .3) inset;
}
}

.close-button-list{

display:inline-block;

margin:0;padding:19px 10px;

float:left;

li{
  width:12px;
  height:12px;    
      
  margin-left:8px;
  
  background-image:radial-gradient(20px 15px at center 15%, white, rgba(255,255,255,0) 35%),
                 radial-gradient(30px 30px at center bottom, white, transparent);
  background-color:#D9D9D9;

  border-radius:100%;

  box-shadow:0 1px 1px hsla(0, 20%, 20%, .4) inset,
             0 -1px 1px hsla(0, 20%, 20%, .3) inset;
  
}
}


.status{ 
position:relative; 
padding:0 1em;
} 

.status__indicator{ 
position:absolute; 

left: 0; 

width:8px; 
height:100%; 
  

&:after, &:before{
  top:50%;     
}
}

.status__indicator--online{

&:after{
  margin-top:-4px;
    
  width:8px;
  height:8px;

  border-radius:100%;

  box-shadow:0  0   1px hsla(0, 0%, 10%, 1)  inset,
             0 -1px 3px hsla(0, 0%, 15%, .6) inset;

  background-color:#66B736;  
}
}

.status__indicator--unread-message{
&:after{
  background-color:#5383E3;
}
}


.status__indicator--replied-message{

left:-2px;

&:before{
  margin-top:-4px;
    
  border-style: solid;      
  border-width: 4px 5px 4px 0;
  border-color: transparent #BBBEC4 transparent transparent;
    
  transform:rotate(360deg);
}
  
&:after{
  left:-5px;
  margin-top:-2px;
    
  width:16px;
  height:18px;
    
  clip:rect(0 auto auto 8px);
    
  border-top:4px solid #BBBEC4;
  border-radius:50%;      
}
}

.status__indicator--read-message{
&:after,&:before{
  background-color:#BBBEC4;
  border-radius:.2em;
}
&:before{
  width:.15em; 
  height:.3em;
  transform:rotate(-45deg);
}
&:after{
  margin-top:-.25em;
  left:.28em;      
  width:.12em; 
  height:.6em;
  transform:rotate(45deg);
}
}

.status__avatar{
position:relative;
display:block;
  
float:left;

width:2.5em;
height:2.5em;

border-radius:.3em;
 
margin:0 .5em 0 0;

&:before{
  position:absolute;
  content:'';
  top:0;left:0;right:0;bottom:0;
  box-shadow:0 0 .125em hsla(0, 0%, 10%, 1) inset,
             0 0 .312em hsla(0, 0%, 10%, 1) inset; 
}

overflow:hidden;

img{
  width:inherit;
  height:inherit;    
}
}

.status__avatar--small{
font-size:.8em;
}

.status__avatar--facebook{
&:after{
  box-sizing:border-box;
  position:absolute;
  
  font-weight:bold;
    
  content:'f';
  
  padding:0 .3em;
  line-height:15px;
  
  right:0;
  bottom:0;
  
  width:15px;
  height:15px;
  
  color:white;
  background-color:#485396;
  
  box-shadow:0 0 1px #2D3989 inset;
  border-radius:3px 0 0 0;
}
}

.meta{
white-space:nowrap;
}

.meta__sub{ 
font-size:.8em;
}
.meta__sub--dark{
color:#8D8D8D;
}
.meta__sub--light{
color:#A5A5A4;  
}
</style>