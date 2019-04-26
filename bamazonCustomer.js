// 5. Then create a Node application called `bamazonCustomer.js`. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.

// 6. The app should then prompt users with two messages.

//    * The first should ask them the ID of the product they would like to buy.
//    * The second message should ask how many units of the product they would like to buy.

// 7. Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

//    * If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.

// 8. However, if your store _does_ have enough of the product, you should fulfill the customer's order.
//    * This means updating the SQL database to reflect the remaining quantity.
//    * Once the update goes through, show the customer the total cost of their purchase.

let mysql = require("mysql");
let inquirer = require("inquirer");

let connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root2",

    // Your password
    password: "root2",
    database: "bamazon"
});


connection.connect(function (err) {
    if (err) return;
    console.log("connected as id " + connection.threadId);
    listAllProducts();

});

//List all products in console
function listAllProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) return;
        // console.log(res);
        for (var i = 0; i < res.length; i++) {
            console.log("Item ID: " + res[i].item_id);
            console.log("Product Name: " + res[i].product_name);
            console.log("Department Name: " + res[i].department_name);
            console.log("Price: " + res[i].price);
            console.log("Stock quantity: " + res[i].stock_quantity);
        }
        //function that performs all the calculation and is the mother of all functions
        productIDQuery();


    });
};

//declaring vars as global because i am a noob and i think this will help me somehow
var prod_id;
var quant_num;
var price;


// inquirer.prompt(
//     [
//     {
//      type:"input",
//      name: "id",
//      message: "what product ID would you like to buy"
//     }
//     ]
// ).then(function(response){ let choiceID = parseInt(response.id)};
// inquirer.prompt(
//         [    
//         {
//          type:"input",
//          name: "qty",
//          message: "what qty would you like to buy"
//         }
//         ]
// ).then(function(qtyResponse){
// });
// });
// });


//starting my main function
var productIDQuery = function () {
    //a thingie i saw online that should prevent wrong inputs
    function validateAnswers(valAns) {
        return valAns !== '';
    }
    //firing the prompts 
    var questions = [{
            message: "Please enter a product id",
            type: "input",
            name: "inputProdID",
            validate: validateAnswers
        }, {
            message: "Please enter a quantity",
            type: "input",
            name: "inputQuant",
            validate: validateAnswers
        },

    ];
    inquirer.prompt(questions).then(function (answer) {
        ///loading the responses into variables
        var availStock;
        prod_id = answer.inputProdID;
        quant_num = answer.inputQuant;

        console.log("this is the product ID the user selected " + prod_id + " this is the quantity the user selected " + quant_num);

        //querying the db by ID
        var query = "SELECT item_id, product_name, department_name, price, stock_quantity FROM products WHERE ?";
        connection.query(query, {
            item_id: prod_id
        }, function (err, res) {
            console.log(res);

            //loading the stock and price into vars

            for (var i = 0; i < res.length; i++) {
                var availStock = res[i].stock_quantity;
                price_output = res[i].price;
            }

            //updating stock

            var updateStock = function () {
                console.log("Updating all quantities...\n");
                let query = connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [{
                            stock_quantity: stockCalc
                        },
                        {
                            item_id: prod_id
                        }
                    ],
                    function (err, res) {
                        console.log(res.affectedRows + " row updated!\n");

                    }
                );

            }
            //checking to see if we can let the user shop in our exclusive store
            if (quant_num < availStock) {
                console.log("We have some stock " + availStock);
                var stockCalc = availStock - quant_num;
                updateStock();
                console.log("Your total cost is " + price_output * quant_num)
                connection.end();

            } else {
                console.log("We have insufficient quantity")
                connection.end();
            }

        })


    })
}