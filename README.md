## Shopify Developer Internship Challenge - Danilo Joksimovic

This project was made for the Summer 2019 Shopify Devloper Internship Challenge. It fully meets the base requirements of the challenge plus the bonus shopping cart implementation and some security features.

Deployed to a GKE cluster at http://35.243.220.74:3000 with load balancing

### Getting Started

1. [Install Node.js v8 or higher](https://nodejs.org/en/download/)
2. Clone this repo ```git clone https://github.com/djoksimo/ShopifyDeveloperChallenge.git```
3. ```npm install```
4. ```npm start```
5. Go to the [Postman Collection](https://documenter.getpostman.com/view/5913563/RznHJHc4) to interact with the API endpoints or import  ```Shopify2019Challenge.postman_collection.json``` into Postman

### Project Structure
```
  ├── src                  
      ├── managers  # business logic methods                
      ├── models  # Cart and Product schemas                  
      ├── services  # mongodb operations and data logic methods            
      ├── routes  # express router methods
      ├── index.js  # Entry script which integrates middlewares and handlers
      ├── package.json  # npm package configuration
      ├── Dockerfile  # Docker build configuration
      ├── .dockerignore
      ├── deployment.yml # Kubernetes deployment configuration
      └── .gitignore 
  ├── Shopify2019Challenge.postman_collection.json
  └── README.md
```

### Security

1. When a new cart is created, a JWT token is signed with the id of the new Cart document
2. For all GET /cart requests, the token must be attached in the params along with the id
3. If the token is signed and valid, the cart corresponding to the shopper's token will be returned
4. To add a new product, the apiKey must be attached to the body
