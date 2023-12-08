<template>
  <div>
    <div id="map" style="position: absolute; width: 80%; height: calc(100vh - 500px); left: 10%; z-index: 0;"></div>
    <!-- 搜尋輸入框 -->
    <div class="map-container" style="position: absolute; top: 10px; left: 0; right: 0; text-align: center; z-index: 1;">
      <input v-model="searchText" type="text" placeholder="請輸入地點名稱" @input="onSearchInput" @keyup.enter="onSearchEnter"
        id="search-input" style="display: inline-block; color: black; font-size: 20px; background-color: #D9D9D9; margin-top: 10px;" />
      <span style="position: absolute; top: 0; right: 10px;">
        <i class="fa fa-search"></i>
      </span>
    </div>
  </div>
</template>


  
<script>
import loadGoogleMaps from '../config/google-maps-loader';


export default {
  name: 'MapComponent',
  props: ['searchInputValue'],
  data() {
    return {
      searchText: '', // 搜尋輸入框的值
      map: null, // Google 地圖實例
      searchBox: null, // 搜尋欄實例
      markers: [], // 用於儲存搜尋結果的標記陣列
      circle: null, // 圓形覆蓋範圍
      circleCenter: { lat: 24.95543, lng: 121.24062 }, // 中原夜市的經緯度
      //circleRadius: 1000, // 2公里的半徑
      shopAddresses: [] // 商店地址数据
    };
  },
  mounted() {
    /* global google */
    const apiKey = 'AIzaSyBvxy6I_D4Zy7bvdCGXc6580cHOGR8_elM';
    console.log(this.$props);

    loadGoogleMaps(apiKey)
      .then(googleMaps => {
        this.map = new googleMaps.Map(document.getElementById('map'), {
          center: this.circleCenter, // 初始地图中心
          zoom: 20, // 初始缩放级别
          mapTypeControl: false, // 隱藏地圖與衛星檢視按鈕
          fullscreenControl: false,
        });
        const searchInputElement = document.getElementById('search-input');
        if (searchInputElement) {
          searchInputElement.value = this.searchInputValue;
        }
        this.searchBox = new google.maps.places.SearchBox(searchInputElement);

        this.searchBox.setBounds(this.map.getBounds());
        // 監聽搜尋框的值改變事件
        google.maps.event.addListener(this.searchBox, 'places_changed', () => {
          this.onPlacesChanged();
        });

      });
  },
  methods: {
    onSearchInput() {
      this.searchBox.setBounds(this.map.getBounds());
    },
    onSearchEnter() {
      // 在这里可以处理搜索输入框的值改变事件
    },
    async onPlacesChanged() {
      // 在這裡處理搜尋結果改變事件
      // 可以獲取搜尋結果並在地圖上加上標記
      console.log(this.searchBox);

      const places = await this.searchBox.getPlaces();
      console.log(this.searchBox.getPlaces());
      this.clearMarkers();
      if (places.length === 0) {
        console.log('找不到符合條件的地點');
        return;
      }

      // 將搜尋結果的地點加上標記
      places.forEach((place) => {

        const marker = new google.maps.Marker({
          position: place.geometry.location,
          map: this.map,
          title: place.name
        });

        // 將標記加入標記陣列中，方便後續清除
        this.markers.push(marker);

      });

      // 調整地圖視野以包含所有標記
      const bounds = new google.maps.LatLngBounds();
      this.markers.forEach((marker) => {
        bounds.extend(marker.getPosition());
      });

      bounds.extend(this.circleCenter);
      this.map.fitBounds(bounds);
    },
    clearMarkers() {
      // 清除之前的標記
      this.markers.forEach((marker) => {
        marker.setMap(null);
      });
      this.markers = [];
    }
  }
};
</script>
