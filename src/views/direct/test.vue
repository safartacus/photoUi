<template>
    <div class="chat-container" v-if="recipientUser && currentUserId">
      <h2>{{ recipientUser.user?.userName || 'Kullanıcı Adı Bulunamadı' }} kişiye mesaj gönder</h2>
      <ul class="message-list">
        <li v-for="(msg, index) in messages" :key="index" :class="{'sent' :msg.sender._id === currentUserId, 'received': msg.sender._id !== currentUserId}">
          <strong>{{ msg.sender.userName }}:</strong> {{ msg.text }}
        </li>
      </ul>
      <div class="input-container">
        <input v-model="message" placeholder="Mesajınızı yazın" @keyup.enter="sendMessage" />
        <button @click="sendMessage">Gönder</button>
      </div>
    </div>
    <div v-else>
      ------ yükleniyor lütfen bekleyin
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'DirectMessage',
  
    data() {
      const user = JSON.parse(localStorage.getItem('user'));
  
      return {
          recipientUser: null,
          message: '',
          messages: [],
          currentUser: 'Siz',
          currentUserId: user ? user._id : null, 
          recipientId: this.$route.params.id
      };
    },
    async created() {
          await this.loadMessages(); // Sayfa yüklendiğinde mesajları yükle
    },
    mounted() {
      this.fetchUserDetails();
      this.$socket.on('receiveMessage', (msg) => {
        this.messages.push({
          text: msg.text,
          sender: msg.sender, // Mesajın göndereni
          isSent: false // Alınan mesajlar için
        });
      });
    },
    methods: {
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
        } catch (error) {
          console.error('Kullanıcı bilgileri alınamadı:', error);
        }
      },
    }
  };
  </script>
  
  <style scoped>
  .chat-container {
    max-width: 600px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
  }
  
  .message-list {
    list-style-type: none;
    padding: 0;
    margin: 20px 0;
    max-height: 400px;
    overflow-y: auto;
  }
  
  .message-list li {
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
  }
  
  .sent {
    background-color: #dcf8c6;
    text-align: right;
  }
  
  .received {
    background-color: #f1f1f1;
    text-align: left;
  }
  
  .input-container {
    display: flex;
    justify-content: space-between;
  }
  
  input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  button {
    margin-left: 10px;
    padding: 10px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  