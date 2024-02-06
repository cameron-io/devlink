
.PHONY: env
env:
	sudo docker run --name mongo -d mongodb/mongodb-community-server:latest

db_shell:
	sudo docker exec -it mongo mongosh
