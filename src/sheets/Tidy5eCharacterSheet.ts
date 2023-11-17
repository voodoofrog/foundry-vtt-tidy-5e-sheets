import { FoundryAdapter } from '../foundry/foundry-adapter';
import CharacterSheet from './character/CharacterSheet.svelte';
import { debug, error } from 'src/utils/logging';
import { SettingsProvider, settingStore } from 'src/settings/settings';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import { CONSTANTS } from 'src/constants';
import { get, writable } from 'svelte/store';
import {
  type ItemCardStore,
  type CharacterSheetContext,
  type SheetStats,
  type Actor5e,
  type SheetTabCacheable,
  type SheetExpandedItemsCacheable,
  type SearchFilterCacheable,
  type LocationToSearchTextMap,
  type ExpandedItemIdToLocationsMap,
  type ExpandedItemData,
} from 'src/types/types';
import { applyTitleToWindow } from 'src/utils/applications';
import type { SvelteComponent } from 'svelte';
import { getPercentage } from 'src/utils/numbers';
import type { ItemChatData } from 'src/types/item';

export class Tidy5eCharacterSheet
  extends dnd5e.applications.actor.ActorSheet5eCharacter
  implements
    SheetTabCacheable,
    SheetExpandedItemsCacheable,
    SearchFilterCacheable
{
  context = writable<CharacterSheetContext>();
  stats = writable<SheetStats>({
    lastSubmissionTime: null,
  });
  card = writable<ItemCardStore>();
  currentTabId: string;
  searchFilters: LocationToSearchTextMap = new Map<string, string>();
  expandedItems: ExpandedItemIdToLocationsMap = new Map<string, Set<string>>();
  expandedItemData: ExpandedItemData = new Map<string, ItemChatData>();

  constructor(...args: any[]) {
    super(...args);

    settingStore.subscribe(() => {
      this.getContext().then((context) => this.context.set(context));
    });

    this.currentTabId =
      SettingsProvider.settings.defaultCharacterSheetTab.get();
  }

  get template() {
    return FoundryAdapter.getTemplate('empty-form-template.hbs');
  }

  static get defaultOptions() {
    return FoundryAdapter.mergeObject(super.defaultOptions, {
      classes: [
        'tidy5e-kgar',
        'sheet',
        'actor',
        CONSTANTS.SHEET_TYPE_CHARACTER,
      ],
      height: 840,
      width: SettingsProvider.settings.playerSheetWidth.get(),
      scrollY: ['[data-tidy-track-scroll-y]', '.scroll-container'],
    });
  }

  component: SvelteComponent | undefined;
  activateListeners(html: { get: (index: 0) => HTMLElement }) {
    const node = html.get(0);
    this.card.set({ sheet: node, item: null, itemCardContentTemplate: null });

    this.component = new CharacterSheet({
      target: node,
      context: new Map<any, any>([
        ['context', this.context],
        ['stats', this.stats],
        ['card', this.card],
        ['currentTabId', this.currentTabId],
        ['onTabSelected', this.onTabSelected.bind(this)],
        ['onItemToggled', this.onItemToggled.bind(this)],
        ['searchFilters', new Map(this.searchFilters)],
        ['onSearch', this.onSearch.bind(this)],
        ['location', ''],
        ['expandedItems', new Map(this.expandedItems)],
        ['expandedItemData', new Map(this.expandedItemData)],
      ]),
    });

    initTidy5eContextMenu(this, html);
  }

  async getData(options = {}) {
    this.context.set(await this.getContext());
    await this.setExpandedItemData();
    return get(this.context);
  }

  private async setExpandedItemData() {
    this.expandedItemData.clear();
    for (const id of this.expandedItems.keys()) {
      const item = this.actor.items.get(id);
      if (item) {
        this.expandedItemData.set(
          id,
          await item.getChatData({ secrets: this.actor.isOwner })
        );
      }
    }
  }

  onToggleAbilityProficiency(event: Event) {
    return this._onToggleAbilityProficiency(event);
  }

  onShortRest(event: Event) {
    return this._onShortRest(event);
  }

  onLongRest(event: Event) {
    return this._onLongRest(event);
  }

  private async getContext(): Promise<CharacterSheetContext> {
    const editable = FoundryAdapter.canEditActor(this.actor) && this.isEditable;

    const defaultCharacterContext = await super.getData(this.options);

    const sections = defaultCharacterContext.features.map((section: any) => ({
      ...section,
      showLevelColumn: !section.hasActions && section.isClass,
      showRequirementsColumn: !section.isClass && !section.columns?.length,
      showSourceColumn: !section.columns?.length,
      showUsagesColumn: section.hasActions,
      showUsesColumn: section.hasActions,
    }));

    const context: CharacterSheetContext = {
      ...defaultCharacterContext,
      activateFoundryJQueryListeners: (node: HTMLElement) => {
        this._activateCoreListeners($(node));
        super.activateListeners($(node));
      },
      actorClassesToImages: getActorClassesToImages(this.actor),
      allowEffectsManagement: FoundryAdapter.allowCharacterEffectsManagement(
        this.actor
      ),
      allowMaxHpOverride:
        SettingsProvider.settings.allowHpMaxOverride.get() &&
        (!SettingsProvider.settings.lockHpMaxChanges.get() ||
          FoundryAdapter.userIsGm()),
      appearanceEnrichedHtml: await FoundryAdapter.enrichHtml(
        this.actor.system.details.appearance,
        {
          secrets: this.actor.isOwner,
          rollData: defaultCharacterContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      appId: this.appId,
      biographyEnrichedHtml: await FoundryAdapter.enrichHtml(
        this.actor.system.details.biography.value,
        {
          secrets: this.actor.isOwner,
          rollData: defaultCharacterContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      bondEnrichedHtml: await FoundryAdapter.enrichHtml(
        this.actor.system.details.bond,
        {
          secrets: this.actor.isOwner,
          rollData: defaultCharacterContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      useClassicControls:
        SettingsProvider.settings.useClassicControlsForCharacter.get(),
      useJournalTab:
        SettingsProvider.settings.useJournalTabForCharacter.get(),
      editable,
      features: sections,
      flawEnrichedHtml: await FoundryAdapter.enrichHtml(
        this.actor.system.details.flaw,
        {
          secrets: this.actor.isOwner,
          rollData: defaultCharacterContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      healthPercentage: getPercentage(
        this.actor?.system?.attributes?.hp?.value,
        this.actor?.system?.attributes?.hp?.max
      ),
      idealEnrichedHtml: await FoundryAdapter.enrichHtml(
        this.actor.system.details.ideal,
        {
          secrets: this.actor.isOwner,
          rollData: defaultCharacterContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      lockExpChanges: FoundryAdapter.shouldLockExpChanges(),
      lockHpMaxChanges: FoundryAdapter.shouldLockHpMaxChanges(),
      lockItemQuantity: FoundryAdapter.shouldLockItemQuantity(),
      lockLevelSelector: FoundryAdapter.shouldLockLevelSelector(),
      lockMoneyChanges: FoundryAdapter.shouldLockMoneyChanges(),
      lockSensitiveFields:
        !editable && SettingsProvider.settings.useTotalSheetLock.get(),
      notes1EnrichedHtml: await FoundryAdapter.enrichHtml(
        FoundryAdapter.getProperty<string>(
          this.actor,
          `flags.${CONSTANTS.MODULE_ID}.notes1.value`
        ) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultCharacterContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      notes2EnrichedHtml: await FoundryAdapter.enrichHtml(
        FoundryAdapter.getProperty<string>(
          this.actor,
          `flags.${CONSTANTS.MODULE_ID}.notes2.value`
        ) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultCharacterContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      notes3EnrichedHtml: await FoundryAdapter.enrichHtml(
        FoundryAdapter.getProperty<string>(
          this.actor,
          `flags.${CONSTANTS.MODULE_ID}.notes3.value`
        ) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultCharacterContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      notes4EnrichedHtml: await FoundryAdapter.enrichHtml(
        FoundryAdapter.getProperty<string>(
          this.actor,
          `flags.${CONSTANTS.MODULE_ID}.notes4.value`
        ) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultCharacterContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      notesEnrichedHtml: await FoundryAdapter.enrichHtml(
        FoundryAdapter.getProperty<string>(
          this.actor,
          `flags.${CONSTANTS.MODULE_ID}.notes.value`
        ) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultCharacterContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      originalContext: defaultCharacterContext,
      owner: this.actor.isOwner,
      showLimitedSheet: FoundryAdapter.showLimitedSheet(this.actor),
      traitEnrichedHtml: await FoundryAdapter.enrichHtml(
        this.actor.system.details.trait,
        {
          secrets: this.actor.isOwner,
          rollData: defaultCharacterContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      useRoundedPortraitStyle: [
        CONSTANTS.CIRCULAR_PORTRAIT_OPTION_ALL as string,
        CONSTANTS.CIRCULAR_PORTRAIT_OPTION_CHARACTER as string,
      ].includes(SettingsProvider.settings.useCircularPortraitStyle.get()),
    };

    debug('Character Sheet context data', context);

    return context;
  }

  async _onDropSingleItem(...args: any[]) {
    return super._onDropSingleItem(...args);
  }

  close(options: unknown = {}) {
    this._destroySvelteComponent();
    return super.close(options);
  }

  submit(): void {
    super.submit();
  }

  async _onSubmit(...args: any[]) {
    await super._onSubmit(...args);
    this.stats.update((stats) => {
      stats.lastSubmissionTime = new Date();
      return stats;
    });
  }

  onToggleFilter(setName: string, filterName: string) {
    const set = this._filters[setName];
    if (!set) {
      error(`Unable to find filter set for '${setName}'. Filtering failed.`);
      return;
    }
    if (set.has(filterName)) {
      set.delete(filterName);
    } else {
      set.add(filterName);
    }

    return this.render();
  }

  isFilterActive(setName: string, filterName: string): boolean {
    return this._filters[setName]?.has(filterName) === true;
  }

  render(force = false, ...args: any[]) {
    if (force) {
      this._saveScrollPositions(this.element);
      this._destroySvelteComponent();
      return super.render(force, ...args);
    }

    applyTitleToWindow(this.title, this.element.get(0));
    this.getContext().then((context) => {
      this.context.update(() => context);
    });
    return this;
  }

  _getHeaderButtons() {
    const buttons = super._getHeaderButtons();
    return FoundryAdapter.removeConfigureSettingsButtonWhenLockedForNonGm(
      buttons
    );
  }

  _destroySvelteComponent() {
    this.component?.$destroy();
    this.component = undefined;
  }

  _saveScrollPositions(html: any) {
    if (html.length && this.component) {
      const save = super._saveScrollPositions(html);
      debug('Saved scroll positions', this._scrollPositions);
      return save;
    }
  }

  /* -------------------------------------------- */
  /* SheetTabCacheable
  /* -------------------------------------------- */

  onTabSelected(tabId: string) {
    this.currentTabId = tabId;
  }

  /* -------------------------------------------- */
  /* SheetExpandedItemsCacheable
  /* -------------------------------------------- */

  onItemToggled(itemId: string, isVisible: boolean, location: string) {
    const locationSet =
      this.expandedItems.get(itemId) ??
      this.expandedItems.set(itemId, new Set<string>()).get(itemId);

    if (isVisible) {
      locationSet?.add(location);
    } else {
      locationSet?.delete(location);
    }

    debug('Item Toggled', {
      expandedItems: this.expandedItems,
    });
  }

  /* -------------------------------------------- */
  /* SearchFilterCacheable
  /* -------------------------------------------- */

  onSearch(location: string, text: string): void {
    debug('Searched', {
      location,
      text,
    });
    this.searchFilters.set(location, text);
  }
}

function getActorClassesToImages(actor: Actor5e): Record<string, string> {
  let actorClassesToImages: Record<string, string> = {};
  for (let item of actor.items) {
    if (item.type == 'class') {
      let className = item.name.toLowerCase();
      let classImg = item.img;
      actorClassesToImages[className] = classImg;
    }
  }
  return actorClassesToImages;
}