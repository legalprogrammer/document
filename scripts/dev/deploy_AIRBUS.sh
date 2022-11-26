#!/bin/bash
#*******************************************************************************
#   DEPLOY SCRIPT
#
#   Creates a zip file containing only those files necessary for Pathfinder to
#   run in its production environment
#
#   Contributors: Chetan Sahai, James Gregory
#*******************************************************************************
LG='\033[1;32m'
RD='\033[0;31m'
NC='\033[0m'

$PATHFINDER_HOME/scripts/dev/clean.sh

echo
echo -e "${LG}Rebuilding${NC}"

cd $PATHFINDER_HOME/webapp
./jake.sh
if [ $? -ne 0 ]; then
    echo
    echo -e "${RD}ERROR: BUILD FAILURE${NC}"
    echo
    exit 1
fi
echo
echo -e "${LG}Switching to production context${NC}"
rm -rf node_modules
npm install --production

cd $PATHFINDER_HOME/files/JDBC
gradle build
if [ $? -ne 0 ]; then
    echo
    echo -e "${RD}ERROR: BUILD FAILURE${NC}"
    echo
    exit 1
fi
cd $PATHFINDER_HOME

filename="pathfinder-deployment-$(date +"%Y-%m-%d").tar.gz"

echo
echo -e "${LG}Creating zip file: $filename${NC}"
mkdir pathfinder
mkdir pathfinder/scripts
mkdir pathfinder/webapp
mkdir pathfinder/files
mkdir pathfinder/files/JDBC
mkdir pathfinder/files/scripts
mkdir pathfinder/solr
# mkdir pathfinder/popularity

cp -pR solr pathfinder
cp -pR pathfinder.service pathfinder
cp -pR scripts/prod pathfinder/scripts
cp -pR webapp/dist webapp/node_modules pathfinder/webapp
cp -pR files/sql pathfinder/files
cp -pR files/doctypes.json pathfinder/files
cp -pR files/JDBC/src pathfinder/files/JDBC
cp -pR files/JDBC/build/libs/MSSQLDatabaseConnector.jar pathfinder/files/JDBC
cp -pR files/scripts/*.py files/scripts/create-filestore.js pathfinder/files/scripts
# cp -pR popularity pathfinder/popularity
# rm pathfinder/popularity/.env

tar -zcf $filename pathfinder/

rm -rf pathfinder

echo
echo -e "${LG}DONE${NC}"
echo
