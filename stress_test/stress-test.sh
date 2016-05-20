#! /bin/bash

timestamp(){
	node -e 'console.log(Date.now())'
}

NUMBER_OF_CLIENTS=$1;
TOTAL_REQUESTS=0
START_TIME=`timestamp`

spawn() {
	n=$1
	command=$2
	while [ $(( n -= 1 )) -ge 0 ]
	do
		$command &
	done
}

i=0
#spinner='/-\|'
#spinner='.oOo'
#spinner='.oO0Oo'
spinner='/-\|/-\|'
interval=`echo 1/${#spinner} | bc -l`

killclients() {
	CLIENTS=$(ps aux | awk '
		/awk|ps/ {next}
		/testclient.sh/ {print $2}
	')
	for x in $CLIENTS;do
		kill -9 $x &> /dev/null
	done
	echo
	echo Stress test terminated
	exit
}

sum() {
	FILENAME=$1
	awk '{s+=$1} END {print s}' $FILENAME
}

echo  > .stats.raw
echo  > .stats.error

if [ "$NUMBER_OF_CLIENTS" != "" ];then
	spawn $NUMBER_OF_CLIENTS ./testclient.sh
	
	trap killclients SIGINT
	trap killclients SIGTERM
	
	REPORT="Starting up test clients... "
	THEN=$START_TIME
	
	while [ true ];do
		i=$[ ($i+1)%${#spinner} ]
		
		if (( $i == 0 ));then
			NOW=`timestamp`
			REQUESTS=$[ `cat .stats.raw|wc -l` - 1 ]
			INTERVAL_SUM=`sum .stats.raw`
			echo > .stats.raw
			
			ERRORS=$[ `cat .stats.error|wc -l` - 1 ]
			TOTAL_REQUESTS=$[ $TOTAL_REQUESTS + $REQUESTS ]
			
			if (( $REQUESTS > 0 ));then
				INTERVAL_AVERAGE="$[ $INTERVAL_SUM / $REQUESTS ] ms"
			else
				INTERVAL_AVERAGE='n/a'
			fi
		
			RATE=$[ ( $REQUESTS * 1000 ) / ( $NOW - $THEN ) ]
			AVERAGE=$[ ( $TOTAL_REQUESTS * 1000 ) / ( $NOW - $START_TIME ) ]
			
			REPORT="Request per second: $RATE (average: $AVERAGE).\n"
			REPORT="${REPORT}Average time: ${INTERVAL_AVERAGE}.\n"
			if (( $ERRORS > 1 ));then
				REPORT="${REPORT}$ERRORS errors!"
			elif (( $ERRORS > 0 ));then
				REPORT="${REPORT}$ERRORS error!"
			else
				REPORT="${REPORT}No errors."
			fi
			echo -e $REPORT > stats.txt
			THEN=$NOW
		fi
		
		clear
		echo -e "Running Stress Test ($NUMBER_OF_CLIENTS clients)  ${spinner:$i:1}"
		echo
		echo -e $REPORT
		echo
		
		sleep $interval
	done
else
	echo 'Please specify number of clients to simulate.'
fi

