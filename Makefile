.PHONY: build_alpine build_ubuntu build_terraform upload all

default: all

all: build_all upload
build_all: build_alpine build_ubuntu build_terraform

build_alpine:
	docker build --no-cache -t node-awscli:12-alpine -f docker/12/alpine/Dockerfile .
	docker tag node-awscli:12-alpine warnerbros/node-awscli:12-alpine

build_ubuntu:
	docker build --no-cache -t node-awscli:12-ubuntu -f docker/12/ubuntu/Dockerfile .
	docker tag node-awscli:12-ubuntu warnerbros/node-awscli:12-ubuntu

build_terraform:
	docker build --no-cache -t node-awscli:terraform-alpine -f docker/terraform/Dockerfile .
	docker tag node-awscli:terraform-alpine warnerbros/node-awscli:terraform-alpine

upload:
	docker login
	docker push warnerbros/node-awscli:12-alpine
	docker push warnerbros/node-awscli:12-ubuntu
	docker push warnerbros/node-awscli:terraform-alpine
