const baseUrlApi = 'https://image-charts.com/chart?cht=qr&chs=200x200&chl='

Vue.createApp({
  data() {
    return {
        qrCodeUrl: null,
    };
  },
  methods: {
    async getQR() {
        try {
        const redirectURL = 'https://pulsemurderer-bqaqacc5feh8h3aa.northeurope-01.azurewebsites.net/Join.html'
        this.qrCodeUrl = baseUrlApi + encodeURIComponent(redirectURL) + '&chf=bg,s,00000000&icqrf=880000&icqrb=dfdcdb';

        const qrCodeImage = document.getElementById('qrCodeImage');
        qrCodeImage.src = qrCodeUrl;
    }
        catch (error) {
            console.error('Error fetching QR code:', error);
        }
    } 
    
  }
}).mount('#appQR');
