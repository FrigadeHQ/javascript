sed -i '' "s/apps\/\*/packages\/reactv2/g" ../../package.json
sed -i '' "s/packages\/\*/packages\/js-api/g" ../../package.json
sed -i '' "s/frigade\/reactv2/frigade\/react/g" package.json
yarn install && yarn local-release
git checkout ../../package.json
git checkout ../../yarn.lock
git checkout package.json
echo 'Local build successfully released!'
