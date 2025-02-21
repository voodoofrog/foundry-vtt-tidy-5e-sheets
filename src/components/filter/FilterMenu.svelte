<script lang="ts">
  import ButtonMenu from '../button-menu/ButtonMenu.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';
  import type { ActorSheetContext } from 'src/types/types';
  import type { Readable } from 'svelte/store';
  import FilterToggleButton from './FilterToggleButton.svelte';
  import type { ItemFilterService } from 'src/features/filtering/ItemFilterService';
  import ButtonMenuDivider from 'src/components/button-menu/ButtonMenuDivider.svelte';

  export let tabId: string;

  const localize = FoundryAdapter.localize;
  const context = getContext<Readable<ActorSheetContext>>('context');
  const onFilterClearAll =
    getContext<ItemFilterService['onFilterClearAll']>('onFilterClearAll');
  $: categories = $context.filterData[tabId];
  $: hasActiveFilters = Object.entries(categories).some(([_, filters]) =>
    filters.some((f) => f.value !== null),
  );

  $: menuOpen = false;
</script>

<div role="presentation" class="filter-menu">
  <ButtonMenu
    iconClass="fas fa-filter"
    buttonClass="inline-icon-button filter-menu-button {hasActiveFilters
      ? 'has-active-filters'
      : ''} {menuOpen ? 'menu-is-open' : ''}"
    position="bottom"
    anchor="right"
    title={localize('TIDY5E.ItemFilters.MenuTooltip.Filters')}
    bind:open={menuOpen}
    menuElement="div"
  >
    {#each Object.entries(categories) as [category, filters] (category)}
      <section class="filter-group">
        <h4 class="filter-group-header">
          {localize(category)}
        </h4>
        <div class="filters">
          {#each filters as filter (filter.text)}
            <FilterToggleButton filterGroupName={tabId} {filter}>
              {localize(filter.text)}
            </FilterToggleButton>
          {/each}
        </div>
      </section>
    {/each}
    <ButtonMenuDivider />
    <section class="filter-footer flex-row justify-content-center">
      <button
        type="button"
        class="clear-all-button pill-button flex-row extra-small-gap align-items-center"
        on:click={(ev) => {
          onFilterClearAll(tabId);
          menuOpen = false;
        }}
      >
        <i class="fas fa-filter-slash"></i>
        {localize('TIDY5E.ItemFilters.ClearAll')}</button
      >
    </section>
  </ButtonMenu>
</div>

<style lang="scss">
  .filter-menu {
    display: contents;

    :global(.filter-menu-button.has-active-filters) {
      color: var(--t5e-primary-accent-color);
    }
    :global(.filter-menu-button.has-active-filters:hover) {
      color: var(--t5e-primary-accent-color);
    }
  }

  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.125rem;
    row-gap: 0.3125rem;
  }

  section {
    padding: 0.25rem 0.5rem;
  }

  .clear-all-button {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  section {
    min-width: 18.75rem;
    max-width: 31.25rem;
  }

  .filter-group-header {
    margin-block-end: 0.5rem;
  }
</style>
