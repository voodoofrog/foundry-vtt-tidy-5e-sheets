<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e } from 'src/types/item';
  import ItemTable from '../../../components/item-list/ItemTable.svelte';
  import ItemTableHeaderRow from '../../../components/item-list/ItemTableHeaderRow.svelte';
  import ItemTableRow from '../../../components/item-list/ItemTableRow.svelte';
  import ItemTableFooter from '../../../components/item-list/ItemTableFooter.svelte';
  import ItemTableColumn from '../../../components/item-list/ItemTableColumn.svelte';
  import ItemTableCell from '../../../components/item-list/ItemTableCell.svelte';
  import ItemUseButton from '../../../components/item-list/ItemUseButton.svelte';
  import ItemName from '../../../components/item-list/ItemName.svelte';
  import { CONSTANTS } from 'src/constants';
  import ItemUses from '../../../components/item-list/ItemUses.svelte';
  import ItemAddUses from '../../../components/item-list/ItemAddUses.svelte';
  import ItemControls from '../../../components/item-list/controls/ItemControls.svelte';
  import ItemDuplicateControl from '../../../components/item-list/controls/ItemDuplicateControl.svelte';
  import ItemDeleteControl from '../../../components/item-list/controls/ItemDeleteControl.svelte';
  import ItemEditControl from '../../../components/item-list/controls/ItemEditControl.svelte';
  import EquipControl from '../../../components/item-list/controls/EquipControl.svelte';
  import AttuneControl from '../../../components/item-list/controls/AttuneControl.svelte';
  import InlineFavoriteIcon from '../../../components/item-list/InlineFavoriteIcon.svelte';
  import ItemFavoriteControl from '../../../components/item-list/controls/ItemFavoriteControl.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { CharacterSheetContext } from 'src/types/types';
  import ListItemQuantity from 'src/sheets/actor/ListItemQuantity.svelte';
  import AmmoSelector from '../../actor/AmmoSelector.svelte';
  import { settingStore } from 'src/settings/settings';
  import ActionFilterOverrideControl from 'src/components/item-list/controls/ActionFilterOverrideControl.svelte';

  export let primaryColumnName: string;
  export let items: Item5e[];
  export let extraInventoryRowClasses: string = '';
  export let section: any = undefined;
  export let lockControls: boolean = false;
  export let allowFavoriteIconNextToName: boolean = true;
  export let includeWeightColumn: boolean = true;

  let context = getContext<Readable<CharacterSheetContext>>('context');

  const localize = FoundryAdapter.localize;
  const weightUnit = FoundryAdapter.getWeightUnit();

  $: classicControlsBaseWidth = $context.unlocked ? '7.5rem' : '5.3125rem';

  function getInventoryRowClasses(item: Item5e) {
    const extras: string[] = [];

    if (extraInventoryRowClasses) {
      extras.push(extraInventoryRowClasses);
    }

    return FoundryAdapter.getInventoryRowClasses(
      item,
      $context.itemContext[item.id],
      extras,
    );
  }
</script>

<section class="inventory-list-section">
  <ItemTable location={section?.label ?? primaryColumnName}>
    <svelte:fragment slot="header">
      <ItemTableHeaderRow>
        <ItemTableColumn primary={true}>
          {primaryColumnName}
        </ItemTableColumn>
        {#if includeWeightColumn}
          <ItemTableColumn
            title="{localize('DND5E.Weight')} ({weightUnit})"
            baseWidth="4rem"
          >
            <i class="fas fa-weight-hanging" />
          </ItemTableColumn>
        {/if}
        <ItemTableColumn title={localize('DND5E.Charges')} baseWidth="3.125rem">
          <i class="fas fa-bolt" />
        </ItemTableColumn>
        <ItemTableColumn baseWidth="7.5rem">
          {localize('DND5E.Usage')}
        </ItemTableColumn>
        {#if $context.editable && $context.useClassicControls && !lockControls}
          <ItemTableColumn baseWidth={classicControlsBaseWidth} />
        {/if}
      </ItemTableHeaderRow>
    </svelte:fragment>
    <svelte:fragment slot="body">
      {#each items as item (item.id)}
        {@const ctx = $context.itemContext[item.id]}
        <ItemTableRow
          {item}
          on:mousedown={(event) =>
            FoundryAdapter.editOnMiddleClick(event.detail, item)}
          contextMenu={{
            type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
            id: item.id,
          }}
          let:toggleSummary
          cssClass={getInventoryRowClasses(item)}
        >
          <ItemTableCell primary={true} title={item.name}>
            <ItemUseButton disabled={!$context.editable} {item} />
            <ItemName
              on:toggle={() => toggleSummary($context.actor)}
              cssClass="extra-small-gap"
              {item}
            >
              <span
                class="truncate"
                data-tidy-item-name={item.name}
                data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_NAME}
                >{item.name}</span
              >
              {#if item.system?.properties?.amm}
                <span class="ammo">
                  <AmmoSelector {item} />
                </span>
              {/if}
              <ListItemQuantity {item} {ctx} />
            </ItemName>
          </ItemTableCell>
          {#if $settingStore.showIconsNextToTheItemName}
            <ItemTableCell cssClass="no-border">
              {#if ctx?.attunement}
                <div class="item-detail attunement">
                  <i
                    class="item-state-icon fas {ctx.attunement.icon} {ctx
                      .attunement.cls}"
                    title={localize(ctx.attunement.title)}
                  />
                </div>
              {/if}
            </ItemTableCell>
            {#if FoundryAdapter.tryGetFlag(item, 'favorite') && allowFavoriteIconNextToName}
              <InlineFavoriteIcon />
            {/if}
          {/if}
          {#if includeWeightColumn}
            {@const weight = ctx?.totalWeight ?? item.system.weight}
            <ItemTableCell
              baseWidth="4rem"
              title={localize('TIDY5E.Inventory.Weight.Tooltip', {
                weight: weight,
                weightUnit: weightUnit,
              })}
            >
              <span class="truncate">
                {localize('TIDY5E.Inventory.Weight.Text', {
                  weight: weight,
                  weightUnit: weightUnit,
                })}
              </span>
            </ItemTableCell>
          {/if}
          <ItemTableCell baseWidth="3.125rem" title={localize('DND5E.Uses')}>
            {#if ctx?.hasUses}
              <ItemUses {item} />
            {:else}
              <ItemAddUses {item} />
            {/if}
          </ItemTableCell>
          <ItemTableCell baseWidth="7.5rem" title={localize('DND5E.Usage')}>
            {#if item.system.activation?.type}
              {item.labels.activation}
            {/if}
          </ItemTableCell>
          {#if $context.editable && $context.useClassicControls && !lockControls}
            <ItemTableCell baseWidth={classicControlsBaseWidth}>
              <ItemControls>
                {#if ctx?.attunement}
                  <AttuneControl {item} {ctx} />
                {:else}
                  <span role="presentation" />
                {/if}
                {#if ctx?.canToggle}
                  <EquipControl {item} {ctx} />
                {:else}
                  <span role="presentation" />
                {/if}
                <ItemFavoriteControl {item} />
                <ItemEditControl {item} />
                {#if $context.unlocked}
                  <ItemDuplicateControl {item} />
                  <ItemDeleteControl {item} />
                {/if}
                {#if $context.useActionsFeature}
                  <ActionFilterOverrideControl {item} />
                {/if}
              </ItemControls>
            </ItemTableCell>
          {/if}
        </ItemTableRow>
      {/each}
      {#if $context.unlocked && section}
        <ItemTableFooter actor={$context.actor} {section} isItem={true} />
      {/if}
    </svelte:fragment>
  </ItemTable>
</section>

<style lang="scss">
  .inventory-list-section {
    .item-detail.attunement {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 0.25rem;
    }
  }
</style>
