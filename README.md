## Shopify Developer Internship Challenge - Danilo Joksimovic

This project was made for the Summer 2019 Shopify Devloper Internship Challenge. It fully meets the base requirements of the challenge plus the bonus shopping cart implementation and some security features.

Deployed to a GKE cluster with load balancing service at http://35.243.220.74:3000
Go to this **[Postman Collection](https://documenter.getpostman.com/view/5913563/RznHJHc4)** to interact with the API endpoints or import  ```Shopify2019Challenge.postman_collection.json``` into Postman

### Getting Started

1. [Install Node.js v8 or higher](https://nodejs.org/en/download/)
2. Clone this repo ```git clone https://github.com/djoksimo/ShopifyDeveloperChallenge.git```
3. ```npm install```
4. ```npm start```

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

1. When a new cart is created, a JWT token is signed with the id of the newly created Cart document
2. When fetching a Cart document, the JWT token associated with the Cart document must be attached in the params along with the Cart id
3. If the JWT token is signed and valid, the Cart document corresponding to the shopper's token will be returned
4. To add a new product, the apiKey must be attached to the body
