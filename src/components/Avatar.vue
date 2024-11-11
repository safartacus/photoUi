<template>
  <figure class="avatar">
    <img :src="profilePictureSrc" :alt="alt" :width="size" :height="size" />
  </figure>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Avatar',
  props: {
    src: {
      type: String,
      default: null
        
    },
    alt: {
      type: String
    },
    size: {
      type: [Number, String],
      default: 26
    }
  },
  data() {
    return {
      userDetail: null
    }
  },
  computed: {
    profilePictureSrc() {
      return this.src || (this.userDetail && this.userDetail.profilePicture) || 'default-avatar.png';
    }
  },
  created() {
    this.loadUserDetail();
  },
  methods: {
    async loadUserDetail() {
      try {
        const response = await axios.get('http://localhost:3000/user/detail',{
          headers: { 
              'Content-Type': 'multipart/form-data',
              'Access-Control-Allow-Credentials': 'true'
             },
             withCredentials: true
          });
        this.userDetail = response.data;
      } catch (error) {
        console.error('User detail yüklenirken hata oluştu:', error);
      }
    },
  }
}
</script>

<style scoped>
.avatar {
  display: inline-flex;
  padding: 2px;
  border-radius: 999px;
  background: linear-gradient(
    219deg,
    rgba(184, 63, 140, 1) 0%,
    rgba(237, 158, 90, 1) 100%
  );

  img {
    border-radius: inherit;
    border: 2px solid white;
  }
}
</style>
