#! /bin/bash

set -e 

pnpm build

rm -rf ../alist/public/dist/assets
rm -rf ../alist/public/dist/images
rm -rf ../alist/public/dist/static
rm -rf ../alist/public/dist/streamer
mv dist/* ../alist/public/dist/