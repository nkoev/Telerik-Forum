<!-- LOGO IMAGES
<a href="https://imgbb.com/"><img src="https://i.ibb.co/FVMhT54/1dbb7cb4-1adf-4ce1-a07c-94f1600e4af0-200x2001.png" alt="1dbb7cb4-1adf-4ce1-a07c-94f1600e4af0-200x2001" border="0"></a>
<a href="https://imgbb.com/"><img src="https://i.ibb.co/Mk0qwJJ/10d5f16c-efbf-4cab-8024-5a47998b080e-200x200.png" alt="10d5f16c-efbf-4cab-8024-5a47998b080e-200x200" border="0"></a> -->

<div>
<h1><b>Telerik Forum Next</b></h1>
<h4><i>
A Telerik Academy students project on typescript, built with NestJS, TypeORM and MySQL
</i></h4>
</div>
<img align="right" border="0" src="https://i.ibb.co/Mk0qwJJ/10d5f16c-efbf-4cab-8024-5a47998b080e-200x200.png" alt="10d5f16c-efbf-4cab-8024-5a47998b080e-200x200">

<p> 
This is the backend for our Telerik Forum Next training project aiming to deliver safe and effective RESTful web service for our forum application.
It was built in a completely modular manner :
</p>

<ul>
<li>Database Module</li>
<li>Auth Module</li>
<li>Feature Modules (Users, Posts, Comments)</li>
<li>Core Module (global provider)</li>
<li>App Module (straps everything together)</li>
</ul>


<h2>Team</h2>

This project is being developed by <a href="https://gitlab.com/0ligotann">Tanya</a> and <a href="https://gitlab.com/nkoev">Nikolay</a>,
proud Bulgaria's Telerik Academy students under the guidance of our technical trainers Rosen, Stoyan and Edo and the unestimated mental support of Boyan Hadjiev.

<h2>Features</h2>

<ul>
<li>Register, login & logout users</li>
<li>CRUD operations for posts and comments</li>
<li>Like posts/comments</li>
<li>Flag inappropriate post content</li>
<li>Send friend requests and add friends</li>
<li>Keep track of users forum activity</li>
<li>Users roles with specific rights</li>
<b>Reserved @admin users only:</b>
<li>CRUD operations on any post/comment</li>
<li>Ban users and read any user activity</li>
<li>Delete users and lock posts for modification</li>
</ul>

<h2>Prerequisites</h2>

<ul>
<li>node (v12) & npm (v6)</li>
<li>git</li>
<li>MySQL</li>
</ul>

<h2>Setup</h2>
<p> To run this project follow the steps:</p>

<ol>
<li>Clone repository and install dependencies</li>

```
git clone https://gitlab.com/forum-team-1/telerik-academy-forum.git
cd telerik-academy-forum
npm install 
```

<li>Create database Schema "forumdb" with MySQL</li>
<li>Add ormconfig.json file in root directory</li>

```
{
  "migrations": [
    "src/database/migration/**/*.ts"
  ],
  "cli": {
    "entitiesDir": "src/database/entities",
    "migrationsDir": "src/database/migration"
  }
}
```

<li>Add .env file in root directory</li>

```
PORT = 3000
DB_TYPE = mysql
DB_HOST = localhost
DB_PORT = 3306
DB_USERNAME = /your MySQL username"/
DB_PASSWORD = /your MySQL password/
DB_DATABASE_NAME = forumdb
JWT_SECRET = /your secret key/
JWT_EXPIRE_TIME = 2h
```

<li>Start server</li>

```
npm run start:dev
```

<li>Run migrations to setup database</li>

```
npm typeorm -- migration:run
```

<li>Run seeds to load database with test data</li>

```
npm run seed:admin
npm run seed:data
```

<li>Ready to play with API on localhost:3000/api</li>
</ol>

<div>
<img border="0" align="right" src="https://i.ibb.co/FVMhT54/1dbb7cb4-1adf-4ce1-a07c-94f1600e4af0-200x2001.png" alt="1dbb7cb4-1adf-4ce1-a07c-94f1600e4af0-200x2001">
</div>
<br>
<br>
<br>
<br>
<br>
<br>
<br>


