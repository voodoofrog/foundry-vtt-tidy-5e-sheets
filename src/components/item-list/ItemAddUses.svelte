<script lang="ts">
    import { settingStore } from "src/settings/settings";

  export let item: any;

  function onAddUses() {
    let data: Record<string, unknown> = {};
    data['system.uses.value'] = 1;
    data['system.uses.max'] = 1;

    item.update(data);
  }
</script>

<button
  type="button"
  class="item-add-uses item-list-button"
  on:click={() => onAddUses()}
  disabled={!item.isOwner}
  tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
>
  Add
</button>

<style lang="scss">
  .item-add-uses {
    display: block;
    width: 100%;
    height: 100%;
    text-align: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      opacity: 1;
      color: var(--t5e-secondary-color);
    }
  }
</style>
