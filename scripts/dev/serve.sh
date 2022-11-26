#!/bin/bash
#*******************************************************************************
#   SERVE SCRIPT
#
#   Configures and launches the entire Pathfinder application from scratch
#   (dev environment)
#
#   Contributors: Chetan Sahai
#*******************************************************************************
$PATHFINDER_HOME/scripts/dev/clean.sh && $PATHFINDER_HOME/scripts/dev/conf.sh -i && cd $PATHFINDER_HOME/webapp && ./jake.sh run
if [ $? -ne 0 ]; then
    exit 1
fi
cd webapp
