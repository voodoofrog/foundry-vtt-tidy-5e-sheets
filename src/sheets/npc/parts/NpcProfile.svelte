<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import DeathSaves from 'src/sheets/actor/DeathSaves.svelte';
  import ExhaustionTracker from 'src/sheets/actor/ExhaustionTracker.svelte';
  import type { NpcSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import NpcHitPoints from './NpcHitPoints.svelte';
  import TempHp from 'src/sheets/actor/TempHp.svelte';
  import NpcRest from './NpcRest.svelte';
  import NpcHealthFormula from './NpcHealthFormula.svelte';
  import ActorProfile from 'src/sheets/actor/ActorProfile.svelte';
  import { CONSTANTS } from 'src/constants';
  import { settingStore } from 'src/settings/settings';
  import ExhaustionInput from 'src/sheets/actor/ExhaustionInput.svelte';
  import { ActiveEffectsHelper } from 'src/utils/active-effect';

  let context = getContext<Readable<NpcSheetContext>>('context');

  $: incapacitated =
    ($context.actor?.system?.attributes?.hp?.value ?? 0) <= 0 &&
    $context.actor?.system?.attributes?.hp?.max !== 0;

  function onLevelSelected(event: CustomEvent<{ level: number }>) {
    FoundryAdapter.setFlag($context.actor, 'exhaustion', event.detail.level);
  }
</script>

<ActorProfile useHpOverlay={$settingStore.useHpOverlayNpc}>
  {#if incapacitated && (!$settingStore.hideDeathSavesFromPlayers || FoundryAdapter.userIsGm())}
    <DeathSaves
      successes={FoundryAdapter.tryGetFlag($context.actor, 'death.success') ??
        0}
      failures={FoundryAdapter.tryGetFlag($context.actor, 'death.failure') ?? 0}
      successesField="flags.{CONSTANTS.MODULE_ID}.death.success"
      failuresField="flags.{CONSTANTS.MODULE_ID}.death.failure"
      on:rollDeathSave={(event) =>
        $context.rollDeathSave({ event: event.detail.mouseEvent })}
      hasHpOverlay={$settingStore.useHpOverlayNpc}
    />
  {/if}
  {#if $settingStore.useExhaustion && $settingStore.exhaustionConfig.type === 'specific'}
    <ExhaustionTracker
      level={FoundryAdapter.tryGetFlag($context.actor, 'exhaustion') ?? 0}
      radiusClass={$context.useRoundedPortraitStyle ? 'rounded' : 'top-left'}
      on:levelSelected={onLevelSelected}
      exhaustionConfig={$settingStore.exhaustionConfig}
      isActiveEffectApplied={ActiveEffectsHelper.isActiveEffectAppliedToField(
        $context.actor,
        'flags.tidy5e-sheet.exhaustion',
      )}
    />
  {:else if $settingStore.useExhaustion && $settingStore.exhaustionConfig.type === 'open'}
    <ExhaustionInput
      level={FoundryAdapter.tryGetFlag($context.actor, 'exhaustion') ?? 0}
      radiusClass={$context.useRoundedPortraitStyle ? 'rounded' : 'top-left'}
      on:levelSelected={onLevelSelected}
      isActiveEffectApplied={ActiveEffectsHelper.isActiveEffectAppliedToField(
        $context.actor,
        'flags.tidy5e-sheet.exhaustion',
      )}
    />
  {/if}

  <NpcHitPoints />
  {#if $settingStore.useNpcRest}
    <NpcRest />
  {/if}
  <NpcHealthFormula />
</ActorProfile>
<TempHp />
