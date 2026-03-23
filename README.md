<p align="center">
  English |
  <a href="./README_zh.md">简体中文</a> |
  <a href="./README_ja.md">日本語</a> |
  <a href="./README_de.md">Deutsch</a>
</p>

# GitHub Desktop i18n

This repository is an i18n-focused fork based on [desktop/desktop](https://github.com/desktop/desktop).

Its goals are:

- keep tracking the upstream GitHub Desktop codebase as closely as possible
- maintain additional i18n changes on top of upstream releases
- publish downloadable builds through GitHub Releases

## Relationship To Upstream

- Upstream project: [`desktop/desktop`](https://github.com/desktop/desktop)
- This project is based on upstream GitHub Desktop releases and then adds further i18n work
- The build and packaging flow stays as close as possible to the upstream project

If you want to contribute features or fixes to GitHub Desktop itself, please prefer opening issues or pull requests against the upstream repository.

## Downloads

Release page:

- [GitHub Releases](https://github.com/1985312383/desktop/releases)

Each release page provides assets like:

- `GitHub Desktop <version> checksums`
- `GitHub Desktop <version> macOS arm64`
- `GitHub Desktop <version> macOS x64`
- `GitHub Desktop <version> Windows x64 Delta Nupkg`
- `GitHub Desktop <version> Windows x64 Full Nupkg`
- `GitHub Desktop <version> Windows x64 EXE Installer`
- `GitHub Desktop <version> Windows x64 MSI Installer`

Platform notes:

- `macOS arm64`: for Apple Silicon devices such as M1, M2, and M3
- `macOS x64`: for Intel Macs
- `Windows x64 EXE Installer`: recommended for most Windows users
- `Windows x64 MSI Installer`: better suited for administrator or enterprise deployment
- `Windows x64 Full Nupkg`: full update package
- `Windows x64 Delta Nupkg`: delta update package
- `checksums`: checksums for verifying file integrity

## Version Naming

Release naming follows upstream GitHub Desktop version numbers, with extra suffixes such as:

- `3.5.6-alpha`
- `3.5.6-beta`

Meaning:

- the version number matches the upstream GitHub Desktop base version
- `-alpha` and `-beta` indicate additional i18n work on top of that upstream version

These suffixes are specific to this i18n fork and are not part of the official upstream release naming.

## Update Notice

Please note:

- some in-app links still point to the official GitHub Desktop website or upstream project
- in-app update behavior is still aligned with the official GitHub Desktop flow

If you want updates for this i18n fork, please manually visit this project's release page:

- [https://github.com/1985312383/desktop/releases](https://github.com/1985312383/desktop/releases)

## Build And Release

This project uses GitHub Actions to automatically build release assets after a GitHub Release is published, then uploads those artifacts back to the same release page.

Currently the release workflow provides:

- macOS arm64
- macOS x64
- Windows x64

## Upstream Links

- [GitHub Desktop website](https://desktop.github.com)
- [Upstream repository: desktop/desktop](https://github.com/desktop/desktop)

## License

This repository continues to follow the upstream project license:

- [MIT](LICENSE)
