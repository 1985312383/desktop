import * as React from 'react'
import {
  ApplicationTheme,
  supportsSystemThemeChanges,
  getCurrentlyAppliedTheme,
} from '../lib/application-theme'
import { Row } from '../lib/row'
import { DialogContent } from '../dialog'
import { RadioGroup } from '../lib/radio-group'
import { Select } from '../lib/select'
import { encodePathAsUrl } from '../../lib/path'
import { tabSizeDefault } from '../../lib/stores/app-store'
import {
  LocalePreference,
  resolveLocalePreference,
  t,
} from '../../lib/i18n'

interface IAppearanceProps {
  readonly selectedTheme: ApplicationTheme
  readonly onSelectedThemeChanged: (theme: ApplicationTheme) => void
  readonly selectedTabSize: number
  readonly onSelectedTabSizeChanged: (tabSize: number) => void
  readonly selectedLocale: LocalePreference
  readonly onSelectedLocaleChanged: (locale: LocalePreference) => void
}

interface IAppearanceState {
  readonly selectedTheme: ApplicationTheme | null
  readonly selectedTabSize: number
  readonly selectedLocale: LocalePreference
}

export class Appearance extends React.Component<
  IAppearanceProps,
  IAppearanceState
> {
  public constructor(props: IAppearanceProps) {
    super(props)

    const usePropTheme =
      props.selectedTheme !== ApplicationTheme.System ||
      supportsSystemThemeChanges()

    this.state = {
      selectedTheme: usePropTheme ? props.selectedTheme : null,
      selectedTabSize: props.selectedTabSize,
      selectedLocale: props.selectedLocale,
    }

    if (!usePropTheme) {
      this.initializeSelectedTheme()
    }
  }

  public async componentDidUpdate(prevProps: IAppearanceProps) {
    if (prevProps === this.props) {
      return
    }

    const usePropTheme =
      this.props.selectedTheme !== ApplicationTheme.System ||
      supportsSystemThemeChanges()

    const selectedTheme = usePropTheme
      ? this.props.selectedTheme
      : await getCurrentlyAppliedTheme()

    const selectedTabSize = this.props.selectedTabSize
    const selectedLocale = this.props.selectedLocale

    this.setState({ selectedTheme, selectedTabSize, selectedLocale })
  }

  private initializeSelectedTheme = async () => {
    const selectedTheme = await getCurrentlyAppliedTheme()
    const selectedTabSize = this.props.selectedTabSize
    const selectedLocale = this.props.selectedLocale
    this.setState({ selectedTheme, selectedTabSize, selectedLocale })
  }

  private onSelectedThemeChanged = (theme: ApplicationTheme) => {
    this.props.onSelectedThemeChanged(theme)
  }

  private onSelectedTabSizeChanged = (
    event: React.FormEvent<HTMLSelectElement>
  ) => {
    this.props.onSelectedTabSizeChanged(parseInt(event.currentTarget.value))
  }

  private onSelectedLocaleChanged = (
    event: React.FormEvent<HTMLSelectElement>
  ) => {
    const value = event.currentTarget.value
    const selectedLocale =
      value === 'system' ? null : resolveLocalePreference(value)

    this.setState({ selectedLocale })
    this.props.onSelectedLocaleChanged(selectedLocale)
  }

  public renderThemeSwatch = (theme: ApplicationTheme) => {
    const darkThemeImage = encodePathAsUrl(__dirname, 'static/ghd_dark.svg')
    const lightThemeImage = encodePathAsUrl(__dirname, 'static/ghd_light.svg')

    switch (theme) {
      case ApplicationTheme.Light:
        return (
          <span>
            <img src={lightThemeImage} alt="" />
            <span className="theme-value-label">
              {t('preferences.appearance.theme.light')}
            </span>
          </span>
        )
      case ApplicationTheme.Dark:
        return (
          <span>
            <img src={darkThemeImage} alt="" />
            <span className="theme-value-label">
              {t('preferences.appearance.theme.dark')}
            </span>
          </span>
        )
      case ApplicationTheme.System:
        return (
          <span>
            <span className="system-theme-swatch">
              <img src={lightThemeImage} alt="" />
              <img src={lightThemeImage} alt="" />
              <img src={darkThemeImage} alt="" />
            </span>
            <span className="theme-value-label">
              {t('preferences.appearance.theme.system')}
            </span>
          </span>
        )
    }
  }

  private renderSelectedTheme() {
    const selectedTheme = this.state.selectedTheme

    if (selectedTheme == null) {
      return <Row>{t('preferences.appearance.loadingTheme')}</Row>
    }

    const themes = [
      ApplicationTheme.Light,
      ApplicationTheme.Dark,
      ...(supportsSystemThemeChanges() ? [ApplicationTheme.System] : []),
    ]

    return (
      <div className="appearance-section">
        <h2 id="theme-heading">{t('preferences.appearance.theme.heading')}</h2>

        <RadioGroup<ApplicationTheme>
          ariaLabelledBy="theme-heading"
          className="theme-selector"
          selectedKey={selectedTheme}
          radioButtonKeys={themes}
          onSelectionChanged={this.onSelectedThemeChanged}
          renderRadioButtonLabelContents={this.renderThemeSwatch}
        />
      </div>
    )
  }

  private renderSelectedTabSize() {
    const availableTabSizes: number[] = [1, 2, 3, 4, 5, 6, 8, 10, 12]

    return (
      <div className="appearance-section">
        <h2 id="diff-heading">{t('preferences.appearance.diff.heading')}</h2>

        <Select
          value={this.state.selectedTabSize.toString()}
          label={
            __DARWIN__
              ? t('preferences.appearance.tabSize.darwin')
              : t('preferences.appearance.tabSize.other')
          }
          onChange={this.onSelectedTabSizeChanged}
        >
          {availableTabSizes.map(n => (
            <option key={n} value={n}>
              {n === tabSizeDefault
                ? t('preferences.appearance.tabSize.default', { size: n })
                : n}
            </option>
          ))}
        </Select>
      </div>
    )
  }

  private renderSelectedLanguage() {
    const selectedLocale = this.state.selectedLocale ?? 'system'

    return (
      <div className="appearance-section">
        <h2 id="language-heading">
          {t('preferences.appearance.language.heading')}
        </h2>

        <Select
          value={selectedLocale}
          label={t('preferences.appearance.language.label')}
          onChange={this.onSelectedLocaleChanged}
        >
          <option value="system">
            {t('preferences.appearance.language.system')}
          </option>
          <option value="en">
            {t('preferences.appearance.language.english')}
          </option>
          <option value="zh-CN">
            {t('preferences.appearance.language.simplifiedChinese')}
          </option>
        </Select>
      </div>
    )
  }

  public render() {
    return (
      <DialogContent>
        {this.renderSelectedTheme()}
        {this.renderSelectedLanguage()}
        {this.renderSelectedTabSize()}
      </DialogContent>
    )
  }
}
