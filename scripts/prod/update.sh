#!/bin/bash
#*******************************************************************************
#   update.sh - Updates the solr index, triggered by a cron job
#
#   Contributors: Chetan Sahai, James Gregory
#*******************************************************************************
set -e

echo "---------------------------"
date
echo "---------------------------"
echo "Starting full index"

export NODE_PATH="/usr/local/bin/_node/lib"
export PATHFINDER_HOME="/opt/svc_zook/applications/pathfinder"

filesdir="${PATHFINDER_HOME}/files"

echo "Retrieving data from database"
/opt/java/bin/java -jar $filesdir/JDBC/MSSQLDatabaseConnector.jar


if [ ! -d $filesdir/filestore ]; then
    mkdir $filesdir/filestore
fi

index=$(date +%s)

echo "Creating Filestore"
/opt/svc_zook/software/node/bin/node $filesdir/scripts/create-filestore.js
echo "Transforming Metadata"
/usr/local/bin/python3 $filesdir/scripts/transform-metadata.py $index

rm $filesdir/files.csv
rm $filesdir/metadata.in

echo "Indexing documents"

# Set indexing flag
curl -i -X POST -H 'Content-Type: application/json' -d '{"set": "true", "key": "LEXX_TECH"}' 'http://localhost:9000/cache/flag'

# Index files
for f in $filesdir/filestore/*
do
    curl 'localhost:8983/solr/pathfinder/update/extract?commit=false' -F "myfile=@\"$f\""
done
# Index metadata
echo "Indexing metadata..."
curl 'localhost:8983/solr/pathfinder/update?commit=false' --data-binary @$filesdir/metadata.json -H 'Content-type:application/json'

# Get rid of old documents and those without a title
echo "Deleting files without a title..."
curl 'localhost:8983/solr/pathfinder/update?commit=false' -d  '<delete><query>-title:*</query></delete>'
echo "Deleting old documents"
curl 'localhost:8983/solr/pathfinder/update?commit=true' -d  "<delete><query>-lastIndex:$index</query></delete>"

# Set indexing flag
curl -i -X POST -H 'Content-Type: application/json' -d '{"set": "false", "key": "LEXX_TECH"}' 'http://localhost:9000/cache/flag'

# Index and clear cache
curl -i -X GET -H 'Content-Type: application/json' -d '{"key": "LEXX_TECH"}' 'http://localhost:9000/cache/clear'

# Run this again, on the off chance that one of the files they downloaded during the indexing was
# deleted by the latest index
echo "Deleting files without a title..."
curl 'localhost:8983/solr/pathfinder/update?commit=true' -d  '<delete><query>-title:*</query></delete>'