/**
 * KuraCode Permissions Registry
 * Defines each declared manifest permission with single-purpose justification
 * matching official Chrome Web Store, Edge Add-ons, and Firefox AMO requirements.
 */

export const KURACODE_PERMISSIONS = {
  singlePurposeStatement:
    'KuraCode exists solely to capture, clean, and organize developer code snippets directly from webpages into a local, searchable developer library.',

  permissions: [
    {
      permission: 'activeTab',
      category: 'API Permission',
      justification:
        'Required to read the user-highlighted code selection and source metadata (URL, page title, surrounding header) only when the user explicitly triggers capture via shortcut or context menu.',
      dataAccessed: 'Selected text and active tab URL at invocation time only',
      transmittedRemotely: 'No (Stored locally in IndexedDB)',
    },
    {
      permission: 'contextMenus',
      category: 'API Permission',
      justification:
        'Required to provide a right-click "Save to KuraCode" action on selected webpage text.',
      dataAccessed: 'Selected context menu text',
      transmittedRemotely: 'No',
    },
    {
      permission: 'storage',
      category: 'API Permission',
      justification:
        'Required to persist user preferences (theme, preferred shortcuts, tag order) and snippet index locally on the device.',
      dataAccessed: 'Extension settings',
      transmittedRemotely: 'No',
    },
    {
      permission: 'unlimitedStorage',
      category: 'API Permission',
      justification:
        'Allows developers to build extensive multi-language code libraries without running into browser quota limits.',
      dataAccessed: 'Local snippet database',
      transmittedRemotely: 'No',
    },
  ],
};

export default KURACODE_PERMISSIONS;
