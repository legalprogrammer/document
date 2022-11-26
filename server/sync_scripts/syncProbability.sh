#!/bin/bash

#Check that an IP is given
if [ $# -eq 0 ]
  then
    printf "No arguments supplied\n"
		exit
fi

##############################################################################
# 1st SCP
##############################################################################
#Get directory list of shard/replica folders

dir_list=$(sshpass -p "indexmeprod" ssh svc_zook@<<IP1>> ls $SOLR_HOME | grep pathfinder.*)

#SCP popularity file to each one
for dir in $dir_list; do
	sshpass -p "indexmeprod" scp $1 svc_zook@<<IP1>>:$SOLR_HOME/$dir/data
done
##############################################################################
# 2nd SCP
##############################################################################
#Get directory list of shard/replica folders
dir_list=$(sshpass -p "indexmeprod" ssh svc_zook@<<IP2>> ls $SOLR_HOME | grep pathfinder.*)

#SCP popularity file to each one
for dir in $dir_list; do
	sshpass -p "indexmeprod" scp $1 svc_zook@<<IP2>>:$SOLR_HOME/$dir/data
done

##############################################################################
# Updating locally
##############################################################################
#Get directory list of local shard/replica folders
dir_list=$(ls $SOLR_HOME | grep pathfinder.*)

#Copy popularity file to each one
for dir in $dir_list; do
  echo $dir
  rsync $1 $SOLR_HOME/$dir/data
done
