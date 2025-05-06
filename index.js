Vue.createApp({
    data() {
        return {
            id : 0,
            name: "",
            Muderer: true,
            Winner: false,
            player1Id: null,
            player2Id: null,
            voteCount: 0,
            voterButtonClicked: false,

            Players: [
                { id: 1, name: "Peter", role: 'Murderer' },
                { id: 2, name: "John", role: 'name' },
                { id: 3, name: "Mary", role: 'name' },
                { id: 4, name: "Sophie", role: 'name' },
                { id: 5, name: "Tom", role: 'name' },
            ],
            result: ''
        };
    },
    methods: {
        determineWinner() {
            const player1 = this.Players.find(player => player.id === Number(this.player1Id));
            const player2 = this.Players.find(player => player.id === Number(this.player2Id));

            if (!player1 || !player2) {
                this.result = 'Invalid player IDs. Please try again.';
                return;
            }

            if (player1.role === 'Murderer' || player2.role === 'Murderer') {
                this.result = 'The Murderer wins!';
            } else {
                this.result = 'The two players win!';
            }
        },
        vote(id) {
            if(voterButtonClicked === false){
                voterButtonClicked = true
            }
            else if(voterButtonClicked === true){
                voterButtonClicked = false
            }
        },
    }
}).mount('#app');
