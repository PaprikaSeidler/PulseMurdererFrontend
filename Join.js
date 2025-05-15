const baseUrl = 'https://pulsemurdererrest20250508143404-fgb6aucvcwhgbtb6.canadacentral-01.azurewebsites.net/api/players'

Vue.createApp({
    data(){
        return{
            newPlayer: {
                Id:0,
                Name: null,
            },
            Players:[],
        }
    },
    async created(){
    },
    methods:{
        async getAllPlayers() {
            this.getPlayers(baseUrl)
        },
        async addPlayer() {
            try {
                let response = await axios.post(baseUrl, this.newPlayer)
                this.message = response.status + '' + response.statusText
                this.Players = this.getAllPlayers()
            }
            catch {
                alert(error.message)
            }
        },
        async joinGame() {
            try {
                await this.addPlayer()
                this.getAllPlayers()
                this.newPlayer = await axios.get(`${baseUrl}/${this.newPlayer.id}`)
                window.location.href = `/playerPage.html?id=${this.newPlayer.id}`
                //if (this.newPlayer.name !== "") {
                //}
            }
            catch (error) {
                console.error('Error joining game:', error);
            }
        },
    }
}).mount("#app")

