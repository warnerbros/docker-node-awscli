.PHONY: build_alpine build_ubuntu build_terraform upload all

default: all

all: build_alpine build_ubuntu build_terraform upload

build_alpine:
	sudo docker build --no-cache -t node-awscli:8-alpine -f docker/8/alpine/Dockerfile .
	sudo docker tag node-awscli:8-alpine warnerbros/node-awscli:8-alpine

build_ubuntu:
	sudo docker build --no-cache -t node-awscli:10-ubuntu -f docker/10/ubuntu/Dockerfile .
	sudo docker tag node-awscli:10-ubuntu warnerbros/node-awscli:10-ubuntu

build_terraform:
	sudo docker build --no-cache -t node-awscli:terraform-alpine -f docker/terraform/Dockerfile .
	sudo docker tag node-awscli:terraform-alpine warnerbros/node-awscli:terraform-alpine

upload:
	sudo docker login
	sudo docker push warnerbros/node-awscli:8-alpine
	sudo docker push warnerbros/node-awscli:10-ubuntu
	sudo docker push warnerbros/node-awscli:terraform-alpine
