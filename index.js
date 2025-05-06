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
                { id: 1, name: "Peter", role: 'Murderer',clicked: false },
                { id: 2, name: "John", role: 'name',clicked:false },
                { id: 3, name: "Mary", role: 'name',clicked:false },
                { id: 4, name: "Sophie", role: 'name',clicked:false },
                { id: 5, name: "Tom", role: 'name',clicked:false },
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
        async vote(id) {
            this.Players.forEach( player => {
                player.clicked = false
            })

            const player = this.Players.find( p => p.id === id)
            player.clicked = !player.clicked
        },
    }
}).mount('#app');
