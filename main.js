var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var menuItems = {
    "hot dog":3,
    "hamburger":2,
    "Frosty":.99,
    "chicken sandwich":3.25,
    "ribs":35,
    "booty meat":23
}
Object.keys(menuItems).reduce((c,v)=>c+" "+v)

function OrderAnalyzer(order,menuItems){
    this.order = order;
    this.menuItems = menuItems;
    this.currentTotal = 0;
    this.itemsCalled = [];
    this.total = 0;
    this.showStringInConsole = true;
    this.getItemsCalled = function(){
        if(this.showStringInConsole === true)
          console.log(this.order);
        let itemsCalled = [];
        Object.keys(menuItems).map(menuItem=>{
            if( this.order.includes(menuItem) )
                itemsCalled.push(menuItem);
            
        })
        this.itemsCalled = itemsCalled;
    }
    this.getMarkupTable=function(){
        let table  = document.createElement("table");
        let header = "<tr><th>Item<th>Cost</tr>";
        let total  = "<tr><th>Total<td>"+this.getTotal()+"</tr>";
        let markup = 
          header + 
          this.itemsCalled.map(item=>"<tr><td>"+item+"<td>"+this.menuItems[item]+"</tr>").join() + 
          total;
        table.classList.add("table","w-50")
        table.innerHTML = markup;
        return table;
    }
    this.getTotal = function(){
      let total = 0;
      if(this.itemsCalled.length === 0){
        return 0;
      }else if(this.itemsCalled.length === 1){
        return this.menuItems[this.itemsCalled[0]];
      }else{
        this.itemsCalled.map(key=>total+=this.menuItems[key]);
        return total;
      }
      
    }
    this.getItemsCalled();
}


var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(menuItems, 1);
recognition.grammars = speechRecognitionList;
//recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var diagnostic = document.querySelector('.output');

recognition.onresult = function(event) {
  var last = event.results.length - 1;
  var orderString = event.results[last][0].transcript;
  var Order = new OrderAnalyzer(orderString,menuItems);
  let OrdersWrapper = document.querySelector(".orders_wrapper");
  let OrderTable;
  OrdersWrapper.innerHTML = "";
  OrderTable = Order.getMarkupTable();
  OrdersWrapper.appendChild(OrderTable);
  //console.log('Confidence: ' + event.results[0][0].confidence);
}

recognition.onspeechend = function() {
  recognition.stop();
}

recognition.onnomatch = function(event) {
  diagnostic.textContent = "I didn't recognise that color.";
}

recognition.onerror = function(event) {
  diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
}