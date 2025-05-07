const baseUrl = 'https://image-charts.com/chart?cht=qr&chs=300x300&chl='

Vue.createApp({
  data() {
    return {
        qrCodeImage: null,
        qrCodeUrl: null,
    };
  },
  methods: {
    async getQR() {
        try {
        const redirectURL = 'https://pulsemurderer-bqaqacc5feh8h3aa.northeurope-01.azurewebsites.net/PlayerPage.html'
        const qrCodeUrl = baseUrl + encodeURIComponent(redirectURL);

        const qrCodeImage = document.getElementById('qrCodeImage');
        qrCodeImage.src = qrCodeUrl;
    }
        catch (error) {
            console.error('Error fetching QR code:', error);
        }
    }
    
  }
}).mount('#app');