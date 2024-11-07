require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT
if(!port){
    throw new Error("Port number not set")
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const getText = (text)=>{
    
}

app.post('/', (req, res) => {
    // Read the variables sent via POST from our API
    const {
        sessionId,
        serviceCode,
        phoneNumber,
        text,
    } = req.body;

    let response = '';


    if (text == '') {
        // This is the first request. Note how we start the response with CON
        response = `CON What would you like to check
        1. My account
        2. My phone number
        3. Withdraw Cash
        4. Pay Bill
        5. Payments 
        6. School Fees
        7. Financial Services
        8 COMESA Payment`;
    } else if ( text == '1') {
        // Business logic for first level response
        response = `CON Choose account information you want to view
        1. Account number`;
    } else if ( text == '2') {
        // Business logic for first level response
        // This is a terminal request. Note how we start the response with END
        response = `END Your phone number is ${phoneNumber}`;
    }else if(text == '8') {
        // COMESA Payment
        response = `CON COMESA Payment Services
        1. Send Money`

    }else if(text == '8*1'){
        // Send Money
        response = `CON Enter Account / Phone Number`
    }else if (text == '8*1*1'){
        response = `CON Select Country 
        1. Malawi
        2. Zambia
        `;
    }else if (text == '8*1*1*1'){
        response = `CON Enter Amount`
    }else if (text == '8*1*1*1*1'){
        response = `CON Enter Remarks`
    }else if (text == '8*1*1*1*1*1'){
        response = `CON 
        You are sending Chikondi Banda 300 MWK. 50 ZMW will be debited from your account.
        1. Proceed
        2. Abort`
    }else if (text == '8*1*1*1*1*1*1'){
        response = `END Transaction in progress`
    }
    else if ( text == '1*1') {
        // This is a second level response where the user selected 1 in the first instance
        const accountNumber = 'ACC100101';
        // This is a terminal request. Note how we start the response with END
        response = `END Your account number is ${accountNumber}`;
    }

    // Send the response back to the API
    res.set('Content-Type: text/plain');
    res.send(response);
});

app.listen(port, () => {
    console.log(`ussd api server listening on port ${port}`)
});