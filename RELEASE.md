# Release

First tag a version and push it:

```
git tag v0.1.2
git push origin v0.1.2
```

Once the github action has created the release artifacts then publish the snap:

```
yarn run publish
```

Even if the snap code has not changed publish so that the version in the npm registry is in sync with the downloads available on github releases.
