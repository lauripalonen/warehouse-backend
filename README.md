# Warehouse backend
Backend for a warehouse application

Running at heroku: https://warehouse-product-service.herokuapp.com/  

Reposity for frontend [here](https://github.com/lauripalonen/warehouse-frontend).  

Utilizes external [API](https://bad-api-assignment.reaktor.com) for data source. Data is then parsed and uploaded to own [MongoDB](https://www.mongodb.com/) database to offer better performance for the client.  

On client request, data is first offered from the Mongo database, and then updates are checked from the slower external API. On update, Server-sent events are utilized for pushing updated data to client.  

## Installation  
**Requirements**  
Node, MongoDB

**Clone**
Run `git clone https://github.com/lauripalonen/warehouse-backend.git` on directory of your choice.  

**npm**
Run `npm install` on project root to install dependencies.  

**MongoDB**  
Log in to your [MongoDB account](https://www.mongodb.com/cloud) or create a new one. Build a new cluster and as a connection method, choose *"Connect your Application"* and copy the connection string (begins with "mongodb+srv://...").

**Environment variables**  
Configuration file in /utils/config.js expects a .env file in backend root. Create .env to backend/ and write following variables to it:
```
MONGODB_URI=mongodb+srv://<your_credentials>@<db_address>/<collection_name>?retryWrites=true&w=majority

PORT=3001
```  
Use the copied connection string for `MONGODB_URI`. `PORT` can also be a port of your choice. **Remember to add .env file to .gitignore!** You don't want your credentials to be displayed on your repository.  


