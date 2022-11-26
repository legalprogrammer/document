#!/bin/bash
#*******************************************************************************
#   DEPLOY SCRIPT
#
#   Creates a zip file containing only those files necessary for Pathfinder to
#   run in its production environment
#
#   Contributors: James Gregory
#*******************************************************************************
LG='\033[1;32m'
RD='\033[0;31m'
NC='\033[0m'

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
# echo
# echo -e "${LG}Switching to production context${NC}"
# rm -rf node_modules
# npm install --production

# cd $PATHFINDER_HOME/files/JDBC
# gradle build
# if [ $? -ne 0 ]; then
#     echo
#     echo -e "${RD}ERROR: BUILD FAILURE${NC}"
#     echo
#     exit 1
# fi
# cd $PATHFINDER_HOME

# echo
# echo -e "${LG}Making copy${NC}"
# mkdir -p pathfinder
# mkdir -p pathfinder/webapp
# mkdir -p pathfinder/scripts
# mkdir -p pathfinder/files
#
# cp -pR solr pathfinder
# cp -pR webapp/dist webapp/node_modules pathfinder/webapp
# cp -pR scripts/dev pathfinder/scripts

# Add this line if you need to take files over
# cp -pR files/files.csv files/metadata.in files/doctypes.json files/scripts pathfinder/files

echo
echo -e "${LG}Changing any variables for AWS${NC}"

cd $PATHFINDER_HOME

sed -i "s/airbus_logo/lexx_logo/g" webapp/dist/client/index.html
sed -i "s/<b>PFDS<\/b> Quick Search/Lex\<sup\>X\<\/sup\> Search/g" webapp/dist/client/index.html
sed -i "s/PFDS search/search/g" webapp/dist/client/index.html
echo "#myepcdiv {display: none !important;}" >> webapp/dist/client/css/menubar.css
echo ".project {font-family: 'Roboto Slab', 'Open', "HelveticaNeue", "Helvetica Neue", Helvetica, Arial, sans-serif;}" >> webapp/dist/client/css/typography.css
sed -i "s/font-size: 20px/font-size: 22px/g" webapp/dist/client/css/header.css
sed -i "s/margin-top: 11px/margin-top: 9px/g" webapp/dist/client/css/header.css
sed -i "s/localhost/lexxtechnologies.com/g" webapp/dist/server/*.js
sed -i "s|<div id=\"footer\">|<div id=\"footer\"><form action=\"http://demo.lexxtechnologies.com\"><button type=\"submit\" class=\"button-primary button-min\" style=\"margin-top: 4px;\">Return to Demos</button></form>|" webapp/dist/client/index.html
sed -i "s/app: 'pathfinder'/app: 'pathfinder', host: 'lexxtechnologies.com'/" webapp/dist/server/logs/log-init.js


echo
echo -e "${LG}Sending archive to AWS${NC}"
scp -pr -i $LEXX_PEM webapp/dist solr webapp/package.json ec2-user@demo.lexxtechnologies.com:~/pathfinder

echo
echo -e "${LG}DONE${NC}"
echo
