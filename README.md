# Gossiper
API to comment on public spending from [Portal da Transparência](http://www.portaltransparencia.gov.br/despesas/favorecido?ordenarPor=valor&direcao=desc)

### Check out the documentation [here](https://documenter.getpostman.com/view/2558796/RzfmGSoh)

## How to run the project locally
- Install [Node.js](https://nodejs.org/)
- Run `npm -v` to make sure npm ([Node Package Manager](https://www.npmjs.com/)) was installed with Node.js
- Download the project
- Run `npm install` in the project's folder to install dependencies
- Set environment variables for MONGODB_LOGIN and MONGODB_PASSWORD
  - For testing purposes you can just use "test" and  "test123" respectively
  - Or you can setup a database at [mLab](https://mlab.com/)
    - Change the database url to match your database's in `database.js`
    - Create a database user from mLab
    - Add environment variables for the user's username and password
- Run `npm run dev` in the project's folder to start the server
- Access the server locally at `localhost:3000`
