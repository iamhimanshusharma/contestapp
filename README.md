# contestapp

> Clone the project
```
gh repo clone iamhimanshusharma/contestapp
```
## Setup
### Backend Setup
> Install all dependencies for backend
```
cd backend
npm install
```
> Replace the `imageName` and `containerName` with yours in `/backend/constants.js`

### Frontend Setup
> Install all dependencies for frontend
```
cd frontend
npm install
```

## Run the backend
> To run the node app on local machine
```
cd backend
npm run dev
```

> To run the node app in node container
```
docker run -d --name contest-app -p 5000:5000 -v /var/run/docker.sock:/var/run/docker.sock contest-app
```

## Run the frontend
```
cd frontend
npm run dev
```