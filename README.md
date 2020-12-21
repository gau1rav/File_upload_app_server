# Sever: File_upload_app

This repository holds the server side code for File_upload_app. The server is configured to run on port 3000 and hence https://localhost:3000 can be visited to ensure
that the server is up and running.

**Note: Hit localhost:3000/user/test to verify if the server is running*

## Steps to run the server

###### Clone the repo
`git clone https://github.com/gau1rav/File_upload_app_server`

###### Move into working directory
`cd your_dir`

###### Install dependencies
`npm install`

###### Start the sever
`node server/server.js`

## End points

Post request on `localhost:3000/user/upload` to start/resume an upload

Get request on `localhost:3000/user/cancel_upload` along with the file_id in the header of request to cancel an upload

Get request on `localhost:3000/user/curr_byte` along with the file_id in the header of request to know which byte to resume from (Used for pause/resume logic)

## Creating docker image of server
Dockerfile is provided along with the server code in this repo. Users must follow the following steps to create the docker image

###### Move into the code directory
`cd your_dir`

###### Build the docker image
docker build --tag server_docker .

The above step will take some time if it is being excecuted for the first time. 

###### Running the docker image
docker run -p 9000:3000 client_docker

The server will start running on port 3000 of the container and it needs to be mapped with a free port of the machine (9000 in this case). Users are free to pick
any other free port as well. Visit http://localhost:9000{your_port} to ensure if the server is running.

**Note: Again localhost:9000/user/test can be used to verify if the server is running*
