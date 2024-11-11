<template>
    <div v-if="isOpen" class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <button class="modal-close" @click="close">X</button>
        <h2>Fotoğraf Yükle</h2>
        <input type="text" v-model="localName" placeholder="Fotoğraf Adı" />
        <textarea v-model="localDescription" placeholder="Açıklama"></textarea>
        <input type="file" @change="onFileSelected" />
        <input type="checkbox" v-model="locationEnabled" @change="handleLocationChange" />Konum Ekle
        <p v-if="city">Bulunduğunuz şehir: {{ city }}</p>
        <button @click="emitUpload">Yükle</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['isOpen', 'name', 'description'],
    data() {
      return {
        localName: this.name || '',
        localDescription: this.description || '',
        selectedFile: null,
        locationEnabled: false, 
        city: "",               
        error: null   
      };
    },
    methods: {
      close() {
        this.$emit('close');
      },
      onFileSelected(event) {
        this.selectedFile = event.target.files[0];
      },
      emitUpload() {
        this.$emit('upload', {
          file: this.selectedFile,
          name: this.localName,
          description: this.localDescription,
          location: this.city
        });
      },
      handleLocationChange() {
      if (this.locationEnabled) {
        this.getLocation(); 
      } else {
        this.clearLocation(); 
      }
    },

   
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          this.reverseGeocode,
          (err) => {
            this.error = "Konum alınamadı: " + err.message;
          }
        );
      } else {
        this.error = "Tarayıcı konum almayı desteklemiyor.";
      }
    },

    // Ters geokodlama işlemi
    async reverseGeocode(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        this.city = data.address.city || data.address.town || "Şehir bilgisi bulunamadı";
      } catch (error) {
        this.error = "Geocode işlemi başarısız: " + error.message;
      }
    },

    // Şehir ve hata verilerini temizler
    clearLocation() {
      this.city = "";
      this.error = null;
    }

    },
    watch: {
      name(newValue) {
        this.localName = newValue;
      },
      description(newValue) {
        this.localDescription = newValue;
      }
    },
    beforeDestroy() {
      this.$off('close');
      this.$off('upload');
    }
    
  };
  </script>
  
  
<style scoped>
  /* Modal arka plan */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5); /* Arka plan bulanıklığı */
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  /* Modal kutusu */
  .modal-content {
    width: 90%;
    max-width: 500px;
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    position: relative;
  }
  
  /* Modal başlık */
  .modal-content h2 {
    margin-top: 0;
    font-size: 1.5rem;
    color: #333;
  }
  
  /* Input alanları */
  .modal-content input[type="text"],
  .modal-content textarea,
  .modal-content input[type="file"] {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  /* Yükle butonu */
  .modal-content button {
    width: 100%;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .modal-content button:hover {
    background-color: #45a049;
  }
  
  /* Kapatma butonu */
  .modal-close {
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: #888;
    font-weight: bold;
    float: right;
    max-width: -webkit-fit-content;
  }
  
  .modal-close:hover {
    color: #555;
  }
  </style>
  