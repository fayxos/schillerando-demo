<template>
  <div>
    <canvas id="test" width="145" height="225"></canvas>
    <div id="mapContainer"></div>
    <div id="error" style="display: none">Karte nicht verfügbar</div>
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export default {
  name: 'MapProvider',
  props: ['data'],
  data() {
    return {
      pinData: [],
    };
  },
  setup() {
    var pin = new Image();
    pin.src = require('@/assets/pin.png');

    return {
      pin,
    };
  },
  computed: {
    standardizedPositions() {
      if (this.$props.data === null) {
        return [{ position: [0, 0] }];
      }

      return this.$props.data;
    },
    center() {
      if (this.standardizedPositions.length === 1)
        return this.standardizedPositions[0];
      else return { position: [48.935283, 9.2627305] };
    },
  },
  mounted() {
    if (this.data != null) this.pinData = this.data;

    console.log(this.pinData);

    if (this.pinData.length > 0) {
      var startZoom = 16.5;
      var startPos = [48.93452321902908, 9.263819092113069];

      var map = L.map('mapContainer').setView(startPos, startZoom);
      map.setZoom(16.5);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 22,
        minZoom: 16.5,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      if ('geolocation' in navigator) {
        navigator.geolocation.watchPosition((position) => {
          L.circleMarker([
            position.coords.latitude,
            position.coords.longitude,
          ]).addTo(map);
        });
      } else {
        console.log(false);
      }

      this.buildIcons();

      for (let i = 0; i < this.pinData.length; i++) {
        L.marker(this.pinData[i].position, {
          icon: this.pinData[i].icon,
        }).addTo(map);
      }

      map.on('click', (e) => {
        console.log(e.latlng);
      });
    } else {
      document.getElementById('mapContainer').style.display = 'none';
      document.getElementById('error').style.display = 'block';
      console.log('Illegal positions-data');
    }

    this.buildIcons();
  },
  methods: {
    onMapClick(e) {
      console.log(e);
    },
    buildIcons() {
      var canvas = document.getElementById('test');
      var ctx = canvas.getContext('2d');

      for (var i = 0; i < this.pinData.length; i++) {
        if (this.pinData[i].image == null) {
          let icon = L.icon({
            iconUrl: this.pin.src,
            iconSize: [29, 45],
            iconAnchor: [14.5, 45],
          });
          this.pinData[i].icon = icon;
          continue;
        }

        ctx.drawImage(this.pin, 0, 0, 145, 225);

        var width = 135;
        var height = 135;
        var x = (145 - width) / 2;
        var y = (145 - width) / 2;

        ctx.beginPath();
        ctx.arc(x + width / 2, y + height / 2, width / 2, 0, 10);

        ctx.clip();

        var logo = new Image();
        logo.src = this.pinData[0].image;

        if (logo.width > logo.height) {
          var scale = logo.height / width;
          var w = logo.width / scale;
          var h = height;
          var posX = (width - w) / 2;
          var posY = y;
        } else {
          scale = logo.width / width;
          h = logo.height / scale;
          w = width;
          posX = x;
          posY = (height - h) / 2;
        }

        ctx.drawImage(logo, posX, posY, w, h);

        var mergedImage = canvas.toDataURL('image/png');

        let icon = L.icon({
          iconUrl: mergedImage,
          iconSize: [29, 45],
          iconAnchor: [14.5, 45],
        });
        this.pinData[i].icon = icon;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    },
  },
};
</script>

<style scoped>
#mapContainer {
  width: 100%;
  height: 100%;
}

#test {
  position: absolute;
}
</style>
