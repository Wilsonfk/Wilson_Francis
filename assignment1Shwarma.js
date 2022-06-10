const Order = require("./Order");
const large = 12;
const medium = 9;
const small = 6;
const popCost = 3;
const beverageCost = 2;
const OrderState = Object.freeze({
    WELCOMING:   Symbol("welcoming"),
    SIZE:   Symbol("size"),
    POP:Symbol("POP"),
    TOPPINGS:   Symbol("toppings"),
    BEVERAGE:  Symbol("BEVERAGE"),    PAYMENT: Symbol("payment")
});

module.exports = class BiriyaniOrder extends Order{
    constructor(sNumber, sUrl){
        super(sNumber, sUrl);
        this.stateCur = OrderState.WELCOMING;
        this.Size = "";
        this.bSize = "";
        this.pSize = "";
        this.cSize = "";
        this.bToppings = "";
        this.pToppings = "";
        this.cToppings = "";
        this.drink = "";
        this.Drinks = "";
        this.nOrder = 0;
        this.bItem = "Biriyani";
        this.pItem = "Pizza";
        this.cItem = "Chicken";
        this.itemCur = this.bItem;

    }
    handleInput(Input){
        let aReturn = [];
        switch(this.stateCur){
            case OrderState.WELCOMING:
                this.stateCur = OrderState.SIZE;
                aReturn.push("Welcome to Wilson's Kitchen!!!");
                aReturn.push("What size Biriyani would you like?");
                break;
            case OrderState.SIZE:
                this.stateCur = OrderState.TOPPINGS;
                this.Size = Input;
                if(this.Size=="large"){
                    this.nOrder=this.nOrder+large;
                }
                else if(this.Size=="medium"){
                    this.nOrder=this.nOrder+medium;
                }
                else{
                    this.nOrder=this.nOrder+small;
                }
                    
                aReturn.push("What side would you like?");
                break;
            case OrderState.TOPPINGS:
                
                if(this.itemCur == this.bItem){
                    this.stateCur = OrderState.SIZE;
                    this.bSize=this.Size;
                    this.bToppings =Input;
                    this.itemCur = this.pItem;
                    aReturn.push("What size Pizza would you like?");
                }
                else if(this.itemCur == this.pItem){
                    this.stateCur = OrderState.SIZE
                    this.pSize=this.Size;
                    this.pToppings =Input;
                    this.itemCur = this.cItem;
                    aReturn.push("What size fried chicken would you like?");
                }
                else if(this.itemCur == this.cItem){
                    this.stateCur = OrderState.POP
                    this.cSize=this.Size;
                    this.cToppings =Input;
                    aReturn.push("Which pop do you like?");
                }
                break;
            case OrderState.POP:
                this.stateCur = OrderState.BEVERAGE;
                this.drink = Input;
                aReturn.push("Which beverage do you prefer?");
                break;
            case OrderState.BEVERAGE:
                this.stateCur = OrderState.PAYMENT;
                if(Input.toLowerCase() != "no"){
                    this.Drinks = Input;
                    this.nOrder = this.nOrder + popCost+beverageCost;
                }
                aReturn.push("Thank-you for your order of");
                aReturn.push(`${this.bSize} ${this.bItem} with ${this.bToppings} topping , ${this.pSize} ${this.pItem} with ${this.pToppings} topping , ${this.cSize} ${this.cItem} with ${this.cToppings} topping ,${this.drink} and ${this.Drinks}`);
                if(this.Drinks){
                    aReturn.push("and drinks");
                }
                aReturn.push(`Your total amount is $${this.nOrder}`);
                aReturn.push(`Please pay for your order here`);
                aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`);
                break;
            case OrderState.PAYMENT:
                console.log(sInput);
                this.isDone(true);
                let d = new Date();
                d.setMinutes(d.getMinutes() + 20);
                aReturn.push(`Your order will be delivered at ${d.toTimeString()}`);
                break;
        }
        return aReturn;
    }
    renderForm(sTitle = "-1", sAmount = "-1"){
      // your client id should be kept private
      if(sTitle != "-1"){
        this.sItem = sTitle;
      }
      if(sAmount != "-1"){
        this.nOrder = sAmount;
      }
      const sClientID = process.env.SB_CLIENT_ID || 'put your client id here for testing ... Make sure that you delete it before committing'
      return(`
      <!DOCTYPE html>
  
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- Ensures optimal rendering on mobile devices. -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
      </head>
      
      <body>
        <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
        <script
          src="https://www.paypal.com/sdk/js?client-id=${sClientID}"> // Required. Replace SB_CLIENT_ID with your sandbox client ID.
        </script>
        Thank you ${this.sNumber} for your ${this.sItem} order of $${this.nOrder}.
        <div id="paypal-button-container"></div>
  
        <script>
          paypal.Buttons({
              createOrder: function(data, actions) {
                // This function sets up the details of the transaction, including the amount and line item details.
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: '${this.nOrder}'
                    }
                  }]
                });
              },
              onApprove: function(data, actions) {
                // This function captures the funds from the transaction.
                return actions.order.capture().then(function(details) {
                  // This function shows a transaction success message to your buyer.
                  $.post(".", details, ()=>{
                    window.open("", "_self");
                    window.close(); 
                  });
                });
              }
          
            }).render('#paypal-button-container');
          // This function displays Smart Payment Buttons on your web page.
        </script>
      
      </body>
          
      `);
  
    }
}