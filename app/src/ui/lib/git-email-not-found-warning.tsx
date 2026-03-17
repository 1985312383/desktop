import * as React from 'react'
import { Account, isDotComAccount } from '../../models/account'
import { LinkButton } from './link-button'
import { isAttributableEmailFor } from '../../lib/email'
import { Octicon } from '../octicons'
import * as octicons from '../octicons/octicons.generated'
import { AriaLiveContainer } from '../accessibility/aria-live-container'
import { t } from '../../lib/i18n'

interface IGitEmailNotFoundWarningProps {
  readonly accounts: ReadonlyArray<Account>
  readonly email: string
}

export class GitEmailNotFoundWarning extends React.Component<IGitEmailNotFoundWarningProps> {
  private buildMessage(isAttributableEmail: boolean) {
    const indicatorIcon = !isAttributableEmail ? (
      <span className="warning-icon">!</span>
    ) : (
      <span className="green-circle">
        <Octicon className="check-icon" symbol={octicons.check} />
      </span>
    )

    const learnMore = !isAttributableEmail ? (
      <LinkButton
        ariaLabel={t('preferences.git.userForm.learnMoreAria')}
        uri="https://docs.github.com/en/github/committing-changes-to-your-project/why-are-my-commits-linked-to-the-wrong-user"
      >
        {t('preferences.git.userForm.learnMore')}
      </LinkButton>
    ) : null

    return (
      <>
        {indicatorIcon}
        {this.buildScreenReaderMessage(isAttributableEmail)}
        {learnMore}
      </>
    )
  }

  private buildScreenReaderMessage(isAttributableEmail: boolean) {
    const accountDescription = this.getAccountTypeDescription()
    return isAttributableEmail
      ? t('preferences.git.userForm.commitAttribution.match', {
          accountDescription,
        })
      : t('preferences.git.userForm.commitAttribution.mismatch', {
          accountDescription,
        })
  }

  public render() {
    const { accounts, email } = this.props

    if (accounts.length === 0 || email.trim().length === 0) {
      return null
    }

    const isAttributableEmail = accounts.some(account =>
      isAttributableEmailFor(account, email)
    )

    return (
      <>
        <div className="git-email-not-found-warning">
          {this.buildMessage(isAttributableEmail)}
        </div>

        <AriaLiveContainer
          id="git-email-not-found-warning-for-screen-readers"
          trackedUserInput={this.props.email}
          message={this.buildScreenReaderMessage(isAttributableEmail)}
        />
      </>
    )
  }

  private getAccountTypeDescription() {
    if (this.props.accounts.length === 1) {
      return isDotComAccount(this.props.accounts[0])
        ? t('preferences.git.userForm.accountDescription.github')
        : t('preferences.git.userForm.accountDescription.enterprise')
    }

    return t('preferences.git.userForm.accountDescription.both')
  }
}
