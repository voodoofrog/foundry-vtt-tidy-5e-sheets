export const CONSTANTS = {
  MODULE_ID: 'tidy5e-sheet-kgar',
  ITEM_TYPE_EQUIPMENT: 'equipment',
  ITEM_TYPE_BACKGROUND: 'background',
  ITEM_TYPE_BACKPACK: 'backpack',
  ITEM_TYPE_CLASS: 'class',
  ITEM_TYPE_CONSUMABLE: 'consumable',
  ITEM_TYPE_FEAT: 'feat',
  ITEM_TYPE_LOOT: 'loot',
  ITEM_TYPE_SPELL: 'spell',
  ITEM_TYPE_SUBCLASS: 'subclass',
  ITEM_TYPE_TOOL: 'tool',
  ITEM_TYPE_WEAPON: 'weapon',
  /**
   * Main button pressed, usually the left button or the un-initialized state
   */
  MOUSE_BUTTON_MAIN: 0,
  /**
   * Auxiliary button pressed, usually the wheel button or the middle button (if present)
   */
  MOUSE_BUTTON_AUXILIARY: 1,
  /**
   * Secondary button pressed, usually the right button
   */
  MOUSE_BUTTON_SECONDARY: 2,
  CONTEXT_MENU_TYPE_EFFECTS: 'effects',
  CONTEXT_MENU_TYPE_ITEMS: 'items',
  CONTEXT_MENU_TYPE_ITEM_ADVANCEMENT: 'item-advancement',
  DND5E_CLASSES: {
    artificer: 'T5EK.ClassArtificer',
    barbarian: 'T5EK.ClassBarbarian',
    bard: 'T5EK.ClassBard',
    cleric: 'T5EK.ClassCleric',
    druid: 'T5EK.ClassDruid',
    fighter: 'T5EK.ClassFighter',
    monk: 'T5EK.ClassMonk',
    paladin: 'T5EK.ClassPaladin',
    ranger: 'T5EK.ClassRanger',
    rogue: 'T5EK.ClassRogue',
    sorcerer: 'T5EK.ClassSorcerer',
    warlock: 'T5EK.ClassWarlock',
    wizard: 'T5EK.ClassWizard',
    custom: 'T5EK.ClassCustom',
  },
  HOOKS_RENDERING_CHARACTER_TABS: 'renderTidy5eKgarCharacterTabs',
  HOOKS_RENDERING_ITEM_EQUIPMENT_TABS: 'renderTidy5eKgarItemEquipmentTabs',
  HOOKS_RENDERING_ITEM_BACKGROUND_TABS: 'renderTidy5eKgarItemBackgroundTabs',
  HOOKS_RENDERING_ITEM_BACKPACK_TABS: 'renderTidy5eKgarItemBackpackTabs',
  HOOKS_RENDERING_ITEM_CLASS_TABS: 'renderTidy5eKgarItemClassTabs',
  HOOKS_RENDERING_ITEM_CONSUMABLE_TABS: 'renderTidy5eKgarItemConsumableTabs',
  HOOKS_RENDERING_ITEM_FEAT_TABS: 'renderTidy5eKgarItemFeatTabs',
  HOOKS_RENDERING_ITEM_LOOT_TABS: 'renderTidy5eKgarItemLootTabs',
  HOOKS_RENDERING_ITEM_SPELL_TABS: 'renderTidy5eKgarItemSpellTabs',
  HOOKS_RENDERING_ITEM_SUBCLASS_TABS: 'renderTidy5eKgarItemSubclassTabs',
  HOOKS_RENDERING_ITEM_TOOL_TABS: 'renderTidy5eKgarItemToolTabs',
  HOOKS_RENDERING_ITEM_WEAPON_TABS: 'renderTidy5eKgarItemWeaponTabs',
  TAB_OPTION_CLASS: 'tab-option',
  TAB_ITEM_DESCRIPTION_ID: 'description',
  TAB_ITEM_DETAILS_ID: 'details',
  TAB_ITEM_ADVANCEMENT_ID: 'advancement',
  TAB_ITEM_EFFECTS_ID: 'effects',
  TAB_ALL_ACTIONS: 'actions',
  TAB_ALL_DEFAULT: 'default',
  TAB_NPC_ABILITIES: 'attributes',
  TAB_NPC_SPELLBOOK: 'spellbook',
  TAB_NPC_EFFECTS: 'effects',
  TAB_NPC_BIOGRAPHY: 'biography',
  TAB_NPC_JOURNAL: 'journal',
  TAB_VEHICLE_ATTRIBUTES: 'attributes',
  TAB_VEHICLE_CARGO_AND_CREW: 'cargo',
  TAB_VEHICLE_EFFECTS: 'effects',
  TAB_VEHICLE_DESCRIPTION: 'biography',
  TAB_SETTINGS_PLAYERS: 'players',
  TAB_SETTINGS_NPCS: 'npcs',
  TAB_SETTINGS_VEHICLES: 'vehicles',
  TAB_SETTINGS_GM: 'gm',
  TAB_SETTINGS_MODULES: 'modules',
  TAB_SETTINGS_HOMEBREW: 'homebrew',
  TAB_SETTINGS_LOCKS: 'locks',
  TAB_SETTINGS_INFO: 'info',
  THEME_EXTENSION_WITH_DOT: '.tidy5e-theme',
  THEME_ID_DEFAULT_LIGHT: 'light',
  THEME_ID_DEFAULT_DARK: 'dark',
  THEME_ID_DEFAULT: 'default',
  SHEET_TYPE_CHARACTER: 'character',
  SHEET_TYPE_NPC: 'npc',
  SHEET_TYPE_VEHICLE: 'vehicle',
} as const;
