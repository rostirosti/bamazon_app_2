// Create a new Node application called bamazonManager.js. Running this application will:
// List a set of menu options:
// View Products for Sale
// View Low Inventory
// Add to Inventory
// Add New Product
// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.

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
    managerView();

});


// View Products for Sale
// View Low Inventory
// Add to Inventory
// Add New Product
function managerView(){
    const inquirer = require('inquirer');

inquirer
  .prompt([
    {
      type: 'rawlist',
      name: 'mainMenu',
      message: 'Welcome to the B-Amazon Store - Manager View - Please Make a Selection',
      choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
      filter: function(val) {
        return val.toLowerCase();
      }
    },
  ])
  .then(answers => {
    // var mainMenuChoice = answers.mainMenu; 
    console.info(JSON.stringify(answers, null, '  '));
    console.log(answers.mainMenu);
    console.log(mainMenuChoice);

    var text;
var mainMenuChoice = answers.mainMenu; 

// adding a switch statement to select the queries that will be run
switch(mainMenuChoice) {
  case "view products for sale":
   console.log("you chose the choice to see products for sale");
   listAllProducts();
    break;
  case "view low inventory":
  console.log("you chose the choice to see the items with a low inventory");
  listLowInvProducts();
    break;
  case "add to inventory":
  console.log("you to add to the inventory");
  productIDQuery();
    break;
    case "add new product":
  console.log("you chose the choice to add a new product");
  addNewProduct();
    break;
} 
    
  });
}





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
       // productIDQuery();


    });
};

function listLowInvProducts() {
    connection.query("SELECT * FROM products WHERE stock_quantity<5", function (err, res) {
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
       // productIDQuery();


    });
};

//declaring vars as global because i am a noob and i think this will help me somehow
var prod_id;
var quant_num;
var dept_name;
var product_price;
var price;
var prod_name;

var updateStock = function () {
    console.log("Updating all quantities...\n");
    let query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [{
                stock_quantity: quant_num
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

        // if (quant_num < availStock) {
        //     console.log("We have some stock " + availStock);
        //     var stockCalc = availStock - quant_num;
        //     updateStock();
        //   console.log("Your total cost is " + price_output * quant_num)
        //     connection.end();

        // } else {
        //     console.log("We have insufficient quantity")
        //    connection.end();
        // }

        

        updateStock();

        connection.end();

        
    })
}

var addNewProduct = function () {
    //a thingie i saw online that should prevent wrong inputs
    function validateAnswers(valAns) {
        return valAns !== '';
    }
    //firing the prompts 
    var questions = [{
            message: "Please enter a product you would like to add",
            type: "input",
            name: "inputProdID",
            validate: validateAnswers
        }, {
            message: "Please enter a quantity",
            type: "input",
            name: "inputQuant",
            validate: validateAnswers
        },
        {
            message: "Please enter a department name",
            type: "input",
            name: "inputDeptName",
            validate: validateAnswers
        },
        {
            message: "Please enter the product price",
            type: "input",
            name: "inputProductPrice",
            validate: validateAnswers
        },

    ];
    inquirer.prompt(questions).then(function (answer) {
        ///loading the responses into variables
         var availStock;
        prod_name = answer.inputProdID;
        quant_num = answer.inputQuant;
        dept_name = answer.inputDeptName;
        product_price = answer.inputProductPrice;

        console.log("this is the product ID the user selected " + prod_id + " this is the quantity the user selected " + quant_num);

        function addStock() {
            console.log("Updating all quantities...\n");
            var records = [[`${answer.inputProdID}`, `${answer.inputDeptName}`, `${answer.inputProductPrice}`, `${answer.inputQuant}`]];
            let query = connection.query(
                "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ?", [records],
         //       ('Polaroid Camera', 'Electronics', 1000, 1)
            //     [
            //         `'${answer.inputProdID}',
            //         '${answer.inputDeptName}',
            //         ${answer.inputProductPrice},
            //         ${answer.inputQuant}`
                
            // ],
                function (err, res) {
                   
                    console.log(res.affectedRows + " row updated!\n");
        
                }
            );
        
        };

        addStock();

        // if (quant_num < availStock) {
        //     console.log("We have some stock " + availStock);
        //     var stockCalc = availStock - quant_num;
        //     updateStock();
        //   console.log("Your total cost is " + price_output * quant_num)
        //     connection.end();

        // } else {
        //     console.log("We have insufficient quantity")
        //    connection.end();
        // }

        

     

        
    })
}



        // //querying the db by ID
        // var query = "SELECT item_id, product_name, department_name, price, stock_quantity FROM products WHERE ?";
        // connection.query(query, {
        //     item_id: prod_id
        // }, function (err, res) {
        //     console.log(res);

        //     //loading the stock and price into vars

        //     for (var i = 0; i < res.length; i++) {
        //         var availStock = res[i].stock_quantity;
        //         price_output = res[i].price;
        //     }

            //updating stock


             //checking to see if we can let the user shop in our exclusive store
     

//         })


//     })