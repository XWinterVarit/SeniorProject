#!/usr/bin/env bash
rm -rf /Users/Xtameer/clientsVM/group/
mkdir -p /Users/Xtameer/clientsVM/group/1/
mkdir -p /Users/Xtameer/clientsVM/group/2/
mkdir -p /Users/Xtameer/clientsVM/group/3/
mkdir -p /Users/Xtameer/clientsVM/group/4/
mkdir -p /Users/Xtameer/clientsVM/group/5/
cp -r /Users/Xtameer/IdeaProjects/SeniorProject/ClientAppV2/ClientApp /Users/Xtameer/clientsVM/group/1/
echo "50001" > /Users/Xtameer/clientsVM/group/1/ClientApp/PORT_SET.txt

cp -r /Users/Xtameer/IdeaProjects/SeniorProject/ClientAppV2/ClientApp /Users/Xtameer/clientsVM/group/2/
echo "50002" > /Users/Xtameer/clientsVM/group/2/ClientApp/PORT_SET.txt

cp -r /Users/Xtameer/IdeaProjects/SeniorProject/ClientAppV2/ClientApp /Users/Xtameer/clientsVM/group/3/
echo "50003" > /Users/Xtameer/clientsVM/group/3/ClientApp/PORT_SET.txt

cp -r /Users/Xtameer/IdeaProjects/SeniorProject/ClientAppV2/ClientApp /Users/Xtameer/clientsVM/group/4/
echo "50004" > /Users/Xtameer/clientsVM/group/4/ClientApp/PORT_SET.txt

cp -r /Users/Xtameer/IdeaProjects/SeniorProject/ClientAppV2/ClientApp /Users/Xtameer/clientsVM/group/5/
echo "50005" > /Users/Xtameer/clientsVM/group/5/ClientApp/PORT_SET.txt
