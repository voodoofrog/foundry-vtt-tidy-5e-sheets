<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { CharacterSheetContext, NpcSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import NumberInput from '../inputs/NumberInput.svelte';
  import Select from '../inputs/Select.svelte';
  import TabFooter from 'src/sheets/actor/TabFooter.svelte';
  import { MaxPreparedSpellsConfigFormApplication } from 'src/applications/max-prepared-spells-config/MaxPreparedSpellsConfigFormApplication';
  import { CONSTANTS } from 'src/constants';
  import { settingStore } from 'src/settings/settings';
  import { rollRawSpellAttack } from 'src/utils/formula';

  let context =
    getContext<Readable<CharacterSheetContext | NpcSheetContext>>('context');
  export let cssClass: string | null = null;
  export let includeAttackMod: boolean = true;
  export let includePreparedSpells: boolean = true;

  const localize = FoundryAdapter.localize;

  $: abilities = Object.entries($context.abilities).map((a: any) => ({
    abbr: a[0],
    ...a[1],
  }));
</script>

<TabFooter cssClass="{cssClass} spellbook-footer" mode="horizontal">
  <h3 class="spell-dc spell-mod flex-row extra-small-gap">
    <div class="flex-row extra-small-gap" style="align-items: baseline;">
      <div>{FoundryAdapter.localize('DND5E.AbbreviationDC')}:</div>
      <div
        class="dc-container"
        data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.SPELL_DC}
        data-tooltip="{FoundryAdapter.localize('DND5E.SpellDC')}: {$context
          .spellCalculations.dcTooltip}"
      >
        {$context.spellCalculations.dc}
      </div>

      {#if includeAttackMod}
        <span>|</span>
        <span>{FoundryAdapter.localize('TIDY5E.AttackMod')}:</span>

        {#if $context.spellCalculations.rangedMod !== $context.spellCalculations.meleeMod}
          <button
            type="button"
            on:click={(ev) => rollRawSpellAttack(ev, $context.actor, 'rsak')}
            tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
            data-tooltip="{FoundryAdapter.localize(
              'TIDY5E.RangedSpellAttackMod',
            )}: {$context.spellCalculations.rangedTooltip}"
            class="inline-transparent-button spell-attack-mod-button rollable"
          >
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            <span
              class="spell-attack-mod"
              data-tidy-mod-has-bonus={$context.spellCalculations
                .rangedHasBonus}
              data-tidy-sheet-part={CONSTANTS.SHEET_PARTS
                .RANGED_SPELL_ATTACK_MOD}
            >
              {$context.spellCalculations.rangedMod}
            </span>
          </button>
          <button
            type="button"
            on:click={(ev) => rollRawSpellAttack(ev, $context.actor, 'msak')}
            tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
            data-tooltip="{FoundryAdapter.localize(
              'TIDY5E.MeleeSpellAttackMod',
            )}: {$context.spellCalculations.meleeTooltip}"
            class="inline-transparent-button spell-attack-mod-button rollable"
          >
            <i class="fa-solid fa-hand-sparkles"></i>
            <span
              class="spell-attack-mod"
              data-tidy-mod-has-bonus={$context.spellCalculations.meleeHasBonus}
              data-tidy-sheet-part={CONSTANTS.SHEET_PARTS
                .MELEE_SPELL_ATTACK_MOD}
            >
              {$context.spellCalculations.meleeMod}
            </span>
          </button>
        {:else}
          <button
            type="button"
            on:click={(ev) => rollRawSpellAttack(ev, $context.actor)}
            tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
            data-tooltip="{FoundryAdapter.localize(
              'TIDY5E.SpellAttackMod',
            )}: {$context.spellCalculations.rangedTooltip}"
            class="inline-transparent-button spell-attack-mod-button rollable"
          >
            <span
              class="spell-attack-mod"
              data-tidy-mod-has-bonus={$context.spellCalculations
                .rangedHasBonus}
              data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.SPELL_ATTACK_MOD}
            >
              {$context.spellCalculations.rangedMod}
            </span>
          </button>
        {/if}
      {/if}
    </div>
  </h3>
  {#if includePreparedSpells}
    <button
      type="button"
      class="transparent-button secondary-footer-field highlight-on-hover"
      on:click={() =>
        new MaxPreparedSpellsConfigFormApplication($context.actor).render(true)}
      title={localize('TIDY5E.MaxPreparedSpellsConfig.ButtonTooltip')}
      disabled={!$context.editable || $context.lockSensitiveFields}
      tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
    >
      <p>{localize('TIDY5E.PreparedSpells')}</p>
      <span class="spells-prepared">{$context.preparedSpells ?? 0}</span>
      /
      <span class="spells-max-prepared"
        >{$context.maxPreparedSpellsTotal ?? 0}</span
      >
    </button>
  {/if}
  <div class="spellcasting-attribute secondary-footer-field">
    <p>{localize('DND5E.SpellAbility')}</p>
    <Select
      document={$context.actor}
      field="system.attributes.spellcasting"
      value={$context.system.attributes.spellcasting}
      disabled={!$context.editable || $context.lockSensitiveFields}
      blankValue=""
    >
      <option value="" selected={!$context.system.attributes.spellcasting}
        >{localize('DND5E.None')}</option
      >
      {#each abilities as ability}
        <option value={ability.abbr}>{ability.label}</option>
      {/each}
    </Select>
  </div>
  {#if $context.isNPC}
    <div class="spellcasting-level-container secondary-footer-field">
      <p class="truncate">{localize('DND5E.SpellcasterLevel')}</p>
      <NumberInput
        cssClass="spellcasting-level"
        document={$context.actor}
        field="system.details.spellLevel"
        value={$context.system.details.spellLevel}
        placeholder="0"
        min="0"
        step="1"
        selectOnFocus={true}
        disabled={!$context.editable || $context.lockSensitiveFields}
      />
    </div>
  {/if}
</TabFooter>

<style lang="scss">
  :global(.tidy5e-sheet .spellbook-footer) {
    min-height: 2.5rem;
  }

  .secondary-footer-field {
    flex: 0;
    display: flex;
    align-items: center;
    font-size: 0.75rem;
  }

  .spell-attack-mod-button,
  .dc-container {
    display: flex;
    align-items: center;
    gap: 0.125rem;
  }

  .spell-attack-mod-button {
    font-family: var(--t5e-title-font-family);
    font-weight: 700;
  }

  .spell-attack-mod-button i {
    font-size: 1rem;
  }

  h3 {
    font-size: 1.25rem;
    font-family: var(--t5e-title-font-family);
  }

  p {
    font-weight: 700;
    margin: 0 0.25rem 0 0;
    white-space: nowrap;
  }

  .spellcasting-attribute :global(select) {
    height: 1.1875rem;
    font-size: 0.75rem;
    font-family: var(--t5e-body-font-family);
  }

  .spellcasting-level-container :global(.spellcasting-level) {
    width: 1.25rem;
    height: 1.25rem;
    flex: 0;
    text-align: center;
  }
</style>
