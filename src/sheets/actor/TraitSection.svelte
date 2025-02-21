<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settingStore } from 'src/settings/settings';
  import type { ActorSheetContext } from 'src/types/types';
  import { ActiveEffectsHelper } from 'src/utils/active-effect';
  import { createEventDispatcher, getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  
  let context = getContext<Readable<ActorSheetContext>>('context');
  export let title: string;
  export let configureButtonTitle: string;
  export let iconCssClass: string | undefined = undefined;
  export let traitCssClass: string | undefined = '';
  export let tags: [key: string, value: string][] = [];
  export let tools: [key: string, value: any][] = [];
  export let traitsExpanded: boolean;

  const dispatcher = createEventDispatcher<{
    onConfigureClicked: MouseEvent;
  }>();

  const localize = FoundryAdapter.localize;

  $: show = traitsExpanded || tags.length > 0 || tools.length > 0;
</script>

{#if show}
  <div
    class="trait-form-group {traitCssClass ?? ''}"
    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ACTOR_TRAIT}
  >
    <span class="trait-icon" aria-label={title} {title}>
      {#if iconCssClass !== undefined}
        <i class={iconCssClass} />
      {/if}
      <slot name="custom-icon" />
    </span>
    <div class="trait-label-and-list">
      {#if $settingStore.showTraitLabels}
        <span class="trait-label">{title}</span>
      {/if}
      {#if tags.length}
        <ul class="trait-list traits">
          {#each tags as [key, value]}
            <li class="trait-tag {key}">{value}</li>
          {/each}
        </ul>
      {/if}
      {#if tools.length}
        <ul
          class="trait-list tools"
          data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.TOOLS_LIST}
        >
          {#each tools as [key, tool]}
            <li
              class="tool"
              data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.TOOL_CONTAINER}
              data-key={key}
            >
              {#if $context.editable && !$context.lockSensitiveFields}
                {@const activeEffectApplied =
                  ActiveEffectsHelper.isActiveEffectAppliedToField(
                    $context.actor,
                    `system.tools.${key}.value`,
                  )}
                <button
                  type="button"
                  class="tool-proficiency-toggle inline-transparent-button"
                  title={tool.hover}
                  on:click|stopPropagation|preventDefault={(event) =>
                    FoundryAdapter.cycleProficiency(
                      $context.actor,
                      key,
                      tool.value,
                      'tools',
                    )}
                  on:contextmenu|stopPropagation|preventDefault={(event) =>
                    FoundryAdapter.cycleProficiency(
                      $context.actor,
                      key,
                      tool.value,
                      'tools',
                      true,
                    )}
                  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS
                    .TOOL_PROFICIENCY_TOGGLE}
                  tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
                  disabled={activeEffectApplied}
                  data-tooltip={activeEffectApplied
                    ? localize('DND5E.ActiveEffectOverrideWarning')
                    : null}
                >
                  {@html tool.icon}
                </button>
              {:else}
                <span title={tool.hover} class="tool-proficiency-readonly"
                  >{@html tool.icon}</span
                >
              {/if}

              {#if $context.editable}
                <button
                  type="button"
                  class="tool-check-roller inline-transparent-button rollable"
                  on:click={(event) =>
                    $context.actor.rollToolCheck(key, { event })}
                  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.TOOL_ROLLER}
                  tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
                >
                  {tool.label}
                </button>
              {:else}
                <span class="tool-check-roller">
                  {tool.label}
                </span>
              {/if}

              {#if traitsExpanded && $context.editable && !$context.lockSensitiveFields}
                <button
                  type="button"
                  class="tool-proficiency-editor inline-icon-button"
                  title={localize('DND5E.ToolConfigure')}
                  on:click|stopPropagation|preventDefault={() =>
                    FoundryAdapter.renderProficiencyConfig(
                      $context.actor,
                      'tools',
                      key,
                    )}
                  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS
                    .TOOL_CONFIGURATION_CONTROL}
                  tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
                >
                  <i class="fas fa-cog" />
                </button>
              {/if}
            </li>
          {/each}
        </ul>
      {/if}
    </div>
    {#if traitsExpanded && $context.editable && !$context.lockSensitiveFields}
      <button
        type="button"
        class="trait-editor inline-icon-button flex-row align-items-flex-start justify-content-center"
        title={configureButtonTitle}
        on:click|stopPropagation|preventDefault={(event) =>
          dispatcher('onConfigureClicked', event)}
        tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
      >
        <i class="fas fa-pencil-alt" />
      </button>
    {/if}
  </div>
{/if}

<style lang="scss">
  .trait-form-group {
    display: flex;
    flex-direction: row;

    &.hidden {
      display: none;
    }

    :global(i) {
      color: var(--t5e-tertiary-color);
      line-height: 1rem;
      vertical-align: middle;
    }

    .trait-icon,
    .trait-editor {
      flex: 0 0 1.375rem;
      font-size: 0.75rem;
      padding: 0.125rem 0 0 0;
      text-align: center;
    }

    .trait-editor:hover i,
    .tool-proficiency-editor:hover i,
    .tool-proficiency-toggle:hover :global(i) {
      color: var(--t5e-secondary-color);
      text-shadow: none;
    }

    .trait-label-and-list {
      flex: 1;

      .trait-label {
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--t5e-secondary-color);
      }

      .trait-list {
        display: flex;
        flex-wrap: wrap;
        column-gap: 0.25rem;

        &:first-child {
          padding-top: 0.125rem;
        }

        &.tools {
          gap: 0.125rem;
        }
      }

      .trait-tag,
      .tool {
        font-size: 0.75rem;
      }

      .trait-tag {
        &::after {
          content: ',';
        }

        &:last-child::after {
          content: none;
        }
      }

      .tool {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        background-color: var(--t5e-faintest-color);
        padding: 0 0.125rem;
        border-radius: 0.25rem;
        border: 0.0625rem solid var(--t5e-tertiary-color);
      }
    }
  }
</style>
