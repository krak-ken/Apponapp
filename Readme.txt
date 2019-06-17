COPYRIGHT: ANIKET SAHU@2019. 

Setting Up Server:
	Install postgresql
	Go to Server/db/index.js and fill in your credentials
	Open Command Prompt in Server folder and Run: npm install

Setting Up database:
	Run postgresql server by running following commands in Command Prompt: 
		1. cd "C:\Program Files\PostgreSQL\11\bin"
		2. pg_ctl start -D "C:\Program Files\PostgreSQL\11\data"
		3. psql -h localhost -p 5432 -U postgres
	Postgresql client will start, run following commands:
		1. CREATE DATABASE apponapp
		2. exit postgresql client by typing "\q" and press ENTER
	Database must have been created. Now run following commands in command prompt to setup apponapp db
		1. psql -h localhost -d apponapp -p 5432 -U postgres -a -f "C:\Users\hp\Downloads\IDS\Server\db\Queries.sql"
		2. psql -h localhost -d apponapp -p 5432 -U postgres -a -f "C:\Users\hp\Downloads\IDS\Server\db\barbers.sql"
		3. psql -h localhost -d apponapp -p 5432 -U postgres -a -f "C:\Users\hp\Downloads\IDS\Server\db\doctors.sql"
		4. psql -h localhost -d apponapp -p 5432 -U postgres -a -f "C:\Users\hp\Downloads\IDS\Server\db\drivers.sql"
		5. psql -h localhost -d apponapp -p 5432 -U postgres -a -f "C:\Users\hp\Downloads\IDS\Server\db\lawyers.sql"
		6. psql -h localhost -d apponapp -p 5432 -U postgres -a -f "C:\Users\hp\Downloads\IDS\Server\db\maids.sql"
		7. psql -h localhost -d apponapp -p 5432 -U postgres -a -f "C:\Users\hp\Downloads\IDS\Server\db\Users.sql"
	Database must have been filled with entries. Now run postgres client and type "\c apponapp" then "\d", you will be shown list of all the tables created. Now to enter timeslot for a doctor run following command in postgres client: 

	"insert into __tableNameOfDoctorsTimeSlots__(shifts) values(ARRAY['{"start" : "2:15","end" : "3:15","No.": 4,"IDS": [1, 1, 1, 1] }']::jsonb[])"; 

	REPLACE ____tableNameOfDoctorsTimeSlots____ with appropriate name of doctors timeslots table.

Running Server:
	Open Command Prompt in Server folder and Run: "node index.js"

Running app:
	Double click Homepage.html in FrontEnd Folder.


NOTE: The following commands have been written with consideration of windows commmand prompt. For linux terminal google the shit out. Try not to disturb me too much. Above statement about timeslots for doctors is perfectly valid for other professionals too.