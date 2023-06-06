# Echo first arg to file and overwrite if file exists src/api/version.ts
echo "export const VERSION_NUMBER = '$1'" > ./src/api/version.ts
