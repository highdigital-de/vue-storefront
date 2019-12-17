# Installation Instructions for Payone-Module:

This module was created to support the payment service Payone. At the moment it supports the payment via: 

- Creditcard (Iframe-CreditCardCheck, authorization)
- SEPA-Lastschrift (managemangate, authorization)
- Payment via Online Wallets like Paypal (authorization)
- Payment via online bank transfer like sofortüberweisung. (authorization)

## Which files need to be changed in VSF?
The following list describes which files needed to be changed in order to achieve the desired functionallity

- **vue-storefront/src/modules/payment-payone** 
  - /hooks/afterRegistration: 
    - Register the module, 
    - payment_method_configs, 
    - set Iframe Payone1-Attribute (to load iframe) which holds payment compoments, 
    - Mount Payment-Componentens if requested
  - /pages/* vue.Components which are shown in /checkout#Payment if one payment method is choosen
- **/vue-storefront/src/modules/index.ts**
  - Register module PaymentPayone
  - Deregister modules: Cash on Delivery, Payment-backend-methods
- **/vue-storefront/config/local.json**
  - urls not working with localhost on payone
  - use /?a=1,2,3  for success, error, back
  - ```
    { 
      ..
    "payone": {
      "hostUrlForRedirectBack": "http://7ba2de03.ngrok.io/",
      "paymentMethodId": {
        "paypal": "24",
        "sofort":"17",
        "cc":"10",
        "sepa": "3"  
      }
    }
    }
    ```

- **core/modules/checkout/components/Payment.ts**
  - Conditional Rendering of Payment-Components. 
  - Extend Functionality of OrderReview Button. ( DO Managemandate, save payment_details..)
    - mangagemandate for sepa..
    - creditcardcheck ..

- **core/modules/checkout/components/OrderReview.ts**
  - Extend Functionality of Place-Order Button. ( DO Managemandate, save payment_details..)
  - authorization call
  - relink to external eWallets, onlineBankTransfer

- **src/themes/default/head.js**
     ```
     script: [...
     `   {
      scr: 'https://secure.pay1.de/client-api/js/v1/payone_hosted_min.js',
      async: true
    }`
    ```

- **src/themes/default/components/core/blocks/Checkout/Payment.vue**
  - added node to inject iframe:     
  `<div id="Payone1" />`
  - added node to inject payment-components
  `         <div name="payone-test-container" :id="method.code"></div>`
  - injection point for Payment-module components via id
  - reset point on 'checkout-payment-method-changed' in payment.ts via name 

## Which files need to be changed in VSF-API?

- Defined endpoints in API: 
    managemandate(body) { }
    preauthorization(body) { }
    creditcardcheck(body) { }

- npm i js-md5 for hashing in creditcardcheck endpoint
  -    "js-md5": "^0.7.3",


- **/vue-storefront-api/config/local.json**
  - Extend Config and set parameters. 
  - ```
     "payone": {
    "mid": "16780",
    "portalid": "2012587",
    "key": "xx",
    "mode": "test",
    "aid": "17076",
    "api_version": "3.11"}
    ```

- **vue-storefront-api/src/api/payone.js**
  - Endpoint definition 
  - post/ get usw. 
  - Header defintion

- **vue-storefront-api/src/platform/abstract/payone.js**
  - Abstract Class definition

- **vue-storefront-api/src/platform/payone/payone.js**
  - includes logic and request piping to payone server api

## Installation

In VSF and VSF-API just add the above mentioned files 
- VSF: 
  ```
  $ yarn
  $ yarn dev
  ```
- VSF-API
  ```
  $ docker-compose -f docker-compose.yml -f docker-compose.nodejs.yml up -d
  $ docker ps // to find the VSF-API-CONTAINER-ID
  $ docker kill VSF-API-CONTAINER-ID
  $ yarn 
  $ yarn dev
  ```


## Open TODO's:

- deselct payment-methods on init
- grey out go to review order till isComplete() function gives a valid
- improve and secure redirect processing for the user (comming back to side)
- insert typ checking in front end and backend
- Test, Test, Test

## Pitfall's:
### iframe is not loading: 
- check if iframe is in console loaded
  - make sure iframe is loaded before creditcard component if loaded.
  otherwise try:
- Add following Script for Payone-CreditCard-IFrame to index.basic.template.html:

    ```
    <head> 
    	<script src="https://secure.pay1.de/client-api/js/v1/payone_hosted.js"></script>
    </head>
    ```
- Or Add following to src/themes/head.js
    ```
    script: [
    ...
    ,{
    src: 'https://secure.pay1.de/client-api/js/v1/payone_hosted_min.js',
    async: true,
    defer: true //Use this command if you script loads html from somewhere else, against crossplattform  errors in production build
    }]
    ```
