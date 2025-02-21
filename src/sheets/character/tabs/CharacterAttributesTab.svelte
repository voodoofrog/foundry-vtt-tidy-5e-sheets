<script lang="ts">
  import type { CharacterSheetContext } from 'src/types/types';
  import SkillsList from '../../actor/SkillsList.svelte';
  import Traits from '../../actor/Traits.svelte';
  import Favorites from '../parts/Favorites.svelte';
  import Resources from '../parts/Resources.svelte';
  import { isNil } from 'src/utils/data';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import { settingStore } from 'src/settings/settings';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';

  let context = getContext<Readable<CharacterSheetContext>>('context');

  $: showResources =
    $context.unlocked ||
    $context.resources.some(
      (x: any) => !isNil(x.value) || !isNil(x.value, '') || !isNil(x.max),
    );
</script>

<div class="scroll-container">
  <div class="attributes-tab-contents">
    <section class="side-panel">
      <SkillsList
        actor={$context.actor}
        toggleable={$settingStore.toggleEmptyCharacterSkills}
        expanded={!!FoundryAdapter.tryGetFlag($context.actor, 'skillsExpanded')}
        toggleField="flags.{CONSTANTS.MODULE_ID}.skillsExpanded"
      />
      {#if !$settingStore.moveTraitsBelowCharacterResources}
        <Traits toggleable={$settingStore.toggleEmptyCharacterTraits} />
      {/if}
    </section>
    <section class="main-panel">
      {#if showResources}
        <Resources />
      {/if}
      {#if $settingStore.moveTraitsBelowCharacterResources}
        <Traits toggleable={$settingStore.toggleEmptyCharacterTraits} />
      {/if}
      <Favorites />
    </section>
  </div>
</div>

<style lang="scss">
  .attributes-tab-contents {
    display: flex;
    flex-direction: row;
    gap: 1.5rem;
  }

  .side-panel {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 15rem;
  }

  .main-panel {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
    padding: 0;
    height: auto;
    overflow-x: auto;
  }
</style>
