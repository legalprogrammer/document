#!/bin/bash
#*******************************************************************************
#   REBUILD SCRIPT
#
#   Configures and rebuilds the entire Pathfinder application from scratch
#
#   Contributors: Chetan Sahai
#*******************************************************************************
LG='\033[1;32m'
NC='\033[0m'

START=$(date +%s)
$PATHFINDER_HOME/scripts/dev/clean.sh && $PATHFINDER_HOME/scripts/dev/conf.sh -i && cd $PATHFINDER_HOME/webapp && ./jake.sh
if [ $? -ne 0 ]; then
    exit 1
fi

END=$(date +%s)
DIFF=$(( $END - $START ))
echo
echo -e "${LG}OVERALL BUILD TIME: $DIFF seconds${NC}"
echo
