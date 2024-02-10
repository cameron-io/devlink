SHELL = /bin/bash

DOCKER_MONGODB=sudo docker exec -it mongodb mongosh -u $(DATABASE_ROOT_USER) -p $(DATABASE_ROOT_PASS) --authenticationDatabase admin
DOCKER_MONGODB_USER=sudo docker exec -it mongodb mongosh -u $(DATABASE_USER) -p $(DATABASE_PASS) --authenticationDatabase $(DATABASE_NAME)

.PHONY: help
## help: shows this help message
help:
	@ echo "Usage: make [target]"
	@ sed -n 's/^##//p' ${MAKEFILE_LIST} | column -t -s ':' |  sed -e 's/^/ /'

.PHONY: setup-db
## setup-db: sets up MongoDB
setup-db:
	@ echo "Setting up MongoDB..."
	@ sudo docker-compose up -d mongodb
	@ until $(DOCKER_MONGODB) --eval 'db.getUsers()' >/dev/null 2>&1 && exit 0; do \
	  >&2 echo "MongoDB not ready, sleeping for 5 secs..."; \
	  sleep 5 ; \
	done
	@ echo "... MongoDB is up and running!"

.PHONY: mongodb-shell
## mongodb-shell: opens MongoDB console
mongodb-shell:
	@ ${DOCKER_MONGODB_USER}

.PHONY: cleanup
## cleanup: removes MongoDB and associated volumes
cleanup:
	@ sudo docker-compose down
	@ for vol in $(sudo docker volume ls -q); do \
		sudo docker volume rm $(vol); \
	done
