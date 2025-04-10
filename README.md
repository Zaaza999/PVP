# PVP
## Prerequisite
1. Install docker; 
2. Install dbeaver;
3. Install dotnet sdk 8; 

## Setup database
1. In the terminal go to the backend directory and enter the command: docker-compose up -d 


1. In dbeaver go to database -> new database connection -> mysql -> next;
     In the Main section write:
      * Server Host: localhost;
      * Port: 3306;
      * Database: komunalinis_db;
      * Username: appuser;
      * Password: appsecret;
      * Go to Driver Properties and set allowPublicKeyRetrieval to true. 
     Test connection, it should show connected. 

2. Then go to SQL editor -> new SQL script. Copy paste the script from file: initial_schema.sql and execute sql script(alt+x). 
3. Then go to tables and refresh 
