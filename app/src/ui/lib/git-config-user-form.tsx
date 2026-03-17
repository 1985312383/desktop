import * as React from 'react'
import { TextBox } from './text-box'
import { Row } from './row'
import {
  Account,
  isDotComAccount,
  isEnterpriseAccount,
} from '../../models/account'
import { Select } from './select'
import { GitEmailNotFoundWarning } from './git-email-not-found-warning'
import { getStealthEmailForAccount } from '../../lib/email'
import memoizeOne from 'memoize-one'
import { t } from '../../lib/i18n'

const OtherEmailSelectValue = 'Other'

interface IGitConfigUserFormProps {
  readonly name: string
  readonly email: string
  readonly accounts: ReadonlyArray<Account>
  readonly disabled?: boolean
  readonly onNameChanged: (name: string) => void
  readonly onEmailChanged: (email: string) => void
  readonly isLoadingGitConfig: boolean
}

interface IGitConfigUserFormState {
  readonly emailIsOther: boolean
}

type AccountEmail = {
  readonly email: string
  readonly normalizedEmail: string
  readonly account: Account
}

export class GitConfigUserForm extends React.Component<
  IGitConfigUserFormProps,
  IGitConfigUserFormState
> {
  private emailInputRef = React.createRef<TextBox>()

  private getAccountEmailsFromAccounts = memoizeOne(
    (accounts: ReadonlyArray<Account>) => {
      const seenEmails = new Set<string>()
      const accountEmails = new Array<AccountEmail>()

      for (const account of accounts) {
        const verifiedEmails = account.emails
          .filter(x => x.verified)
          .map(x => x.email)

        const emails = isDotComAccount(account)
          ? [...verifiedEmails, getStealthEmailForAccount(account)]
          : verifiedEmails

        for (const email of emails) {
          const normalizedEmail = email.toLowerCase()

          if (!seenEmails.has(normalizedEmail)) {
            seenEmails.add(normalizedEmail)
            accountEmails.push({ email, normalizedEmail, account })
          }
        }
      }

      return accountEmails
    }
  )

  public constructor(props: IGitConfigUserFormProps) {
    super(props)

    this.state = {
      emailIsOther:
        !this.isValidEmail(props.email) && !props.isLoadingGitConfig,
    }
  }

  private isValidEmail = (email: string) => {
    const normalizedEmail = email.toLowerCase()
    return this.accountEmails.some(x => x.normalizedEmail === normalizedEmail)
  }

  public componentDidUpdate(
    prevProps: IGitConfigUserFormProps,
    prevState: IGitConfigUserFormState
  ) {
    const isEmailInputFocused =
      this.emailInputRef.current !== null &&
      this.emailInputRef.current.isFocused

    if (prevProps.email !== this.props.email && !isEmailInputFocused) {
      this.setState({
        emailIsOther:
          !this.isValidEmail(this.props.email) &&
          !this.props.isLoadingGitConfig,
      })
    }

    if (
      this.state.emailIsOther !== prevState.emailIsOther &&
      this.state.emailIsOther === true &&
      this.emailInputRef.current !== null
    ) {
      const emailInput = this.emailInputRef.current
      emailInput.focus()
      emailInput.selectAll()
    }
  }

  public render() {
    return (
      <div>
        <Row>
          <TextBox
            label={t('preferences.git.userForm.name')}
            value={this.props.name}
            disabled={this.props.disabled}
            onValueChanged={this.props.onNameChanged}
          />
        </Row>
        {this.renderEmailDropdown()}
        {this.renderEmailTextBox()}
        {this.state.emailIsOther ? (
          <GitEmailNotFoundWarning
            accounts={this.props.accounts}
            email={this.props.email}
          />
        ) : null}
      </div>
    )
  }

  private renderEmailDropdown() {
    if (this.accountEmails.length === 0) {
      return null
    }

    const shouldShowAccountType =
      this.props.accounts.some(isDotComAccount) &&
      this.props.accounts.some(isEnterpriseAccount)

    const accountSuffix = (account: Account) =>
      isDotComAccount(account)
        ? t('preferences.git.userForm.githubDotComSuffix')
        : t('preferences.git.userForm.githubEnterpriseSuffix')

    return (
      <Row>
        <Select
          label={t('preferences.git.userForm.email')}
          value={
            this.state.emailIsOther ? OtherEmailSelectValue : this.props.email
          }
          disabled={this.props.disabled}
          onChange={this.onEmailSelectChange}
        >
          {this.accountEmails.map(e => (
            <option key={e.email} value={e.email}>
              {e.email} {shouldShowAccountType && accountSuffix(e.account)}
            </option>
          ))}
          <option key={OtherEmailSelectValue} value={OtherEmailSelectValue}>
            {t('preferences.git.userForm.otherEmail')}
          </option>
        </Select>
      </Row>
    )
  }

  private renderEmailTextBox() {
    if (this.state.emailIsOther === false && this.accountEmails.length > 0) {
      return null
    }

    const label = this.state.emailIsOther
      ? undefined
      : t('preferences.git.userForm.email')
    const ariaLabel = label ? undefined : t('preferences.git.userForm.email')

    return (
      <Row>
        <TextBox
          ref={this.emailInputRef}
          label={label}
          type="email"
          value={this.props.email}
          disabled={this.props.disabled}
          onValueChanged={this.props.onEmailChanged}
          ariaLabel={ariaLabel}
          ariaDescribedBy="git-email-not-found-warning-for-screen-readers"
          ariaControls="git-email-not-found-warning-for-screen-readers"
        />
      </Row>
    )
  }

  private get accountEmails(): ReadonlyArray<AccountEmail> {
    return this.getAccountEmailsFromAccounts(this.props.accounts)
  }

  private onEmailSelectChange = (event: React.FormEvent<HTMLSelectElement>) => {
    const value = event.currentTarget.value
    this.setState({
      emailIsOther: value === OtherEmailSelectValue,
    })

    if (value !== OtherEmailSelectValue) {
      this.props.onEmailChanged?.(value)
    }
  }
}
