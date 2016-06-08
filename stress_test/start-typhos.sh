#! /bin/bash

configure () {
	sleep 3
	curl -s 'localhost:6060/add?path=*&server=127.0.0.1:8880' > /dev/null
	curl -s 'localhost:6060/add?path=*&server=127.0.0.1:8880' > /dev/null
	curl -s 'localhost:6060/add?path=*&server=127.0.0.1:8880' > /dev/null
	curl -s 'localhost:6060/add?path=mango/*&server=127.0.0.1:8880' > /dev/null
	curl -s 'localhost:6060/add?path=mango/*&server=127.0.0.1:8880' > /dev/null
	
	echo started..
}

configure &
../typhos > /dev/null
