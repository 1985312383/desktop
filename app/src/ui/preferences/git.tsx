import * as React from 'react'
import { DialogContent } from '../dialog'
import { RefNameTextBox } from '../lib/ref-name-text-box'
import { Ref } from '../lib/ref'
import { LinkButton } from '../lib/link-button'
import { Account } from '../../models/account'
import { GitConfigUserForm } from '../lib/git-config-user-form'
import { TabBar } from '../tab-bar'
import { Checkbox, CheckboxValue } from '../lib/checkbox'
import { Select } from '../lib/select'
import {
  shellFriendlyNames,
  SupportedHooksEnvShell,
} from '../../lib/hooks/config'
import { t } from '../../lib/i18n'

interface IGitProps {
  readonly name: string
  readonly email: string
  readonly defaultBranch: string
  readonly isLoadingGitConfig: boolean

  readonly accounts: ReadonlyArray<Account>

  readonly onNameChanged: (name: string) => void
  readonly onEmailChanged: (email: string) => void
  readonly onDefaultBranchChanged: (defaultBranch: string) => void

  readonly onEditGlobalGitConfig: () => void

  readonly selectedTabIndex?: number
  readonly onSelectedTabIndexChanged: (index: number) => void

  readonly onEnableGitHookEnvChanged: (enableGitHookEnv: boolean) => void
  readonly onCacheGitHookEnvChanged: (cacheGitHookEnv: boolean) => void
  readonly onSelectedShellChanged: (selectedShell: string) => void

  readonly enableGitHookEnv: boolean
  readonly cacheGitHookEnv: boolean
  readonly selectedShell: string
}

const windowsShells: ReadonlyArray<SupportedHooksEnvShell> = [
  'git-bash',
  'pwsh',
  'powershell',
  'cmd',
]

export class Git extends React.Component<IGitProps> {
  private get selectedTabIndex() {
    return this.props.selectedTabIndex ?? 0
  }

  private onTabClicked = (index: number) => {
    this.props.onSelectedTabIndexChanged?.(index)
  }

  private onEnableGitHookEnvChanged = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    this.props.onEnableGitHookEnvChanged(event.currentTarget.checked)
  }

  private onCacheGitHookEnvChanged = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    this.props.onCacheGitHookEnvChanged(event.currentTarget.checked)
  }

  private onSelectedShellChanged = (
    event: React.FormEvent<HTMLSelectElement>
  ) => {
    this.props.onSelectedShellChanged(event.currentTarget.value)
  }

  private renderHooksSettings() {
    return (
      <>
        <div className="hooks-warning">
          {t('preferences.git.hooks.warning.prefix')}{' '}
          <LinkButton uri="https://github.com/desktop/desktop/issues/new/choose">
            {t('preferences.git.hooks.warning.link')}
          </LinkButton>{' '}
          {t('preferences.git.hooks.warning.suffix')}
        </div>
        <Checkbox
          label={t('preferences.git.hooks.loadEnvironment')}
          ariaDescribedBy="git-hooks-env-description"
          value={
            this.props.enableGitHookEnv ? CheckboxValue.On : CheckboxValue.Off
          }
          onChange={this.onEnableGitHookEnvChanged}
        />
        <p className="git-hooks-env-description">
          {t('preferences.git.hooks.loadEnvironmentDescription')}
        </p>

        {this.props.enableGitHookEnv && __WIN32__ && (
          <Select
            className="git-hook-shell-select"
            label={t('preferences.git.hooks.selectShell')}
            value={this.props.selectedShell}
            onChange={this.onSelectedShellChanged}
          >
            {windowsShells
              .map(s => ({ key: s, title: shellFriendlyNames[s] }))
              .map(s => (
                <option key={s.key} value={s.key}>
                  {s.title}
                </option>
              ))}
          </Select>
        )}

        {this.props.enableGitHookEnv && (
          <>
            <Checkbox
              label={t('preferences.git.hooks.cacheEnvironment')}
              ariaDescribedBy="git-hooks-cache-description"
              onChange={this.onCacheGitHookEnvChanged}
              value={
                this.props.cacheGitHookEnv
                  ? CheckboxValue.On
                  : CheckboxValue.Off
              }
            />

            <div className="git-hooks-cache-description">
              {t('preferences.git.hooks.cacheEnvironmentDescription')}
            </div>
          </>
        )}
      </>
    )
  }

  public render() {
    return (
      <DialogContent className="git-preferences">
        <TabBar
          selectedIndex={this.selectedTabIndex}
          onTabClicked={this.onTabClicked}
        >
          <span>{t('preferences.git.authorTab')}</span>
          <span>{t('preferences.git.defaultBranchTab')}</span>
          <span>
            {t('preferences.git.hooksTab')}{' '}
            <span className="beta-pill">{t('preferences.git.beta')}</span>
          </span>
        </TabBar>
        <div className="git-preferences-content">{this.renderCurrentTab()}</div>
      </DialogContent>
    )
  }

  private renderCurrentTab() {
    if (this.selectedTabIndex === 0) {
      return this.renderGitConfigAuthorInfo()
    } else if (this.selectedTabIndex === 1) {
      return this.renderDefaultBranchSetting()
    } else if (this.selectedTabIndex === 2) {
      return this.renderHooksSettings()
    }

    return null
  }

  private renderGitConfigAuthorInfo() {
    return (
      <>
        <GitConfigUserForm
          email={this.props.email}
          name={this.props.name}
          isLoadingGitConfig={this.props.isLoadingGitConfig}
          accounts={this.props.accounts}
          onEmailChanged={this.props.onEmailChanged}
          onNameChanged={this.props.onNameChanged}
        />
        {this.renderEditGlobalGitConfigInfo()}
      </>
    )
  }

  private renderDefaultBranchSetting() {
    return (
      <div className="default-branch-component">
        <h2 id="default-branch-heading">
          {t('preferences.git.defaultBranch.heading')}
        </h2>

        <RefNameTextBox
          initialValue={this.props.defaultBranch}
          onValueChange={this.props.onDefaultBranchChanged}
          ariaLabelledBy={'default-branch-heading'}
          ariaDescribedBy="default-branch-description"
          warningMessageVerb="saved"
        />

        <p id="default-branch-description" className="git-settings-description">
          {t('preferences.git.defaultBranch.description.prefix')}{' '}
          <Ref>main</Ref>
          {t('preferences.git.defaultBranch.description.middle')}{' '}
          <Ref>master</Ref>
          {t('preferences.git.defaultBranch.description.suffix')}
        </p>

        {this.renderEditGlobalGitConfigInfo()}
      </div>
    )
  }

  private renderEditGlobalGitConfigInfo() {
    return (
      <p className="git-settings-description">
        {t('preferences.git.globalConfig.prefix')}{' '}
        <LinkButton onClick={this.props.onEditGlobalGitConfig}>
          {t('preferences.git.globalConfig.link')}
        </LinkButton>
        {t('preferences.git.globalConfig.suffix')}
      </p>
    )
  }
}
