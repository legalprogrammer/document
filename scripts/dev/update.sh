#!/bin/bash
#*******************************************************************************
#   index.sh , same as update.sh in prod environment.
#
#   Contributors: James Gregory
#*******************************************************************************

LG='\033[1;32m'
NC='\033[0m'

cd $PATHFINDER_HOME/files/scripts

echo
echo -e "${LG}Building filestore${NC}"
if [ ! -d $PATHFINDER_HOME/files/filestore ]; then
    mkdir $PATHFINDER_HOME/files/filestore
fi
npm install -s
node create-filestore.dev.js

echo
echo -e "${LG}Indexing metadata${NC}"

[ ! -f $PATHFINDER_HOME/files/metadata.in ] && echo 'No metadata found' && exit

cd $PATHFINDER_HOME/files/scripts

echo "Indexing documents"
index=$(date +%s)
echo "Index: $index"

python3 transform-metadata.py $index

cd $PATHFINDER_HOME/files

curl "http://localhost:8983/solr/pathfinder/update?literal.lastIndex=5&commit=true" --data-binary @metadata.json -H 'Content-type:application/json'
sleep 10s
curl 'http://localhost:8983/solr/pathfinder/dataimport?command=full-import&clean=false&commit=true&entity=local'
sleep 100s
curl 'http://localhost:8983/solr/pathfinder/update?commit=true' -d  '<delete><query>-title:*</query></delete>'
curl 'http://localhost:8983/solr/pathfinder/update?commit=true' -d  "<delete><query>-lastIndex:$index</query></delete>"
