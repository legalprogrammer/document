#!/bin/bash

pattern="$SOLR_HOME/pathfinder*"
files=( $pattern )
echo "${files[0]}"
