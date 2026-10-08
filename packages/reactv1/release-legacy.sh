
sed -i '' "s/frigade\/react/frigade\/reactv2/g" ../react/package.json
sed -i '' "s/frigade\/reactv1/frigade\/react/g" package.json
sed -i '' '/"private": true,/d' package.json
pnpm install --no-frozen-lockfile && pnpm build && npm publish --tag legacy
git checkout ../../package.json
git checkout ../react/package.json
git checkout ../../pnpm-lock.yaml
git checkout package.json
echo 'Legacy version successfully released!'
