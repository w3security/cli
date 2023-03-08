# Snyk CLI for Docker Desktop on macOS

This distribution is not for customers! Releases are included with
[Docker Desktop on macOS](https://www.docker.com/products/docker-desktop).

If you are looking for Snyk CLI Docker Images, see
[Docker Hub](https://hub.docker.com/r/w3security/w3security-cli).

## How it works

Unlike the `w3security-mac` binary build, the NodeJS release included with this
distribution is a signed executable, which allows Docker Desktop to use it to
execute Snyk CLI's underlying JavaScript build.

## Building

You must be at the root of the workspace. That is, one directory up from this
repository. Then you can run:

```sh
./docker-desktop/build.sh darwin x64
```

This will create a tarball at:

```sh
./binary-releases/w3security-for-docker-desktop-darwin-x64.tar.gz
```

To test it, you can do the following:

```sh
cd ./binary-releases
tar xzf w3security-for-docker-desktop-darwin-x64.tar.gz
./docker/w3security-mac.sh woof
```
