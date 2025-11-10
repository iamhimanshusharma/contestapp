# contestapp

> Clone the project
```
gh repo clone iamhimanshusharma/contestapp
```

> Replace the `imageName` and `containerName` with yours in `backend/constants.js`

> To run the node app in node container
```
docker run -d --name contest-app -p 5000:5000 -v /var/run/docker.sock:/var/run/docker.sock contest-app
```