<template>
    <section v-if="recipientUser" class="chat-view">
        <header class="chat-view__header">
          <div class="cf">
            <div class="status">
              <div class="meta flexmeta">
                <Avatar/>
                <div class="nameArea">{{recipientUser.user.userName}}</div>
              </div>
            </div>
          </div>
        </header>
        <section class="message-view">
            <div class="chat-container">
            <div v-for="(msg, index) in messages" :key="index">
                <div v-if="msg.sender._id === currentUserId" class="message outgoing">
                    <div class="text">{{msg.text}}</div>
                    <Avatar/>
                </div>
                <div v-else  class="message incoming">
                    <Avatar/>
                    <div class="text">{{msg.text}}</div>
                </div>
            </div>
        </div>
        </section>
        <footer class="chat-view__input">
          <div class="input">
            <input v-model="message" placeholder="Mesajınızı yazın" @keyup.enter="sendMessage" />
            <span class="input__emoticon"></span>
        </div>
        <button style="margin-left: 1.5rem;" @click="sendMessage"><SendIcon/></button>
        </footer>
      </section>
      <section v-else>

      </section>
</template>

<script>
  import axios from 'axios';
  import Avatar from '@/components/Avatar'
  import SendIcon from '@/icons/send.svg'

  
  export default {
    props: [
        'recipientId' 
    ],
    components:{
        Avatar,
        SendIcon
    },
    watch: {
      recipientId(newVal) {
      this.loadMessages(newVal);
    },
      messages() {
          this.$nextTick(() => {
          this.scrollToBottom();
          });
      }
},
  
    data() {
      const user = JSON.parse(localStorage.getItem('user'));
  
      return {
          recipientUser: null,
          currentUserInfo:null,
          message: '',
          messages: [],
          currentUser: 'Siz',
          currentUserId: user ? user._id : null, 
      };
    },
    async created() {
        await this.loadMessages(); // Sayfa yüklendiğinde mesajları yükle
    },
    mounted() {
      this.fetchUserDetails();
      this.scrollToBottom();
      this.$socket.on('receiveMessage', (msg) => {
        this.messages.push({
          text: msg.text,
          sender: msg.sender, // Mesajın göndereni
          isSent: false // Alınan mesajlar için
        });
        this.scrollToBottom();
      });
    },
    methods: {
        scrollToBottom() {
            const chatContainer = this.$el.querySelector('.chat-container');
            if (chatContainer) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        },
      sendMessage() {
        if (this.message.trim()) {
          const msg = {
            text: this.message,
            senderId: this.currentUserId,
            recipientId: this.recipientId
          };
  
          this.$socket.emit('sendMessage', msg);
          this.messages.push({
            text: this.message,
            sender: this.currentUser,
            isSent: true 
          });
          this.message = '';
        }
      },
      async loadMessages() {
          try {
            const response = await axios.get(`http://localhost:3000/messages?senderId=${this.currentUserId}&recipientId=${this.recipientId}`,{
            headers: { 
              'Content-Type': 'multipart/form-data',
              'Access-Control-Allow-Credentials': 'true'
             },
             withCredentials: true
          });
            this.messages = await response.data;
          } catch (error) {
              console.error('Mesajlar yüklenirken hata oluştu:', error);
          }
      },
      async fetchUserDetails() {
        try {
          var url = `http://localhost:3000/user/${this.recipientId}`;
          const response = await axios.get(url,{
            headers: { 
              'Content-Type': 'multipart/form-data',
              'Access-Control-Allow-Credentials': 'true'
             },
             withCredentials: true
          });
          this.recipientUser = response.data.userInfo
          console.log(this.recipientUser)
        } catch (error) {
          console.error('Kullanıcı bilgileri alınamadı:', error);
        }
      },
    }
  };
</script>
<style scoped>
.chat-container{
    display: flex;
    flex-direction: column;
    max-height: 500px;
    overflow-y: scroll;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #fafafa;
}
.chat-view{
    position:absolute;
    
    left:270px;
    right:0;
    bottom:0;
    top:0;
    
    padding:.625em 1.25em 1.25em 1.25em;
    
    background:#F2F1EC;  
    
    z-index:0;
  }
  
  .chat-view__header{
    position:relative;
    border-bottom:1px solid hsla(0, 0%, 50%, .1);  
    
    height:40px;
    
    &:after{
      position:absolute;
      content:'';
      bottom:-15px;
      left:0;
      right:0;
        
      height:15px;
      background:radial-gradient(50% 30% at center top, hsla(0, 0%, 50%, .1), transparent);
    }
  }
.message {
    display: flex;
    align-items: center;
    margin: 10px 0;
 }
 
 .outgoing {
    justify-content: flex-end;
 }
 
 .incoming {
    flex-direction: row; /* Solda mesaj, sağda resim */
    justify-content: flex-start;
 }
 
 .text {
    background-color: #e0e0e0;
    padding: 10px;
    border-radius: 8px;
    max-width: 60%;
    word-wrap: break-word;
 }
 
 .profile-pic {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin: 0 8px;
 }
 .chat-view__input{
    position:absolute;
    bottom:0;
    left:0;
    width:100%;
    padding:.25em .5em .5em .75em;  
  }
  
  .input{
    position:relative; 
    float:left;
      
    
    width:480px;
    
    margin-top:1px;
    
    background:white; 
    
    padding:0 .3em;
    
    border:none;
    border-radius:4px;
    
    border:1px solid #CDCDCA;
    box-shadow: 0   0   2px 0  #CDCDCA inset;
  
    white-space:nowrap; 
    
    &:after{
      @extend %pseudo-content;
      top:50%;
      right:-2px;    
      
      margin-top:-3px;
        
      width:6px;
      height:6px;
        
      background:white; 
        
      box-shadow: 1px -1px 0 .5px #CDCDCA;
        
      transform:rotate(45deg);
    }
      
    input{
      font-size:1.1em;
      appearance:none;
      border:none; 
      width:93%;     
        
      outline:none;
    }
  }
  
  .input__emoticon{
    position:relative;
    display:inline-block;
    float:right;
    
    margin-top:.32em; 
     
    height:.8em;
    width:.8em;
    
    opacity:.5;
    
    border:.15em solid #B3B3B1;  
    border-radius:100%;
    
    &:after, &:before{
      border-radius:100%;
    }
    &:before{
     top:.14em;
     left:.15em;
       
     width:.2em;
     height:.2em;
        
     background-color:#B3B3B1;
     box-shadow:.35em 0 0 0 #B3B3B1;   
    }
    &:after{
      top:.12em;
      left:.12em;
      right:.12em;
      bottom:.12em;  
      
      clip:rect(.3em auto auto 0);
        
      border: .125em solid #B3B3B1;
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


.flexmeta{
    display: flex;
  }

  .nameArea{
    margin-left: 1.5rem;
    margin-top: 5px;
  }
  
  
  
 
</style>