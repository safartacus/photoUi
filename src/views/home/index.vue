<template>
  <div class="home">
    <div class="timeline">
      <h1>Home</h1>
      <br />
      <br />
      <Post v-for="photo in photos" :key="photo._id" :photo="photo" />
      <br />
      <br />
      <br />
    </div>

    <div class="sidebar">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum, eius
        vero. Alias aut blanditiis commodi consectetur eligendi, et minima
        officiis omnis optio pariatur quod quos repudiandae rerum sed tempora
        voluptatibus?
      </p>
    </div>
  </div>
</template>

<script>
import Post from '@/components/Post'
import axios from 'axios'
import { mapState } from 'vuex';


export default {
  name: 'Home',
  components: { Post },

  data() {
    return {
      photos: []
    }
  },
  computed: {
        ...mapState(['getUser']),
  },
  user() {
      return this.getUser;
    },
  async mounted() {
    try {
      const response = await axios.get('http://localhost:3000/photos',{
          headers: { 
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Credentials': 'true'
           },
           withCredentials: true
        });
      this.photos = response.data.photos
    } catch (error) {
      console.error('Veri alınırken hata oluştu:', error)
    }
  }
}
</script>

<style scoped>
.home {
  max-width: 605px;
  margin-left: auto;
  margin-right: auto;

  @media (--t) {
    max-width: none;
    display: grid;
    grid-template-columns: 1fr 295px;
    grid-gap: 30px;
  }
}

.sidebar {
  display: none;
  @media (--t) {
    display: block;
  }
}
</style>
