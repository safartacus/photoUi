<template>
  <div class="post">
    <!-- header -->
    <header class="header section">
      <div class="header-author">
        <Avatar :size="40" />
        <div class="header-author-info">
          <div>
            <router-link :to="`/profile/tag/${photo.user._id}`">
                <CustomText tag="b">{{photo.user.userName}}</CustomText>
            </router-link>
          </div>
          <div>
            <CustomText size="xsmall">{{photo?.location}}</CustomText>
          </div>
        </div>
      </div>
      <div class="header-more">
        <button type="button">
          <IconMore />
        </button>
      </div>
    </header>

    <!-- media -->
    <div class="post-media">
      <img style="max-height: 400px;"
        :src="photo.url[0]"
        alt=""
      />
    </div>

    <!-- actions -->
    <div class="action-buttons section">
      <button @click="likePhoto" type="button">
        <IconLike v-if="likeable" />
        <IconLikeFill v-else />
      </button>
      <button @click="makeComment" type="button">
        <IconComment />
      </button>
      <button type="button">
        <IconDirect />
      </button>
      <button class="action-save" type="button">
        <IconSave />
      </button>
    </div>

    <!-- view count -->

    <div class="view-count section">
      <custom-text tag="b">{{photo.likeCount}} likes</custom-text>
    </div>
    <div v-if="commentArea" style="margin-top: 4%; margin-bottom:4%;" class="view-count section">
      <textarea v-model="comment" class="grey-border" maxlength="50" placeholder="Yorum yaz" />
      <button @click="sendComment" type="button" style="float:right; margin-right:10px; margin-top:10px;" >
        <IconDirect/>
      </button>
    </div>
    <!-- comment list -->
    <div style="margin-top: 4%; margin-bottom:4%;" class="view-count section">
      <CustomText size="normal">{{photo.description}}</CustomText>
    </div>

    <div style="margin-bottom: 2%;" class="comment-list section">
      <div v-for="(comment, index) in photo.comments" :key="index" class="comment-container">
          <CustomText size="normal">{{ comment.user.userName }}</CustomText>
          <CustomText size="normal">:</CustomText>
          <CustomText size="normal" style="margin-left:2%">{{ comment.text }}</CustomText>
          <button @click="deleteComment(comment._id)" type="button" class="delete-btn">
            <IconTrash/>
          </button>
      </div>
    </div>
    <!-- datetime -->

    <!-- comment form -->
  </div>
</template>

<script>
import Avatar from '@/components/Avatar'
import CustomText from '@/components/CustomText'
import IconMore from '@/icons/more.svg'
import IconLike from '@/icons/like.svg'
import IconLikeFill from '@/icons/like-fill.svg'
import IconComment from '@/icons/comment.svg'
import IconDirect from '@/icons/direct.svg'
import IconSave from '@/icons/save.svg'
import IconTrash from '@/icons/trash.svg'
import axios from 'axios'
import { mapGetters } from 'vuex';

export default {
  name: 'Post',
  props: {
    photo: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters(['getUser']),
    user() {
      return this.getUser || {};
    }
  },
  data() {
    return {
      likeable: this.user && this.user._id ? !this.photo.likedBy.includes(this.user._id) : false,
      comment: '', // Yorum metni için veri alanı
      commentArea: false // Yorum alanının görünürlük durumu
    };
  },
  components: {
    IconLike,
    IconLikeFill,
    IconComment,
    IconDirect,
    IconSave,
    IconMore,
    CustomText,
    IconTrash,
    Avatar
  },
  methods: {
    async likePhoto(){
      const formData = new FormData();
      formData.append('photoId', this.photo._id);
      try {
        var result = await axios.post('http://localhost:3000/photos/likephoto', formData, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Credentials': 'true'
           },
           withCredentials: true
        })

        this.photo.likeCount = result.data.likeCount;
        this.photo.likedBy = result.data.likedBy;
        this.likeable = result.data.likeable;
        

      }
      catch (error) {
        console.error('Yükleme hatası:', error);
      }
    },
    makeComment(){
      this.commentArea = !this.commentArea;
    },
    async sendComment() {
      const formData = new FormData();
      formData.append('photoId', this.photo._id);
      formData.append('comment', this.comment);

      try {
        const result = await axios.post('http://localhost:3000/photos/addcomment', formData, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Credentials': 'true'
           },
           withCredentials: true
        });

        this.photo.comments.push(result.data.comment);
        this.comment = ''; // Yorum alanını temizle
        this.commentArea = false; // Yorum alanını kapat
      } catch (error) {
        console.error('Yorum gönderme hatası:', error);
      }
    },
    async deleteComment(commentId) {
      const formData = new FormData();
      formData.append('photoId', this.photo._id);
      formData.append('commentId', commentId);
      try {
        const response = await axios.post('http://localhost:3000/photos/deletecomment',  formData, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Credentials': 'true'
           },
           withCredentials: true
        });
        this.photo.comments = this.photo.comments.filter(x=>x._id == response.data.photoId);
      } catch (error) {
        console.error('Yorum silme hatası:', error);
      }
    }
  },
}
</script>

<style scoped>
.post {
  border-radius: 3px;
  border: 1px solid rgb(var(--b6a));
  margin-bottom: 10%;
}
.post-media {
  text-align: -webkit-center;
}

.section {
  padding-left: 16px;
  padding-right: 16px;
}

.header {
  height: 60px;
  display: flex;
  align-items: center;

  &-author {
    display: flex;
    align-items: center;

    &-info {
      margin-left: 8px;
    }
  }

  &-more {
    margin-left: auto;
  }
}

.action-buttons {
  height: 45px;
  display: flex;
  align-items: center;

  button {
    margin-right: 16px;
  }

  .action-save {
    margin-left: auto;
    margin-right: 0;
  }
}
.grey-border {
  border: 2px solid grey;
  border-radius: 4px; 
  padding: 10px; 
  width: 100%; 
  box-sizing: border-box; 
}
.comment-container {
  display: flex;
  align-items: center;
  position: relative;
  padding: 8px;
}

.delete-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: #ff4d4f;
  position: absolute;
  right: 0;
}

.comment-container:hover .delete-btn {
  display: inline-block;
}
</style>
