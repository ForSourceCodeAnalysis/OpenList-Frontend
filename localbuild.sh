#! /bin/bash

set -e 

pnpm build

rm -rf ../openlist/public/dist/assets
rm -rf ../openlist/public/dist/images
rm -rf ../openlist/public/dist/static
rm -rf ../openlist/public/dist/streamer
mv dist/* ../openlist/public/dist/