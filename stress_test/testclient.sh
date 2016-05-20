#! /bin/bash

httpRequest() {
	curl -s http://localhost:8888 |
	grep -E 'nginx'
}

timestamp(){
	node -e 'console.log(Date.now())'
}

while [ true ];do
	START=`timestamp`
	if [ "`httpRequest`" != "" ];then
		NOW=`timestamp`
		echo $[ $NOW - $START ] >> .stats.raw
	else
		echo . >> .stats.error
	fi
	sleep 1
done
