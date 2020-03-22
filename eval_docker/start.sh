docker image build -t eval_deno:1.0 .

docker container run --publish 25564:25564 --name eval_deno bulletinboard:1.0