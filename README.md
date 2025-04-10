# PVP
#Prerequisite 
Install docker;
Install dbeaver;
Install dotnet sdk 8; 

#Setup database 
In the terminal go to the backend directory and enter the command: docker-compose up -d 


In dbeaver go to database -> new database connection -> mysql -> next;
In the Main section write:
Server Host: localhost;
Port: 3306;
Database: komunalinis_db;
Username: appuser;
Password: appsecret;
Go to Driver Properties and set allowPublicKeyRetrieval to true. 
Test connection, it should show connected. 

Then go to SQL editor -> new SQL script. Copy paste the script from file: initial_schema.sql and execute sql script(alt+x). 
The go to tables and refresh 
