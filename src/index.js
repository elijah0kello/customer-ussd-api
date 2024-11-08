require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const {fetchBalance, buyAirtime, sessionMap, addSession, updateSession, getCountryName, getSession} = require("./utils")

const app = express();
const port = process.env.PORT
if(!port){
    throw new Error("Port number not set")
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('tiny'));


const UssdMenu = require('ussd-builder');
let menu = new UssdMenu();

// Define menu states
menu.startState({
    run: () => {
        // use menu.con() to send response without terminating session      
        menu.con('Welcome. Choose option:' +
            '\n1. Show Balance' +
            '\n2. Buy Airtime' + 
            '\n3. COMESA Payment' +
            '\n4. My Account' +
            '\n5. My Phone Number' + 
            '\n6. Pay Bill');
    },
    // next object links to next state based on user input
    next: {
        '1': 'showBalance',
        '2': 'buyAirtime',
        '3': 'comesaPayment'
    }
});

menu.state('comesaPayment', {
    run: () => {
        menu.con('Comesa Payment Services'+
            '\n1. Send Money'
        );
    },
    next: {
        '1': 'sendMoney'
    }
});

menu.state('sendMoney', {
    run: () => {
        menu.con('Enter Account/Phone Number');
    },
    next: {
        '*\\d+': 'selectCountry'
    }
});

menu.state('selectCountry', {
    run: () => {
        // store account_number
        updateSession(menu.args.sessionId,{accountNumber: menu.val});
        menu.con('Select a country'+
            '\n1. Malawi' + 
            '\n2. Zambia'
        );
    },
    next: {
        '1': 'enterAmount',
        '2': 'enterAmount'
    }
});

menu.state('enterAmount',{
    run: () => {
        // store country
        updateSession(menu.args.sessionId,{country: getCountryName(Number(menu.val))});
        menu.con('Enter Amount')
    },
    next: {
        '*\\d+': 'enterRemarks'
    }
});

menu.state('enterRemarks', {
    run: () => {
        // store amount
        updateSession(menu.args.sessionId,{amount: menu.val});
        menu.con('Enter Remarks')
    },
    next: {
        '*[a-zA-Z]+': 'confirmDetails'
    }
});

menu.state('confirmDetails', {
    run : () => {
        //store remarks
        updateSession(menu.args.sessionId,{remarks: menu.val});
        // perform POST /send-money
        menu.con('You are sending Chikondi Banda 300 MWK. 50 ZMW will be debited from your account subject to your providers fees' +
            '\n1. Proceed' + 
            '\n2. Abort' 
        );
    },
    next: {
        '1': 'proceedSendMoney',
        '2': 'abortSendMoney'
    }
});

menu.state('proceedSendMoney', {
    run: () => {
        // PUT /send-money/{id}
        console.log(`Session Data => ${getSession(menu.args.sessionId)}`);
        menu.end("Transaction in progress")
    },
});

menu.state('abortSendMoney', {
    run: () => {
        // PUT /send-money/{id}
        console.log(`Session Data => ${getSession(menu.args.sessionId)}`);
        menu.end("Transaction aborted");
    }
});

menu.state('showBalance', {
    run: () => {
        // fetch balance
        fetchBalance(menu.args.phoneNumber).then((bal)=>{
            // use menu.end() to send response and terminate session
            menu.end('Your balance is GHC ' + bal);
        });
    }
});

menu.state('buyAirtime', {
    run: () => {
        menu.con('Enter amount:');
    },
    next: {
        // using regex to match user input to next state
        '*\\d+': 'buyAirtime.amount'
    }
});

// nesting states
menu.state('buyAirtime.amount', {
    run: () => {
        // use menu.val to access user input value
        var amount = Number(menu.val);
        buyAirtime(menu.args.phoneNumber, amount).then((res)=>{
            menu.end('Airtime of '+ amount +' bought successfully.');
        });
    }
});

// Registering USSD handler with Express

app.post('/', (req, res)=>{
    menu.run(req.body, ussdResult => {
        res.send(ussdResult);
    });
});

app.listen(port, () => {
    console.log(`ussd api server listening on port ${port}`)
});