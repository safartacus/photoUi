<template>
  <div class="home">
    <tag :id="user._id"/>
  </div>
</template>

<script>
import Tag from '@/views/profile/tag.vue'
import { mapGetters } from 'vuex';

export default {
  name: 'ProfilePost',
  components: {
    Tag
  },
  data() {
    return {
      photos: []
    }
  },
  computed: {
    ...mapGetters(['getUser']),
    user() {
      return this.getUser || {};
    }
  },
  // async mounted() {
  //   try {
  //     const response = await axios.get('http://localhost:3000/user/userPhotos',{
  //         headers: { 
  //           'Content-Type': 'multipart/form-data',
  //           'Access-Control-Allow-Credentials': 'true'
  //          },
  //          withCredentials: true
  //       });
  //     this.photos = response.data.photos
  //   } catch (error) {
  //     console.error('Veri alınırken hata oluştu:', error)
  //   }
  // }
}
</script>

<style scoped>

</style>
