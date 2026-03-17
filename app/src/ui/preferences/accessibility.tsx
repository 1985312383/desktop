import * as React from 'react'
import { DialogContent } from '../dialog'
import { Checkbox, CheckboxValue } from '../lib/checkbox'
import { t } from '../../lib/i18n'

interface IAccessibilityPreferencesProps {
  readonly underlineLinks: boolean
  readonly onUnderlineLinksChanged: (value: boolean) => void

  readonly showDiffCheckMarks: boolean
  readonly onShowDiffCheckMarksChanged: (value: boolean) => void
}

export class Accessibility extends React.Component<
  IAccessibilityPreferencesProps,
  {}
> {
  public render() {
    return (
      <DialogContent>
        <div className="advanced-section">
          <h2>{t('preferences.accessibility.heading')}</h2>
          <Checkbox
            label={t('preferences.accessibility.underlineLinks')}
            value={
              this.props.underlineLinks ? CheckboxValue.On : CheckboxValue.Off
            }
            onChange={this.onUnderlineLinksChanged}
            ariaDescribedBy="underline-setting-description"
          />
          <p
            id="underline-setting-description"
            className="git-settings-description"
          >
            {t('preferences.accessibility.underlineDescription')}{' '}
            {this.renderExampleLink()}
          </p>

          <Checkbox
            label={t('preferences.accessibility.showDiffCheckMarks')}
            value={
              this.props.showDiffCheckMarks
                ? CheckboxValue.On
                : CheckboxValue.Off
            }
            onChange={this.onShowDiffCheckMarksChanged}
            ariaDescribedBy="diff-checkmarks-setting-description"
          />
          <p
            id="diff-checkmarks-setting-description"
            className="git-settings-description"
          >
            {t('preferences.accessibility.diffCheckMarksDescription')}
          </p>
        </div>
      </DialogContent>
    )
  }

  private renderExampleLink() {
    const style = {
      textDecoration: this.props.underlineLinks ? 'underline' : 'none',
    }

    return (
      <span className="link-button-component" style={style}>
        {t('preferences.accessibility.exampleLink')}
      </span>
    )
  }

  private onUnderlineLinksChanged = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    this.props.onUnderlineLinksChanged(event.currentTarget.checked)
  }

  private onShowDiffCheckMarksChanged = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    this.props.onShowDiffCheckMarksChanged(event.currentTarget.checked)
  }
}
