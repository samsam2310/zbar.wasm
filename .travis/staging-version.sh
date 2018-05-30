#/bin/sh
ORG_VERSION=`npm version --no-git-tag-version patch`
NEW_VERSION="${ORG_VERSION}-rc-"`date +%Y%m%d%H%M%S`
npm version --no-git-tag-version "$NEW_VERSION"