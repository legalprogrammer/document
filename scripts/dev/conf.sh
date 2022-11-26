#!/bin/bash

B='\e[0;94m';
G='\e[0;92m';
R='\e[0;91m';
NC='\e[0m';


echo -e "${B}Checking SOLR_HOME environment variable${NC}"
[ -z "$SOLR_HOME" ] && echo -e "${R}SOLR_HOME environment variable not set. Create and set it to <your solr instance>/server/solr${NC}" && exit 1;

echo -e "${B}Checking if Solr is running in cloud mode${NC}"
RESULT=$(curl -s -o /dev/null -I -w '%{http_code}' http://localhost:8983/solr/admin/collections?action=CLUSTERSTATUS)
if [ "$RESULT" -ne '200' ]; then
    echo -e "${R}Solr is not running or not in cloud mode. Please start it in cloud mode${NC}" && exit 1;
fi

echo -e "${B}Are you running this from the directory this script is in? (y/n)${NC}"
read resp
if [ "$resp" == "y"  ]
then
    echo -e "${G}   Good${NC}"
else
    echo -e "${R}   Please run this script from the directory it resides in${NC}"
    exit 0
fi

############################################
############################################
## CONFIGURATION  AND COLLECTION CREATION ##
############################################
############################################
_S1000Ddir="$(pwd)/../data/S1000D/modules"
_conf="_conf"

echo -e "${B}-----------------------------${NC}"
echo -e "${B}CONFIGURATION AND COLLECTIONS${NC}"
echo -e "${B}-----------------------------${NC}"

for _collection_name in "pathfinder"
do
    ####
    # CONFIG STUFF
    ####

    # _configStatus variable used to determine whether to upload config
    # 0 = config does not exist
    # 1 = config already exists
    _configStatus=0
    echo -e "${B}   Checking for $_collection_name config${NC}"
    curl -s 'http://localhost:8983/solr/admin/configs?action=LIST&wt=json' | grep $_collection_name\" > /dev/null
    if [ $? -eq 0 ]
    then
        _configStatus=1
    fi

    # Offer the user the option to overwrite an existing config
    if [ $_configStatus -eq 1 ]
    then
        echo -e "${G}       $_collection_name config already exists. Overwrite?${NC}"
        read resp
        if [ "$resp" == "y" ]
        then
            echo -e "${B}           Wiping $_collection_name config from Solr.${NC}"
            # Wipe the config and set _configStatus to 0
            $SOLR_HOME/../../server/scripts/cloud-scripts/zkcli.sh -zkhost 127.0.0.1:9983 -cmd clear /configs/$_collection_name
            _configStatus=0
            echo -e "${B}           Checking that $_collection_name config was wiped.${NC}"
            curl -s 'http://localhost:8983/solr/admin/configs?action=LIST&wt=json' | grep $_collection_name\" > /dev/null
            if [ $? -eq 0 ]
            then
                echo -e "${R}               Failed to wipe $_collection_name config. Exiting.${NC}"
                exit 1
            fi
            echo -e "${G}               Success. $_collection_name config wiped.${NC}"
        fi
    else
        echo -e "${B}       $_collection_name config not found.${NC}"
    fi

    if [ $_configStatus -eq 0 ]
    then
        echo -e "${B}           Uploading $_collection_name config.${NC}"

        $SOLR_HOME/../../server/scripts/cloud-scripts/zkcli.sh -zkhost 127.0.0.1:9983 -cmd upconfig -confname $_collection_name -confdir ../../solr/conf > /dev/null

        echo -e "${B}           Checking that $_collection_name config was uploaded.${NC}"
        curl -s 'http://localhost:8983/solr/admin/configs?action=LIST&wt=json' | grep $_collection_name\" > /dev/null
        if [ $? -ne 0 ]
        then
            echo -e "${R}               Failed to upload $_collection_name config. Exiting.${NC}"
            exit 1
        fi
        echo -e "${G}               Success. $_collection_name config uploaded.${NC}"

        echo -e "${B}   Checking to see if $_collection_name collection needs to be refreshed.${NC}"
        curl -s 'http://localhost:8983/solr/admin/collections?action=LIST&wt=json' | grep $_collection_name\" > /dev/null
        if [ $? -ne 0 ]
        then
            echo -e "${B}       No $_collection_name collection found.${NC}"
        else
            echo -e "${G}       Refreshing $_collection_name collection.${NC}"
            curl -s "http://localhost:8983/solr/admin/collections?action=RELOAD&name=$_collection_name"
        fi
    fi

    ####
    # COLLECTION STUFF
    ####
    echo -e "${B}   Checking for $_collection_name collection.${NC}"
    curl -s 'http://localhost:8983/solr/admin/collections?action=LIST&wt=json' | grep $_collection_name\" > /dev/null
    if [ $? -ne 0 ]
    then
        echo -e "${B}       No $_collection_name collection found: creating it.${NC}"
        curl -s "http://localhost:8983/solr/admin/collections?action=CREATE&name=$_collection_name&numShards=1&collection.configName=$_collection_name"
        echo -e "${B}           Checking that $_collection_name collection was created.${NC}"
        curl -s 'http://localhost:8983/solr/admin/collections?action=LIST&wt=json' | grep $_collection_name\" > /dev/null
        if [ $? -ne 0 ]
        then
            echo -e "${R}               Failed to create $_collection_name collection. Exiting.${NC}"
            exit 1
        fi
        echo -e "${G}               Success. $_collection_name collection created.${NC}"
    else
        echo -e "${G}       $_collection_name collection already exists${NC}"
    fi
done
