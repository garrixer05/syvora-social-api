
# Syvora-Social-Api


## Authors

- [@garrixer05](https://www.github.com/garrixer05)



## Pre Requisites
- #### Create .env file and create PORT variable.
- #### If you are using docker, then download the postgres image and run the following command :-

```bash
  npm run dev:db:up && npm run prisma:dev && npm run dev:db:restart
```

- #### If you are using local postgres server then create a varible named DATABASE_URL in .env and assign it to the value of your connection string.
## Run Locally

Clone the project

```bash
  git clone https://github.com/garrixer05/syvora-social-api.git
```

Go to the project directory

```bash
  cd <project dir>
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```


## Routes

- ###### GET Routes
  - /api/v1/app/viewUser
  - /api/v1/app/viewUserProfile
  - /api/v1/posts/getAllPosts

- ###### POST Routes
  - /api/v1/auth/login
  - /api/v1/auth/register
  - /api/v1/app/createUserProfile
  - /api/v1/posts/comment
  - /api/v1/posts/createPost
- ###### PUT Routes
  - /api/v1/app/updateUserProfile
  - /api/v1/posts/likeUnlikePost
  - /api/v1/posts/updatePost
- ###### DELETE Routes
  - /api/v1/posts/deletePost
  - /api/v1/posts/deleteComment

