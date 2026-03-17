import { Menu, shell, app, BrowserWindow } from 'electron'
import { ensureItemIds } from './ensure-item-ids'
import { MenuEvent } from './menu-event'
import { truncateWithEllipsis } from '../../lib/truncate-with-ellipsis'
import { getLogDirectoryPath } from '../../lib/logging/get-log-path'
import { UNSAFE_openDirectory } from '../shell'
import { MenuLabelsEvent } from '../../models/menu-labels'
import * as ipcWebContents from '../ipc-webcontents'
import { mkdir } from 'fs/promises'
import { buildTestMenu } from './build-test-menu'
import { t } from '../../lib/i18n'

const createPullRequestLabel = __DARWIN__
  ? t('menu.branch.createPullRequest.darwin')
  : t('menu.branch.createPullRequest.other')
const showPullRequestLabel = __DARWIN__
  ? t('menu.branch.viewPullRequest.darwin')
  : t('menu.branch.viewPullRequest.other')
const defaultBranchNameValue = __DARWIN__ ? 'Default Branch' : 'default branch'
const confirmRepositoryRemovalLabel = __DARWIN__
  ? `${t('dialog.removeRepository.confirmButton')}...`
  : `${t('dialog.removeRepository.confirmButton')}(&R)...`
const repositoryRemovalLabel = __DARWIN__
  ? t('dialog.removeRepository.confirmButton')
  : `${t('dialog.removeRepository.confirmButton')}(&R)`
const confirmStashAllChangesLabel = __DARWIN__
  ? t('menu.branch.stashAllChangesConfirm.darwin')
  : t('menu.branch.stashAllChangesConfirm.other')
const stashAllChangesLabel = __DARWIN__
  ? t('menu.branch.stashAllChanges.darwin')
  : t('menu.branch.stashAllChanges.other')

enum ZoomDirection {
  Reset,
  In,
  Out,
}

export const separator: Electron.MenuItemConstructorOptions = {
  type: 'separator',
}

export function buildDefaultMenu({
  selectedExternalEditor,
  selectedShell,
  askForConfirmationOnForcePush,
  askForConfirmationOnRepositoryRemoval,
  hasCurrentPullRequest = false,
  contributionTargetDefaultBranch = defaultBranchNameValue,
  isForcePushForCurrentRepository = false,
  isStashedChangesVisible = false,
  askForConfirmationWhenStashingAllChanges = true,
  isChangesFilterVisible = true,
}: MenuLabelsEvent): Electron.Menu {
  contributionTargetDefaultBranch = truncateWithEllipsis(
    contributionTargetDefaultBranch,
    25
  )

  const removeRepoLabel = askForConfirmationOnRepositoryRemoval
    ? confirmRepositoryRemovalLabel
    : repositoryRemovalLabel

  const pullRequestLabel = hasCurrentPullRequest
    ? showPullRequestLabel
    : createPullRequestLabel

  const template = new Array<Electron.MenuItemConstructorOptions>()

  if (__DARWIN__) {
    template.push({
      label: t('menu.app.title'),
      submenu: [
        {
          label: t('menu.app.about'),
          click: emit('show-about'),
          id: 'about',
        },
        separator,
        {
          label: t('menu.app.settings'),
          id: 'preferences',
          accelerator: 'CmdOrCtrl+,',
          click: emit('show-preferences'),
        },
        separator,
        {
          label: t('menu.app.installCli'),
          id: 'install-cli',
          click: emit('install-darwin-cli'),
        },
        separator,
        {
          role: 'services',
          submenu: [],
        },
        separator,
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        separator,
        { role: 'quit' },
      ],
    })
  }

  const fileMenu: Electron.MenuItemConstructorOptions = {
    label: __DARWIN__ ? t('menu.file.darwin') : t('menu.file.other'),
    submenu: [
      {
        label: __DARWIN__
          ? t('menu.file.newRepository.darwin')
          : t('menu.file.newRepository.other'),
        id: 'new-repository',
        click: emit('create-repository'),
        accelerator: 'CmdOrCtrl+N',
      },
      separator,
      {
        label: __DARWIN__
          ? t('menu.file.addLocalRepository.darwin')
          : t('menu.file.addLocalRepository.other'),
        id: 'add-local-repository',
        accelerator: 'CmdOrCtrl+O',
        click: emit('add-local-repository'),
      },
      {
        label: __DARWIN__
          ? t('menu.file.cloneRepository.darwin')
          : t('menu.file.cloneRepository.other'),
        id: 'clone-repository',
        accelerator: 'CmdOrCtrl+Shift+O',
        click: emit('clone-repository'),
      },
    ],
  }

  if (!__DARWIN__) {
    const fileItems = fileMenu.submenu as Electron.MenuItemConstructorOptions[]
    const exitAccelerator = __WIN32__ ? 'Alt+F4' : 'CmdOrCtrl+Q'

    fileItems.push(
      separator,
      {
        label: t('menu.file.options.other'),
        id: 'preferences',
        accelerator: 'CmdOrCtrl+,',
        click: emit('show-preferences'),
      },
      separator,
      {
        role: 'quit',
        label: t('menu.file.exit.other'),
        accelerator: exitAccelerator,
      }
    )
  }

  template.push(fileMenu)

  template.push({
    label: __DARWIN__ ? t('menu.edit.darwin') : t('menu.edit.other'),
    submenu: [
      {
        role: 'undo',
        label: __DARWIN__ ? t('menu.edit.undo.darwin') : t('menu.edit.undo.other'),
      },
      {
        role: 'redo',
        label: __DARWIN__ ? t('menu.edit.redo.darwin') : t('menu.edit.redo.other'),
      },
      separator,
      {
        role: 'cut',
        label: __DARWIN__ ? t('menu.edit.cut.darwin') : t('menu.edit.cut.other'),
      },
      {
        role: 'copy',
        label: __DARWIN__ ? t('menu.edit.copy.darwin') : t('menu.edit.copy.other'),
      },
      {
        role: 'paste',
        label: __DARWIN__
          ? t('menu.edit.paste.darwin')
          : t('menu.edit.paste.other'),
      },
      {
        label: __DARWIN__
          ? t('menu.edit.selectAll.darwin')
          : t('menu.edit.selectAll.other'),
        accelerator: 'CmdOrCtrl+A',
        click: emit('select-all'),
      },
      separator,
      {
        id: 'find',
        label: __DARWIN__ ? t('menu.edit.find.darwin') : t('menu.edit.find.other'),
        accelerator: 'CmdOrCtrl+F',
        click: emit('find-text'),
      },
    ],
  })

  template.push({
    label: __DARWIN__ ? t('menu.view.darwin') : t('menu.view.other'),
    submenu: [
      {
        label: __DARWIN__
          ? t('menu.view.showChanges.darwin')
          : t('menu.view.showChanges.other'),
        id: 'show-changes',
        accelerator: 'CmdOrCtrl+1',
        click: emit('show-changes'),
      },
      {
        label: __DARWIN__
          ? t('menu.view.showHistory.darwin')
          : t('menu.view.showHistory.other'),
        id: 'show-history',
        accelerator: 'CmdOrCtrl+2',
        click: emit('show-history'),
      },
      {
        label: __DARWIN__
          ? t('menu.view.showRepositoryList.darwin')
          : t('menu.view.showRepositoryList.other'),
        id: 'show-repository-list',
        accelerator: 'CmdOrCtrl+T',
        click: emit('choose-repository'),
      },
      {
        label: __DARWIN__
          ? t('menu.view.showBranchesList.darwin')
          : t('menu.view.showBranchesList.other'),
        id: 'show-branches-list',
        accelerator: 'CmdOrCtrl+B',
        click: emit('show-branches'),
      },
      separator,
      {
        label: __DARWIN__
          ? t('menu.view.goToSummary.darwin')
          : t('menu.view.goToSummary.other'),
        id: 'go-to-commit-message',
        accelerator: 'CmdOrCtrl+G',
        click: emit('go-to-commit-message'),
      },
      {
        label: getStashedChangesLabel(isStashedChangesVisible),
        id: 'toggle-stashed-changes',
        accelerator: 'Ctrl+H',
        click: isStashedChangesVisible
          ? emit('hide-stashed-changes')
          : emit('show-stashed-changes'),
      },
      {
        label: isChangesFilterVisible
          ? __DARWIN__
            ? t('menu.view.hideChangesFilter.darwin')
            : t('menu.view.hideChangesFilter.other')
          : __DARWIN__
          ? t('menu.view.showChangesFilter.darwin')
          : t('menu.view.showChangesFilter.other'),
        id: 'toggle-changes-filter',
        accelerator: 'CmdOrCtrl+L',
        click: emit('toggle-changes-filter'),
      },
      {
        label: __DARWIN__
          ? t('menu.view.toggleFullScreen.darwin')
          : t('menu.view.toggleFullScreen.other'),
        role: 'togglefullscreen',
      },
      separator,
      {
        label: __DARWIN__
          ? t('menu.view.resetZoom.darwin')
          : t('menu.view.resetZoom.other'),
        accelerator: 'CmdOrCtrl+0',
        click: zoom(ZoomDirection.Reset),
      },
      {
        label: __DARWIN__
          ? t('menu.view.zoomIn.darwin')
          : t('menu.view.zoomIn.other'),
        accelerator: 'CmdOrCtrl+=',
        click: zoom(ZoomDirection.In),
      },
      {
        label: __DARWIN__
          ? t('menu.view.zoomOut.darwin')
          : t('menu.view.zoomOut.other'),
        accelerator: 'CmdOrCtrl+-',
        click: zoom(ZoomDirection.Out),
      },
      {
        label: __DARWIN__
          ? t('menu.view.expandActiveResizable.darwin')
          : t('menu.view.expandActiveResizable.other'),
        id: 'increase-active-resizable-width',
        accelerator: 'CmdOrCtrl+9',
        click: emit('increase-active-resizable-width'),
      },
      {
        label: __DARWIN__
          ? t('menu.view.contractActiveResizable.darwin')
          : t('menu.view.contractActiveResizable.other'),
        id: 'decrease-active-resizable-width',
        accelerator: 'CmdOrCtrl+8',
        click: emit('decrease-active-resizable-width'),
      },
      separator,
      {
        label: t('menu.view.reload.other'),
        id: 'reload-window',
        // Ctrl+Alt is interpreted as AltGr on international keyboards and this
        // can clash with other shortcuts. We should always use Ctrl+Shift for
        // chorded shortcuts, but this menu item is not a user-facing feature
        // so we are going to keep this one around.
        accelerator: 'CmdOrCtrl+Alt+R',
        click(item: any, focusedWindow: Electron.BaseWindow | undefined) {
          if (focusedWindow instanceof BrowserWindow) {
            focusedWindow.reload()
          }
        },
        visible: __RELEASE_CHANNEL__ === 'development',
      },
      {
        id: 'show-devtools',
        label: __DARWIN__
          ? t('menu.view.toggleDeveloperTools.darwin')
          : t('menu.view.toggleDeveloperTools.other'),
        accelerator: (() => {
          return __DARWIN__ ? 'Alt+Command+I' : 'Ctrl+Shift+I'
        })(),
        click(item: any, focusedWindow: Electron.BaseWindow | undefined) {
          if (focusedWindow instanceof BrowserWindow) {
            focusedWindow.webContents.toggleDevTools()
          }
        },
      },
    ],
  })

  const pushLabel = getPushLabel(
    isForcePushForCurrentRepository,
    askForConfirmationOnForcePush
  )

  const pushEventType = isForcePushForCurrentRepository ? 'force-push' : 'push'

  template.push({
    label: __DARWIN__
      ? t('menu.repository.darwin')
      : t('menu.repository.other'),
    id: 'repository',
    submenu: [
      {
        id: 'push',
        label: pushLabel,
        accelerator: 'CmdOrCtrl+P',
        click: emit(pushEventType),
      },
      {
        id: 'pull',
        label: __DARWIN__
          ? t('menu.repository.pull.darwin')
          : t('menu.repository.pull.other'),
        accelerator: 'CmdOrCtrl+Shift+P',
        click: emit('pull'),
      },
      {
        id: 'fetch',
        label: __DARWIN__
          ? t('menu.repository.fetch.darwin')
          : t('menu.repository.fetch.other'),
        accelerator: 'CmdOrCtrl+Shift+T',
        click: emit('fetch'),
      },
      {
        label: removeRepoLabel,
        id: 'remove-repository',
        accelerator: 'CmdOrCtrl+Backspace',
        click: emit('remove-repository'),
      },
      separator,
      {
        id: 'view-repository-on-github',
        label: __DARWIN__
          ? t('menu.repository.viewOnGitHub.darwin')
          : t('menu.repository.viewOnGitHub.other'),
        accelerator: 'CmdOrCtrl+Shift+G',
        click: emit('view-repository-on-github'),
      },
      {
        label: __DARWIN__
          ? t('menu.repository.openInShell.darwin', {
              name: selectedShell ?? 'Shell',
            })
          : t('menu.repository.openInShell.other', {
              name: selectedShell ?? 'shell',
            }),
        id: 'open-in-shell',
        accelerator: 'Ctrl+`',
        click: emit('open-in-shell'),
      },
      {
        label: __DARWIN__
          ? t('menu.repository.openWorkingDirectory.darwin')
          : __WIN32__
          ? t('menu.repository.openWorkingDirectory.win32')
          : t('menu.repository.openWorkingDirectory.other'),
        id: 'open-working-directory',
        accelerator: 'CmdOrCtrl+Shift+F',
        click: emit('open-working-directory'),
      },
      {
        label: __DARWIN__
          ? t('menu.repository.openExternalEditor.darwin', {
              name: selectedExternalEditor ?? 'External Editor',
            })
          : t('menu.repository.openExternalEditor.other', {
              name: selectedExternalEditor ?? 'external editor',
            }),
        id: 'open-external-editor',
        accelerator: 'CmdOrCtrl+Shift+A',
        click: emit('open-external-editor'),
      },
      {
        label: __DARWIN__
          ? t('menu.repository.openWith.darwin')
          : t('menu.repository.openWith.other'),
        id: 'open-with-external-editor',
        accelerator: 'CmdOrCtrl+Shift+Alt+A',
        click: emit('open-with-external-editor'),
      },
      separator,
      {
        id: 'create-issue-in-repository-on-github',
        label: __DARWIN__
          ? t('menu.repository.createIssue.darwin')
          : t('menu.repository.createIssue.other'),
        accelerator: 'CmdOrCtrl+I',
        click: emit('create-issue-in-repository-on-github'),
      },
      separator,
      {
        label: __DARWIN__
          ? t('menu.repository.settings.darwin')
          : t('menu.repository.settings.other'),
        id: 'show-repository-settings',
        click: emit('show-repository-settings'),
      },
    ],
  })

  const branchSubmenu = [
    {
      label: __DARWIN__
        ? t('menu.branch.newBranch.darwin')
        : t('menu.branch.newBranch.other'),
      id: 'create-branch',
      accelerator: 'CmdOrCtrl+Shift+N',
      click: emit('create-branch'),
    },
    {
      label: __DARWIN__
        ? t('menu.branch.rename.darwin')
        : t('menu.branch.rename.other'),
      id: 'rename-branch',
      accelerator: 'CmdOrCtrl+Shift+R',
      click: emit('rename-branch'),
    },
    {
      label: __DARWIN__
        ? t('menu.branch.delete.darwin')
        : t('menu.branch.delete.other'),
      id: 'delete-branch',
      accelerator: 'CmdOrCtrl+Shift+D',
      click: emit('delete-branch'),
    },
    separator,
    {
      label: __DARWIN__
        ? t('menu.branch.discardAllChanges.darwin')
        : t('menu.branch.discardAllChanges.other'),
      id: 'discard-all-changes',
      accelerator: 'CmdOrCtrl+Shift+Backspace',
      click: emit('discard-all-changes'),
    },
    {
      label: askForConfirmationWhenStashingAllChanges
        ? confirmStashAllChangesLabel
        : stashAllChangesLabel,
      id: 'stash-all-changes',
      accelerator: 'CmdOrCtrl+Shift+S',
      click: emit('stash-all-changes'),
    },
    separator,
    {
      label: __DARWIN__
        ? t('menu.branch.updateFrom.darwin', {
            branch: contributionTargetDefaultBranch,
          })
        : t('menu.branch.updateFrom.other', {
            branch: contributionTargetDefaultBranch,
          }),
      id: 'update-branch-with-contribution-target-branch',
      accelerator: 'CmdOrCtrl+Shift+U',
      click: emit('update-branch-with-contribution-target-branch'),
    },
    {
      label: __DARWIN__
        ? t('menu.branch.compareToBranch.darwin')
        : t('menu.branch.compareToBranch.other'),
      id: 'compare-to-branch',
      accelerator: 'CmdOrCtrl+Shift+B',
      click: emit('compare-to-branch'),
    },
    {
      label: __DARWIN__
        ? t('menu.branch.mergeIntoCurrent.darwin')
        : t('menu.branch.mergeIntoCurrent.other'),
      id: 'merge-branch',
      accelerator: 'CmdOrCtrl+Shift+M',
      click: emit('merge-branch'),
    },
    {
      label: __DARWIN__
        ? t('menu.branch.squashAndMergeIntoCurrent.darwin')
        : t('menu.branch.squashAndMergeIntoCurrent.other'),
      id: 'squash-and-merge-branch',
      accelerator: 'CmdOrCtrl+Shift+H',
      click: emit('squash-and-merge-branch'),
    },
    {
      label: __DARWIN__
        ? t('menu.branch.rebaseCurrent.darwin')
        : t('menu.branch.rebaseCurrent.other'),
      id: 'rebase-branch',
      accelerator: 'CmdOrCtrl+Shift+E',
      click: emit('rebase-branch'),
    },
    separator,
    {
      label: __DARWIN__
        ? t('menu.branch.compareOnGitHub.darwin')
        : t('menu.branch.compareOnGitHub.other'),
      id: 'compare-on-github',
      accelerator: 'CmdOrCtrl+Shift+C',
      click: emit('compare-on-github'),
    },
    {
      label: __DARWIN__
        ? t('menu.branch.viewBranchOnGitHub.darwin')
        : t('menu.branch.viewBranchOnGitHub.other'),
      id: 'branch-on-github',
      accelerator: 'CmdOrCtrl+Alt+B',
      click: emit('branch-on-github'),
    },
  ]

  branchSubmenu.push({
    label: __DARWIN__
      ? t('menu.branch.previewPullRequest.darwin')
      : t('menu.branch.previewPullRequest.other'),
    id: 'preview-pull-request',
    accelerator: 'CmdOrCtrl+Alt+P',
    click: emit('preview-pull-request'),
  })

  branchSubmenu.push({
    label: pullRequestLabel,
    id: 'create-pull-request',
    accelerator: 'CmdOrCtrl+R',
    click: emit('open-pull-request'),
  })

  template.push({
    label: __DARWIN__ ? t('menu.branch.darwin') : t('menu.branch.other'),
    id: 'branch',
    submenu: branchSubmenu,
  })

  if (__DARWIN__) {
    template.push({
      role: 'window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { role: 'close' },
        separator,
        { role: 'front' },
      ],
    })
  }

  const submitIssueItem: Electron.MenuItemConstructorOptions = {
    label: __DARWIN__
      ? t('menu.help.reportIssue.darwin')
      : t('menu.help.reportIssue.other'),
    click() {
      shell
        .openExternal('https://github.com/desktop/desktop/issues/new/choose')
        .catch(err => log.error('Failed opening issue creation page', err))
    },
  }

  const contactSupportItem: Electron.MenuItemConstructorOptions = {
    label: __DARWIN__
      ? t('menu.help.contactSupport.darwin')
      : t('menu.help.contactSupport.other'),
    click() {
      shell
        .openExternal(
          `https://github.com/contact?from_desktop_app=1&app_version=${app.getVersion()}`
        )
        .catch(err => log.error('Failed opening contact support page', err))
    },
  }

  const showUserGuides: Electron.MenuItemConstructorOptions = {
    label: t('menu.help.showUserGuides'),
    click() {
      shell
        .openExternal('https://docs.github.com/en/desktop')
        .catch(err => log.error('Failed opening user guides page', err))
    },
  }

  const showKeyboardShortcuts: Electron.MenuItemConstructorOptions = {
    label: __DARWIN__
      ? t('menu.help.showKeyboardShortcuts.darwin')
      : t('menu.help.showKeyboardShortcuts.other'),
    click() {
      shell
        .openExternal(
          'https://docs.github.com/en/desktop/installing-and-configuring-github-desktop/overview/keyboard-shortcuts'
        )
        .catch(err => log.error('Failed opening keyboard shortcuts page', err))
    },
  }

  const showLogsLabel = __DARWIN__
    ? t('menu.help.showLogs.darwin')
    : __WIN32__
    ? t('menu.help.showLogs.win32')
    : t('menu.help.showLogs.other')

  const showLogsItem: Electron.MenuItemConstructorOptions = {
    label: showLogsLabel,
    click() {
      const logPath = getLogDirectoryPath()
      mkdir(logPath, { recursive: true })
        .then(() => UNSAFE_openDirectory(logPath))
        .catch(err => log.error('Failed opening logs directory', err))
    },
  }

  const helpItems = [
    submitIssueItem,
    contactSupportItem,
    showUserGuides,
    showKeyboardShortcuts,
    showLogsItem,
  ]

  helpItems.push(...buildTestMenu())

  if (__DARWIN__) {
    template.push({
      role: 'help',
      submenu: helpItems,
    })
  } else {
    template.push({
      label: t('menu.help.other'),
      submenu: [
        ...helpItems,
        separator,
        {
          label: t('menu.help.about.other'),
          click: emit('show-about'),
          id: 'about',
        },
      ],
    })
  }

  ensureItemIds(template)

  return Menu.buildFromTemplate(template)
}

function getPushLabel(
  isForcePushForCurrentRepository: boolean,
  askForConfirmationOnForcePush: boolean
): string {
  if (!isForcePushForCurrentRepository) {
    return __DARWIN__
      ? t('menu.repository.push.darwin')
      : t('menu.repository.push.other')
  }

  if (askForConfirmationOnForcePush) {
    return __DARWIN__
      ? t('menu.repository.forcePushConfirm.darwin')
      : t('menu.repository.forcePushConfirm.other')
  }

  return __DARWIN__
    ? t('menu.repository.forcePush.darwin')
    : t('menu.repository.forcePush.other')
}

function getStashedChangesLabel(isStashedChangesVisible: boolean): string {
  if (isStashedChangesVisible) {
    return __DARWIN__
      ? t('menu.view.hideStashedChanges.darwin')
      : t('menu.view.hideStashedChanges.other')
  }

  return __DARWIN__
    ? t('menu.view.showStashedChanges.darwin')
    : t('menu.view.showStashedChanges.other')
}

type ClickHandler = (
  menuItem: Electron.MenuItem,
  browserWindow: Electron.BaseWindow | undefined,
  event: Electron.KeyboardEvent
) => void

/**
 * Utility function returning a Click event handler which, when invoked, emits
 * the provided menu event over IPC.
 */
export function emit(name: MenuEvent): ClickHandler {
  return (_, focusedWindow) => {
    // focusedWindow can be null if the menu item was clicked without the window
    // being in focus. A simple way to reproduce this is to click on a menu item
    // while in DevTools. Since Desktop only supports one window at a time we
    // can be fairly certain that the first BrowserWindow we find is the one we
    // want.
    const window =
      focusedWindow instanceof BrowserWindow
        ? focusedWindow
        : BrowserWindow.getAllWindows()[0]
    if (window !== undefined) {
      ipcWebContents.send(window.webContents, 'menu-event', name)
    }
  }
}

/** The zoom steps that we support, these factors must sorted */
const ZoomInFactors = [0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2]
const ZoomOutFactors = ZoomInFactors.slice().reverse()

/**
 * Returns the element in the array that's closest to the value parameter. Note
 * that this function will throw if passed an empty array.
 */
function findClosestValue(arr: Array<number>, value: number) {
  return arr.reduce((previous, current) => {
    return Math.abs(current - value) < Math.abs(previous - value)
      ? current
      : previous
  })
}

/**
 * Figure out the next zoom level for the given direction and alert the renderer
 * about a change in zoom factor if necessary.
 */
function zoom(direction: ZoomDirection): ClickHandler {
  return (menuItem, window) => {
    if (!(window instanceof BrowserWindow)) {
      return
    }

    const { webContents } = window

    if (direction === ZoomDirection.Reset) {
      webContents.zoomFactor = 1
      ipcWebContents.send(webContents, 'zoom-factor-changed', 1)
    } else {
      const rawZoom = webContents.zoomFactor
      const zoomFactors =
        direction === ZoomDirection.In ? ZoomInFactors : ZoomOutFactors

      // So the values that we get from zoomFactor property are floating point
      // precision numbers from chromium, that don't always round nicely, so
      // we'll have to do a little trick to figure out which of our supported
      // zoom factors the value is referring to.
      const currentZoom = findClosestValue(zoomFactors, rawZoom)

      const nextZoomLevel = zoomFactors.find(f =>
        direction === ZoomDirection.In ? f > currentZoom : f < currentZoom
      )

      // If we couldn't find a zoom level (likely due to manual manipulation
      // of the zoom factor in devtools) we'll just snap to the closest valid
      // factor we've got.
      const newZoom = nextZoomLevel === undefined ? currentZoom : nextZoomLevel

      webContents.zoomFactor = newZoom
      ipcWebContents.send(webContents, 'zoom-factor-changed', newZoom)
    }
  }
}
