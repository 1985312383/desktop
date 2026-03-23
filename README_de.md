<p align="center">
  <a href="./README.md">English</a> |
  <a href="./README_zh.md">简体中文</a> |
  <a href="./README_ja.md">日本語</a> |
  Deutsch
</p>

# GitHub Desktop i18n

Dieses Repository ist ein i18n-orientierter Fork auf Basis von [desktop/desktop](https://github.com/desktop/desktop).

Ziele dieses Projekts:

- den Upstream von GitHub Desktop so eng wie möglich zu verfolgen
- zusätzliche i18n-Änderungen auf Basis der Upstream-Releases zu pflegen
- herunterladbare Builds über GitHub Releases bereitzustellen

## Beziehung zum Upstream

- Upstream-Projekt: [`desktop/desktop`](https://github.com/desktop/desktop)
- Dieses Projekt basiert auf den offiziellen GitHub-Desktop-Releases und ergänzt zusätzliche i18n-Anpassungen
- Der Build- und Packaging-Prozess bleibt so nah wie möglich am Upstream

Wenn du Funktionen oder Fehlerbehebungen für GitHub Desktop selbst beitragen möchtest, solltest du bevorzugt Issues oder Pull Requests im Upstream-Repository erstellen.

## Downloads

Release-Seite:

- [GitHub Releases](https://github.com/1985312383/desktop/releases)

Jede Release-Seite enthält Ressourcen wie:

- `GitHub Desktop <version> checksums`
- `GitHub Desktop <version> macOS arm64`
- `GitHub Desktop <version> macOS x64`
- `GitHub Desktop <version> Windows x64 Delta Nupkg`
- `GitHub Desktop <version> Windows x64 Full Nupkg`
- `GitHub Desktop <version> Windows x64 EXE Installer`
- `GitHub Desktop <version> Windows x64 MSI Installer`

Hinweise:

- `macOS arm64`: für Apple-Silicon-Geräte wie M1, M2 und M3
- `macOS x64`: für Intel-Macs
- `Windows x64 EXE Installer`: empfohlen für die meisten Windows-Nutzer
- `Windows x64 MSI Installer`: besser geeignet für Administratoren oder Unternehmensumgebungen
- `Windows x64 Full Nupkg`: vollständiges Update-Paket
- `Windows x64 Delta Nupkg`: Delta-Update-Paket
- `checksums`: Prüfsummen zur Integritätsprüfung

## Versionsschema

Die Release-Namen folgen möglichst den Upstream-Versionen von GitHub Desktop, erhalten aber zusätzliche Suffixe wie:

- `3.5.6-alpha`
- `3.5.6-beta`

Bedeutung:

- die Versionsnummer entspricht der Basisversion des Upstream-GitHub-Desktop
- `-alpha` und `-beta` bedeuten, dass auf Basis dieser Upstream-Version zusätzliche i18n-Arbeiten vorgenommen wurden

Diese Suffixe gehören nur zu diesem i18n-Fork und nicht zum offiziellen Upstream-Release-Schema.

## Hinweise zu Updates

Bitte beachte:

- einige In-App-Links verweisen weiterhin auf die offizielle GitHub-Desktop-Webseite oder das Upstream-Projekt
- auch das In-App-Update-Verhalten orientiert sich weiterhin am offiziellen GitHub Desktop

Wenn du Updates für diesen i18n-Fork möchtest, lade sie bitte manuell von der Release-Seite dieses Projekts herunter:

- [https://github.com/1985312383/desktop/releases](https://github.com/1985312383/desktop/releases)

## Build und Release

Dieses Projekt verwendet GitHub Actions, um nach der Veröffentlichung eines GitHub Releases automatisch Build-Artefakte zu erstellen und wieder an dieselbe Release-Seite anzuhängen.

Derzeit werden folgende Build-Ziele bereitgestellt:

- macOS arm64
- macOS x64
- Windows x64

## Upstream-Links

- [GitHub Desktop Webseite](https://desktop.github.com)
- [Upstream-Repository: desktop/desktop](https://github.com/desktop/desktop)

## Lizenz

Dieses Repository folgt weiterhin der Lizenz des Upstream-Projekts:

- [MIT](LICENSE)
