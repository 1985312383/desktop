export const en = {
  'dialog.removeRepository.title.darwin': 'Remove Repository',
  'dialog.removeRepository.title.other': 'Remove repository',
  'dialog.removeRepository.confirmation':
    'Are you sure you want to remove the repository "{repositoryName}" from GitHub Desktop?',
  'dialog.removeRepository.description':
    'The repository will be removed from GitHub Desktop:',
  'dialog.removeRepository.moveToTrash':
    'Also move this repository to {trashName}',
  'dialog.removeRepository.confirmButton': 'Remove',
  'conflicts.summary.one': '1 conflicted file',
  'conflicts.summary.other': '{count} conflicted files',
  'conflicts.allResolved': 'All conflicts resolved',
  'conflicts.shell.openInCommandLine': 'Open in command line,',
  'conflicts.shell.resolveManually':
    'your tool of choice, or close to resolve manually.',
  'menu.file.darwin': 'File',
  'menu.file.other': '&File',
  'menu.edit.darwin': 'Edit',
  'menu.edit.other': '&Edit',
  'menu.view.darwin': 'View',
  'menu.view.other': '&View',
} as const

export type TranslationKey = keyof typeof en
export type TranslationDictionary = Record<TranslationKey, string>

export const zhCN: TranslationDictionary = {
  'dialog.removeRepository.title.darwin': '移除仓库',
  'dialog.removeRepository.title.other': '移除仓库',
  'dialog.removeRepository.confirmation':
    '你确定要将仓库“{repositoryName}”从 GitHub Desktop 中移除吗？',
  'dialog.removeRepository.description': '该仓库将从 GitHub Desktop 中移除：',
  'dialog.removeRepository.moveToTrash': '同时将该仓库移动到 {trashName}',
  'dialog.removeRepository.confirmButton': '移除',
  'conflicts.summary.one': '1 个冲突文件',
  'conflicts.summary.other': '{count} 个冲突文件',
  'conflicts.allResolved': '所有冲突已解决',
  'conflicts.shell.openInCommandLine': '在命令行中打开，',
  'conflicts.shell.resolveManually': '使用你习惯的工具，或关闭后手动解决。',
  'menu.file.darwin': '文件',
  'menu.file.other': '文件(&F)',
  'menu.edit.darwin': '编辑',
  'menu.edit.other': '编辑(&E)',
  'menu.view.darwin': '视图',
  'menu.view.other': '视图(&V)',
}
