<template>
  <div class="home">
    <CustomText tag="h1">Profile Tag</CustomText>
    <div class="card green" v-if="userInfo">
      <div class="additional">
          <button style="margin: 10px;" v-if="canFollow" type="button" @click="toggleFollow"><FollowIcon></FollowIcon></button>
          <button style="margin: 10px;" v-else type="button" @click="toggleFollow"><UnFollowIcon></UnFollowIcon></button>
        <div class="user-card">
          <img src="https://upload.wikimedia.org/wikipedia/tr/c/cb/Monkey_D_Luffy.png">
        </div>
        <div class="more-info">
          <div class="stats">
            <div>
              <div class="title">Post Count</div>
              <i class="fa fa-trophy"></i>
              <div class="value">2</div>
            </div>
            <div>
              <div class="title">Followers</div>
              <i class="fa fa-gamepad"></i>
              <div class="value">{{userInfo.followers.length}}</div>
            </div>
            <div>
              <div class="title">Followed</div>
              <i class="fa fa-group"></i>
              <div class="value">{{userInfo.followed.length}}</div>
            </div>
            <div>
              <div class="title">Kayıt Tarihi</div>
              <div class="value">{{ formatDate(userInfo.user.createdAt) }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="general">
        <h1>{{userInfo.user.userName}}</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce a volutpat mauris, at molestie lacus. Nam vestibulum sodales odio ut pulvinar.</p>
        <span class="more">{{userInfo.user.eMail}}</span>
      </div>
    </div>
    <div class="value" v-else>.... user loading</div>
    <div class="photos-grid">
        <Post v-for="photo in photos" :key="photo._id" :photo="photo" />
      </div>
  </div>
</template>

<script>
import CustomText from '@/components/CustomText'
import FollowIcon from '@/icons/follow.svg'
import UnFollowIcon from '@/icons/unfollow.svg'
import axios from 'axios';
import Post from '@/components/Post'

export default {
  name: 'ProfileTag',
  components: {
    CustomText,
    Post,
    FollowIcon,
    UnFollowIcon
  },
  data() {
    return {
      userInfo: null,
      photos:[],
      currentUser: null,
      canFollow: true,
    };
  },
  computed: {
    formattedDate() {
      const date = new Date(this.user.createdAt);
      return date.toLocaleDateString('en-GB'); 
    }
  },
  
  props: ['id'],
  mounted() {
    this.fetchUser(this.id)
    this.getPhotos(this.id)
  },
  methods: {
    async getPhotos(id){
      try {
        const response = await axios.get(`http://localhost:3000/user/getAllPhotoByUserId/${id}`, {
          headers: { 
            'Access-Control-Allow-Credentials': 'true'
          },
          withCredentials: true
        });
        this.photos = response.data.photos;
      } catch (error) {
        console.error('Veri alınırken hata oluştu:', error);
      }
    },
    async fetchUser(id) {
      const url = "http://localhost:3000/user/";
      try {
        const response = await axios.get(url+ id,{
          headers: { 
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Credentials': 'true'
           },
           withCredentials: true
        });
        
        this.userInfo = response.data.userInfo;
        this.currentUser = JSON.parse(localStorage.getItem('user') || '{}'); 

        if (this.userInfo && this.userInfo.followers) { 
          const followerIds = this.userInfo.followers.map(f => f._id);
          this.canFollow = !followerIds.includes(this.currentUser._id);
        } else {
          this.canFollow = true;
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    async toggleFollow() {
      try {
        const formData = new FormData();
        formData.append('userId', this.userInfo.user._id);
        formData.append('follow', this.canFollow);

        const response = await axios.post('http://localhost:3000/user/followUnfollowUser',formData, {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': 'true',
          },
          withCredentials: true,
        });
        this.userInfo.followers = response.data.followers
        this.canFollow = !this.canFollow
      } catch (error) {
        console.error('Takip işlemi sırasında hata oluştu:', error);
      }
    },
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Abel');

html, body {
  background: #FCEEB5;
  font-family: Abel, Arial, Verdana, sans-serif;
}
.photos-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); 
  gap: 16px; 
}
.center {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%); /* Standard */
  -webkit-transform: translate(-50%, -50%); /* Chrome, Safari */
  -moz-transform: translate(-50%, -50%); /* Firefox */
  -ms-transform: translate(-50%, -50%); /* IE 9 */
  -o-transform: translate(-50%, -50%); /* Opera */
}

.card {
  width: initial;
  height: 250px;
  background-color: #fff;
  background: linear-gradient(#f8f8f8, #fff);
  box-shadow: 0 8px 16px -8px rgba(0,0,0,0.4);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  margin-bottom: 1.5rem;
}

.card h1 {
  text-align: center;
}

.card .additional {
  position: absolute;
  width: 150px;
  height: 100%;
  background: linear-gradient(#dE685E, #EE786E);
  transition: width 0.4s;
  overflow: hidden;
  z-index: 2;
}

.card.green .additional {
  background: linear-gradient(#92bCa6, #A2CCB6);
}


.card:hover .additional {
  width: 50%;
  border-radius: 0 5px 5px 0;
}

.card .additional .user-card {
  width: 150px;
  height: 100%;
  position: relative;
  float: left;
}

.card .additional .user-card::after {
  content: "";
  display: block;
  position: absolute;
  top: 10%;
  right: -2px;
  height: 80%;
  border-left: 2px solid rgba(0,0,0,0.025);
}

.card .additional .user-card .level,
.card .additional .user-card .points {
  top: 15%;
  color: #fff;
  text-transform: uppercase;
  font-size: 0.75em;
  font-weight: bold;
  background: rgba(0,0,0,0.15);
  padding: 0.125rem 0.75rem;
  border-radius: 100px;
  white-space: nowrap;
}

.card .additional .user-card .points {
  top: 85%;
}

.card .additional .user-card svg {
  top: 50%;
}

.card .additional .more-info {
  width: 500px;
  left: 150px;
  height: 100%;
}

.card .additional .more-info h1 {
  color: #fff;
  margin-bottom: 0;
}

.card.green .additional .more-info h1 {
  color: #224C36;
}

.card .additional .coords {
  margin: 0 1rem;
  color: #fff;
  font-size: 1rem;
}

.card.green .additional .coords {
  color: #325C46;
}

.card .additional .coords span + span {
  float: right;
}

.card .additional .stats {
  font-size: 2rem;
  display: flex;
  position: absolute;
  bottom: 1rem;
  left: 3rem;
  right: 1rem;
  top: auto;
  color: #fff;
}

.card.green .additional .stats {
  color: #325C46;
}

.card .additional .stats > div {
  flex: 1;
  text-align: center;
}

.card .additional .stats i {
  display: block;
}

.card .additional .stats div.title {
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
}

.card .additional .stats div.value {
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1.5rem;
}

.card .additional .stats div.value.infinity {
  font-size: 2.5rem;
}

.card .general {
  width: 300px;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  box-sizing: border-box;
  padding: 1rem;
  padding-top: 0;
}

.card .general .more {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  font-size: 0.9em;
}



</style>
