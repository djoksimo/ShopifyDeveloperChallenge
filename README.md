## Shopify Developer Internship Challenge - Danilo Joksimovic

This project was made for the Summer 2019 Shopify Devloper Internship Challenge. It fully meets the base requirements of the challenge plus the bonus shopping cart implementation.

### Getting Started

1. [Install MongoDB v3.6.x](https://docs.mongodb.com/manual/installation/)
2. [Install Node.js v8 or higher](https://nodejs.org/en/download/)
3. Clone this repo ```git clone https://github.com/djoksimo/ShopifyDeveloperChallenge.git```
4. Create database called **marketplace**
5. ```npm install```
6. ```npm start```
7. Go to the [Postman Collection](https://documenter.getpostman.com/view/5913563/RznHJHc4) to interact with the API or import  ```Shopify2019Challenge.postman_collection.json``` into Postman

### Folder Structure
```
  ├── src                  
      ├── managers     # business logic                  
      ├── models       # Cart and Product schemas                  
      ├── services     # mongodb operations and data logic            
      ├── routes       # route structure
      ├── index.js     # Main file which integrates middlewares and handlers
      ├── package.json # npm package configuration
      └── .gitignore 
  ├── Shopify2019Challenge.postman_collection.json
  └── README.md
```
