Vue.createApp({
    data() {
      return {
          Id : 0,
          Player: "",
          Muderer: true,
          Winner: false,
        
          Players: [
              { Id: 1, Player: "Peter", Muderer: true },
              { Id: 2, Player: "John", Muderer: false },
              { Id: 3, Player: "Mary", Muderer: false },
              { Id: 4, Player: "Sophie", Muderer: false },
              { Id: 5, Player: "Tom", Muderer: false },
          ],
      };
    },
    methods: {
      
    }
  }).mount('#app');