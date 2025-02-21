<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { Tab } from 'src/types/types';
  import MiscWorldSettingsTab from './tabs/MiscWorldSettingsTab.svelte';
  import CharacterWorldSettingsTab from './tabs/CharacterWorldSettingsTab.svelte';
  import NpcWorldSettingsTab from './tabs/NpcWorldSettingsTab.svelte';
  import VehicleWorldSettingsTab from './tabs/VehicleWorldSettingsTab.svelte';
  import ExhaustionWorldSettingsTab from './tabs/ExhaustionWorldSettingsTab.svelte';
  import SheetLockWorldSettingsTab from './tabs/SheetLockWorldSettingsTab.svelte';
  import { getContext } from 'svelte';
  import type {
    WorldSettingsContextStore,
    WorldSettingsFunctions,
  } from './WorldSettings.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';

  let selectedTabId: string;
  let functions = getContext<WorldSettingsFunctions>('functions');
  let context = getContext<WorldSettingsContextStore>('context');

  let tabs: Tab[] = [
    {
      id: CONSTANTS.TAB_WORLD_SETTINGS_MISC,
      title: 'TIDY5E.WorldSettings.TabMisc.tabLabel',
      content: {
        component: MiscWorldSettingsTab,
        type: 'svelte',
      },
    },
    {
      id: CONSTANTS.TAB_WORLD_SETTINGS_CHARACTER,
      title: 'TIDY5E.WorldSettings.TabCharacter.tabLabel',
      content: {
        component: CharacterWorldSettingsTab,
        type: 'svelte',
      },
    },
    {
      id: CONSTANTS.TAB_WORLD_SETTINGS_NPC,
      title: 'TIDY5E.WorldSettings.TabNpc.tabLabel',
      content: {
        component: NpcWorldSettingsTab,
        type: 'svelte',
      },
    },
    {
      id: CONSTANTS.TAB_WORLD_SETTINGS_VEHICLE,
      title: 'TIDY5E.WorldSettings.TabVehicle.tabLabel',
      content: {
        component: VehicleWorldSettingsTab,
        type: 'svelte',
      },
    },
    {
      id: CONSTANTS.TAB_WORLD_SETTINGS_EXHAUSTION,
      title: 'TIDY5E.WorldSettings.TabExhaustion.tabLabel',
      content: {
        component: ExhaustionWorldSettingsTab,
        type: 'svelte',
      },
    },
    {
      id: CONSTANTS.TAB_WORLD_SETTINGS_SHEETLOCK,
      title: 'TIDY5E.WorldSettings.TabSheetLock.tabLabel',
      content: {
        component: SheetLockWorldSettingsTab,
        type: 'svelte',
      },
    },
  ];

  selectedTabId ??= tabs[0].id;

  let applyingChanges = false;

  async function save() {
    applyingChanges = true;

    try {
      await functions.save($context);
    } finally {
      applyingChanges = false;
    }
  }

  async function apply() {
    applyingChanges = true;

    try {
      await functions.apply($context);
    } finally {
      applyingChanges = false;
    }
  }

  const localize = FoundryAdapter.localize;
</script>

<div class="settings-form">
  <div role="presentation" class="vertical-tab-container flex-column no-gap">
    <Tabs {tabs} bind:selectedTabId orientation="vertical" />
    <div role="presentation" class="remaining-vertical-space" />
  </div>

  <TabContents {tabs} {selectedTabId} cssClass="tidy-sheet-body" />
  <div class="button-bar">
    <button
      type="button"
      class="save-changes-btn"
      on:click={save}
      disabled={applyingChanges}
    >
      <i class="fas fa-save" />
      {localize('TIDY5E.SaveChanges')}
    </button>
    <button
      type="button"
      class="apply-changes-btn"
      on:click={apply}
      disabled={applyingChanges}
    >
      <i class="fas fa-check" />
      {localize('TIDY5E.ApplyChanges')}
    </button>
  </div>
</div>

<style lang="scss">
  .settings-form {
    height: 100%;
    display: grid;
    grid-template-areas:
      'nav    body'
      'nav    buttons';
    grid-template-rows: 1fr auto;
    grid-template-columns: 15rem 1fr;
    gap: 0.5rem;

    .vertical-tab-container {
      grid-area: nav;
      margin-top: -0.5rem;
      margin-left: -0.5rem;
      margin-bottom: -0.5rem;
    }

    :global(.tidy-sheet-body) {
      grid-area: body;
      overflow-y: scroll;
      padding-top: 0.5rem;
      padding-right: 0.5rem;
      margin-right: -0.25rem;
      flex: 1;
    }

    .button-bar {
      grid-area: buttons;
    }
  }

  .button-bar {
    flex: 0;
    display: flex;
    padding-right: 0.5rem;
  }

  .remaining-vertical-space {
    margin-right: -0.0625rem;
    border-right: 0.0625rem solid var(--t5e-tab-strip-border-color);
    flex: 1;
    background-color: var(--t5e-header-background);
  }
</style>
