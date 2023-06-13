window.addEventListener("message", function (event) {
  var data = event.data;
  switch (data.type) {
      case "OpenUI":
          app.OpenUI();
      break;
  }
});

const app = new Vue({
  el: "#app",
  data: {
      show: false,
      items: [],
      selectedCategory: 'All',
      SepetItems : [],
      totalprice: 0,
  },

  methods: {
      OpenUI: function () {
          this.show = !this.show;
      },

      postMessage: function(url, data) {
        fetch(`https://${GetParentResourceName()}/${url}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        })

        .then(response => response.json())

        .then(data => {
          console.log("dfmaosdfmlşasdfmlş")
          this.items = data.config;
        })
      },

       handleKeyUp: function(e) {
        if (e.key == "Escape") {
          this.Gapa()
          }
      },

      AddSepet: function(item) {
      var sepetdenelervar = this.SepetItems.find(sepetitem => sepetitem.itemname === item.itemname);
        if (sepetdenelervar) {
          this.postMessage("Error", 'Zaten Sepetinizde Var');
          return;
        }
        var newItem = { itemname: item.itemname, label: item.label, category: item.category, price: item.price, tiklandi: 1 };
        this.SepetItems.push(newItem);
      },
    
      SepetKontrol(name, durum) {
        const sepetItem = this.SepetItems.find(item => item.itemname === name);
          if (sepetItem) {
            if (!durum) {
            sepetItem.tiklandi -= 1;
              if (sepetItem.tiklandi === 0) {
                this.SepetItems.splice(this.SepetItems.indexOf(sepetItem), 1);
              }
            } else {
            sepetItem.tiklandi += 1;
          }
        }
      },
    
      calculateTotalPrice() {
        this.totalprice = 0;
        this.totalprice = this.SepetItems.reduce((total, item) => total + (item.price * item.tiklandi), 0);
        return this.totalprice;
      },
  
      filterItems(category) {
        this.selectedCategory = category;
      },
  
      Gapa() {
        this.show = !this.show;
        this.SepetItems = [];
        this.postMessage("CloseNUI", {});
      },
  
      async Satinalindi(neresi) {
        if (neresi == "bank") {
          if (this.calculateTotalPrice() > 0) {
            for (let index = 0; index < this.SepetItems.length; index++) {
              const element = this.SepetItems[index];
              await this.postMessage("Satinalindi", {itemname: element.itemname, tiklandi: element.tiklandi, neresi: "bank", totalprice: this.totalprice});
            }
            this.Gapa()
          }
        } else if (neresi == "cash") {
          if (this.calculateTotalPrice() > 0) {
            for (let index = 0; index < this.SepetItems.length; index++) {
              const element = this.SepetItems[index];
              await this.postMessage("Satinalindi", {itemname: element.itemname, tiklandi: element.tiklandi, neresi: "cash", totalprice: this.totalprice});
            }
            this.Gapa()
          }
        }
      },
  },

  computed: {
      filteredItems() {
        if (this.selectedCategory === 'All') {
          return this.items;
        } else {
          return this.items.filter(item => item.category === this.selectedCategory);
        }
      },
  },

  mounted() {
    this.postMessage("CallItems", {});
    window.addEventListener('keyup', this.handleKeyUp);
  },

  destroyed() {
    window.removeEventListener('keyup', this.handleKeyUp);
  },
})
