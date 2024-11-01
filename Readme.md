# ***This is a Todo App which uses MERN stack to powerup this application!***
- It has two folders frontend and backend
- Which consist of client side code and server side code.

## **Backend**
- This is a well authenticated backend application where user can goto *'/user/Signup'* route to signup him as a user and will recieve a token and then he furter can use the token to access all the diffrent routes such as *'/user/Signin'*, *'/todo/'*, *'/todo/:id'*.
- App uses Zod for input validation for the security of the backend server.
- It uses packages like cors, dotenv, express, jsonwebtoken, mongoose, zod.
- The backend files are well structured and all the private keys such as mongoDb connection string, jwtSecret and port are in this format:
- *PORT=3000(as per ur need)*
- *MONGO_URI='You_mongo_connection_string'*
- *JWT_SECRET='Your_jwt_secret'*
- Add these above keys in your **.env** folder
- Then use *node index.js* or *nodemon index.js* to powerup the backend

## **Frontend**
