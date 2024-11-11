<template>
  <div class="home" v-if="userDetail && userDetail.user">
    <CustomText tag="h1">{{userDetail.user.userName}}</CustomText>
    <form @submit.prevent="saveProfile">
      <label for="bio">Bio:</label>
      <textarea id="bio" v-model="userDetail.bio"></textarea>

      <label for="location">Location:</label>
      <input type="text" id="location" v-model="userDetail.location" />

      <label for="website">Website:</label>
      <input type="text" id="website" v-model="userDetail.website" />

      <label for="interests">Interests:</label>
      <input type="text" v-model="newInterest" @keyup.enter="addInterest" />
      <ul>
        <li v-for="(interest, index) in userDetail.interests" :key="index">
          {{ interest }}
          <button type="button" @click="removeInterest(index)">Remove</button>
        </li>
      </ul>

      <!-- Profil resmi yükleme alanı -->
      <label for="profilePicture">Profile Picture:</label>
      <input type="file" id="profilePicture" @change="onFileChange" />

      <button type="submit">Save Profile</button>
    </form>
    <div v-if="previewImage">
      <h2>Profile Picture Preview:</h2>
      <img :src="previewImage" alt="Profile Picture" class="profile-image-preview" />
    </div>
  </div>
</template>

<script>
import CustomText from '@/components/CustomText'
import axios from 'axios'

export default {
  name: 'ProfileSave',
  components: {
    CustomText
  },
  data() {
    return {
      userDetail: {
        bio: '',
        location: '',
        website: '',
        interests: [],
        profilePicture: '' // Profil resmi için alan
      },
      newInterest: '',
      previewImage: null // Önizleme için alan
    }
  },
  mounted() {
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
    addInterest() {
      if (this.newInterest) {
        this.userDetail.interests.push(this.newInterest);
        this.newInterest = '';
      }
    },
    removeInterest(index) {
      this.userDetail.interests.splice(index, 1);
    },
    async saveProfile() {
      const formData = new FormData();
      // FormData nesnesine kullanıcı detaylarını ekle
      formData.append('bio', this.userDetail.bio);
      formData.append('location', this.userDetail.location);
      formData.append('website', this.userDetail.website);
      formData.append('interests', JSON.stringify(this.userDetail.interests));
      formData.append('profilePicture', this.userDetail.profilePicture);
      formData.append('userDetailId', this.userDetail._id);

      try {
        await axios.put('http://localhost:3000/user/userDetail', formData,{
          headers: { 
              'Content-Type': 'multipart/form-data',
              'Access-Control-Allow-Credentials': 'true'
             },
             withCredentials: true
          });
        alert('Profil güncellendi!');
      } catch (error) {
        console.error('Profil kaydedilirken hata oluştu:', error);
      }
    },
    onFileChange(event) {
      const file = event.target.files[0];
      this.userDetail.profilePicture = file; // Seçilen dosyayı al
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImage = e.target.result; // Önizleme için görüntüyü ayarla
      };
      reader.readAsDataURL(file); // Dosyayı DataURL olarak oku
    }
  }
}
</script>

<style scoped>
.home {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto; /* Ortalamak için */
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-top: 10px;
  font-weight: bold;
}

textarea, input[type="text"] {
  margin-top: 5px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

textarea {
  resize: none; /* Boyutlandırmayı engellemek için */
  height: 80px; /* Yüksekliği ayarla */
}

button {
  margin-top: 15px;
  padding: 10px;
  background-color: #4CAF50; /* Yeşil arka plan */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049; /* Hover efekti */
}

ul {
  list-style: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  background-color: #e0e0e0;
  margin-top: 5px;
  border-radius: 4px;
}

li button {
  background-color: #f44336; /* Kırmızı arka plan */
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
  transition: background-color 0.3s;
}

li button:hover {
  background-color: #e53935; /* Hover efekti */
}
.profile-image-preview {
  max-width: 200px; /* Önizleme resmi için maksimum genişlik */
  margin-top: 10px; /* Üstten boşluk */
}
</style>

