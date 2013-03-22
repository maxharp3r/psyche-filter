
all: css test

css:
	lessc --line-numbers=comments --include-path=assets/less/ assets/less/style.less public/css/style.css

test:
	mocha

start-dev-server:
	npm start

watch-css:
	supervisor --no-restart-on exit --watch assets --extensions 'less' --exec /bin/sh build.sh
	
watch-tests:
	npm test


.PHONY: test
