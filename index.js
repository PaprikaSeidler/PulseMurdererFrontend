Vue.createApp({
    data() {
      return {
          Id : 0,
          Player: "",
          Muderer: true,
          Winner: false,
          player1Id: null,
          player2Id: null,
          voteCount: 0,
        
          Players: [
              { Id: 1, Player: "Peter", role: 'Murderer' },
              { Id: 2, Player: "John", role: 'Player' },
              { Id: 3, Player: "Mary", role: 'Player' },
              { Id: 4, Player: "Sophie", role: 'Player' },
              { Id: 5, Player: "Tom", role: 'Player' },
          ],
          result: ''
      };
    },
    methods: {
      determineWinner() {
          const player1 = this.Players.find(player => player.Id === Number(this.player1Id));
          const player2 = this.Players.find(player => player.Id === Number(this.player2Id));

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
      vote() {
          
      },
    }
}).mount('#app');