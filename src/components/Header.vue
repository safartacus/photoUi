<template>
  <header class="header">
    <Container class="header-inner">
      <!-- logo -->
      <router-link to="/" class="logo">
        Instagram
      </router-link>

      <!-- search -->
      <form autocomplete="off" class="search">
        <input 
            type="text" 
            v-model="searchTerm" 
            @input="onSearch" 
            placeholder="Username ile ara" 
          />
          <div class="row" style="margin-top:1rem;" v-if="results.length">
            <div v-for="user in results" :key="user._id">
              <router-link :to="`/profile/tag/${user._id}`">
                <CustomText tag="b">{{user.userName}}</CustomText>
              </router-link>
            </div>
          </div>
      </form>
      

      <!-- navigation -->
      <nav class="navigation">
        <button @click="openModal"><AddNewIcon></AddNewIcon></button>
        <Modal
          :isOpen="isModalOpen"
          :name="name"
          :description="description"
          :city="location"
          @close="isModalOpen = false"
          @upload="handleUpload"
        />
        <router-link to="/">
          <IconHomeFill v-if="$route.name === 'Home'" />
          <IconHome v-else />
        </router-link>
        <router-link to="/direct">
          <IconDirectFill v-if="$route.name === 'Direct'" />
          <IconDirect v-else />
        </router-link>
        <router-link to="/explore">
          <IconExploreFill v-if="$route.name === 'Explore'" />
          <IconExplore v-else />
        </router-link>
        <router-link to="/profile">
          <Avatar />
        </router-link>
      </nav>
    </Container>
  </header>
</template>

<script>
import CustomText from '@/components/CustomText'
import IconHome from '@/icons/home.svg'
import IconHomeFill from '@/icons/home-fill.svg'
import IconDirect from '@/icons/direct.svg'
import IconDirectFill from '@/icons/direct-fill.svg'
import IconExplore from '@/icons/explore.svg'
import IconExploreFill from '@/icons/explore-fill.svg'
import AddNewIcon from '@/icons/addnew.svg'
import Container from '@/components/Container'
import Avatar from '@/components/Avatar'
import Modal from '@/components/AddNewPhotoModal'
import axios from 'axios'

export default {
  name: 'MainHeader',
  components: {
    Avatar,
    Container,
    IconHome,
    IconHomeFill,
    IconDirect,
    IconDirectFill,
    IconExplore,
    IconExploreFill,
    AddNewIcon,
    Modal,
    CustomText
  },
  data() {
    return {
      isModalOpen: false,
      selectedFile: null,
      name: '',
      description: '',
      location: '',
      searchTerm: '',
      results: []
    }
  },
  methods: {
    onSearch() {
      if (this.searchTerm.length >= 3) {
        axios
          .get(`http://localhost:3000/user/search?userName=${this.searchTerm}`,{
          headers: { 
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Credentials': 'true'
           },
           withCredentials: true
          }).then((response) => {
            this.results = response.data;
          }).catch((error) => {
            console.error('Arama hatası:', error);
          });
      } else {
        this.results = []; // 3 karakterden azsa sonuçları temizle
      }
    },
    openModal() {
      this.isModalOpen = true;
    },
    handleUpload({ file, name, description, location }) {
      this.selectedFile = file;
      this.name = name;
      this.description = description;
      this.location = location;
      this.uploadPhoto();
    },
    async uploadPhoto() {
      if (!this.selectedFile) return;


      const formData = new FormData();
      formData.append('name', this.name);
      formData.append('description', this.description);
      formData.append('image', this.selectedFile);
      formData.append('location', this.location);


      try {
        await axios.post('http://localhost:3000/photos/addPhoto', formData, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Credentials': 'true'
           },
           withCredentials: true
        });
        alert('Fotoğraf yüklendi!');
        this.isModalOpen = false;

        // Değerleri sıfırlama
        this.name = '';
        this.description = '';
      } catch (error) {
        console.error('Yükleme hatası:', error);
      }
    }
  },
}
</script>

<style scoped>
.header {
  z-index: 90;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  background-color: white;
  border-bottom: 1px solid rgb(var(--b6a));
}

.header-inner {
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: center;

  @media (--t) {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
  }
}

.logo {
  font-size: 1.6rem;
  font-weight: bold;
}

.search {
  display: none;

  @media (--t) {
    display: block;
    text-align: center;

    input {
      width: 215px;
      height: 28px;
      border: 1px solid rgb(var(--b6a));
      background-color: rgb(var(--b3f));
      border-radius: 4px;
      padding-left: 20px;
      padding-right: 20px;
    }
  }
}
.search-Result{
  width: 215px;
  height: 28px;
  border: 1px solid rgb(var(--b6a));
  background-color: rgb(var(--b3f));
  border-radius: 4px;
  padding-left: 20px;
  padding-right: 20px;
}
.navigation {
  z-index: 90;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  border-top: 1px solid rgb(var(--b6a));
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-around;

  @media (--t) {
    height: auto;
    border: 0;
    position: static;
    justify-content: flex-end;

    a {
      margin-left: 20px;
    }
  }
}
</style>
