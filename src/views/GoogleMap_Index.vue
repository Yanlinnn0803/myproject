<template>
  <div>
    <!-- 搜寻输入框 -->
    <div>
      <div id="map" style="position: absolute; width: 100%; height: 100%; z-index: 0;"></div>
      <div class="map-container"
        style="position: absolute; bottom: 90%; left: 0; right: 0; text-align: center; z-index: 1;">
        <input v-model="searchText" type="text" placeholder="搜尋店家" @input="onSearchInput" @keyup.enter="onSearchEnter"
          id="search-input" style="width: 80%; display: inline-block; color: black; font-size: 20px; background-color: #f1f1f1;
          margin-top: 10px; border-radius: 5px; padding: 5px;" />
        <span style="position: absolute; top: 0; right: 10px;">
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MapComponent',
  data() {
    return {
      searchText: '', // 搜寻输入框的值
      map: null, // Google Map
      searchBox: null, // 搜寻欄值
      markers: [], // 用于存储搜寻结果的标记数组
      circle: null, // 圓形覆蓋範圍
      circleCenter: { lat: 24.955843828949874, lng: 121.2406139967242 }, // 經緯度
      circleRadius: 400 // 半徑縮小為500米
    };
  },
  mounted() {
    /* global google */
    this.loadScript(() => {
      // 创建地图
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: this.circleCenter,
        zoom: 20, // 缩放级别适合显示中原夜市
        mapTypeControl: false, // 隐藏地图与卫星视图按钮
        fullscreenControl: false, // 禁用全屏按钮
      });

      // 创建搜寻栏
      this.searchBox = new google.maps.places.SearchBox(
        document.getElementById('search-input')
      );

      // 监听搜寻栏的值改变事件
      this.searchBox.addListener('places_changed', this.onPlacesChanged);

      // 绘制圆形覆盖范围
      this.circle = new google.maps.Circle({
        strokeColor: 'transparent', // 设置边框颜色为透明
        strokeOpacity: 0, // 设置边框透明度为0
        fillColor: 'transparent', // 设置填充颜色为透明
        fillOpacity: 0, // 设置填充透明度为0
        map: this.map,
        center: this.circleCenter,
        radius: this.circleRadius
      });
    });
  },
  methods: {
    loadScript(callback) {
      // 载入 Google 地图 API
      const script = document.createElement('script');
      script.onload = callback;
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBvxy6I_D4Zy7bvdCGXc6580cHOGR8_elM&libraries=places`;
      document.body.appendChild(script);
    },
    onSearchInput() {
      this.searchBox.setBounds(this.map.getBounds());
    },
    onSearchEnter() {
      // 在这里处理搜寻输入框的值改变事件
    },
    onPlacesChanged() {
      // 在这里处理搜寻结果改变事件
      // 可以获取搜寻结果并在地图上加上标记
      const places = this.searchBox.getPlaces();
      this.clearMarkers();

      if (places.length === 0) {
        console.log('找不到符合條件的地点');
        return;
      }

      // 将搜寻结果的地点加上标记
      places.forEach((place) => {
        const distance = google.maps.geometry.spherical.computeDistanceBetween(
          place.geometry.location,
          this.circleCenter
        );

        // 如果地点在指定的范围内，则加上标记
        if (distance <= this.circleRadius) {
          const marker = new google.maps.Marker({
            position: place.geometry.location,
            map: this.map,
            title: place.name
          });

          // 将标记加入标记数组中，方便后续清除
          this.markers.push(marker);
        }
      });

      // 调整地图视野以包含所有标记
      const bounds = new google.maps.LatLngBounds();
      this.markers.forEach((marker) => {
        bounds.extend(marker.getPosition());
      });

      bounds.extend(this.circleCenter);
      this.map.fitBounds(bounds);
    },
    clearMarkers() {
      // 清除之前的标记
      this.markers.forEach((marker) => {
        marker.setMap(null);
      });
      this.markers = [];
    }
  }
};
</script>
