<p align="center">
  <a href="./README.md">English</a> |
  简体中文 |
  <a href="./README_ja.md">日本語</a> |
  <a href="./README_de.md">Deutsch</a>
</p>

# GitHub Desktop i18n

这是一个基于 [desktop/desktop](https://github.com/desktop/desktop) 的 GitHub Desktop 国际化分支。

本项目的目标是：

- 尽量紧跟上游 GitHub Desktop 代码
- 在上游版本基础上维护额外的 i18n 修改
- 通过 GitHub Releases 提供可下载构建产物

## 与上游项目的关系

- 上游项目：[`desktop/desktop`](https://github.com/desktop/desktop)
- 本项目基于上游 GitHub Desktop 发布版本继续进行 i18n 调整
- 构建和打包流程尽量保持与上游一致

如果你想向 GitHub Desktop 本体贡献功能或修复，建议优先向上游仓库提交 issue 或 pull request。

## 下载

发布页面：

- [GitHub Releases](https://github.com/1985312383/desktop/releases)

每个 Release 页面会提供以下资源：

- `GitHub Desktop <version> checksums`
- `GitHub Desktop <version> macOS arm64`
- `GitHub Desktop <version> macOS x64`
- `GitHub Desktop <version> Windows x64 Delta Nupkg`
- `GitHub Desktop <version> Windows x64 Full Nupkg`
- `GitHub Desktop <version> Windows x64 EXE Installer`
- `GitHub Desktop <version> Windows x64 MSI Installer`

对应说明：

- `macOS arm64`：适用于 Apple Silicon 设备，如 M1、M2、M3
- `macOS x64`：适用于 Intel Mac
- `Windows x64 EXE Installer`：适合大多数 Windows 用户
- `Windows x64 MSI Installer`：更适合管理员或企业部署
- `Windows x64 Full Nupkg`：完整更新包
- `Windows x64 Delta Nupkg`：增量更新包
- `checksums`：用于校验文件完整性

## 版本命名

本项目的版本命名尽量与上游保持一致，但会增加后缀，例如：

- `3.5.6-alpha`
- `3.5.6-beta`

含义如下：

- 前面的版本号对应上游 GitHub Desktop 基础版本
- `-alpha`、`-beta` 表示这是基于该上游版本继续进行了 i18n 修改后的版本

这些后缀只属于本项目，不属于上游官方版本命名的一部分。

## 更新说明

请注意：

- 应用内部分链接仍然可能指向 GitHub Desktop 官方网站或上游项目
- 应用内更新逻辑仍然更接近官方 GitHub Desktop 的行为

如果你需要本项目的 i18n 更新，请手动访问本项目的 Release 页面：

- [https://github.com/1985312383/desktop/releases](https://github.com/1985312383/desktop/releases)

## 构建与发布

本项目使用 GitHub Actions 在 GitHub Release 发布后自动构建资源，并上传回当前 Release 页面。

当前提供的构建目标：

- macOS arm64
- macOS x64
- Windows x64

## 上游链接

- [GitHub Desktop 官网](https://desktop.github.com)
- [上游仓库：desktop/desktop](https://github.com/desktop/desktop)

## 许可证

本仓库继续遵循上游项目许可证：

- [MIT](LICENSE)
