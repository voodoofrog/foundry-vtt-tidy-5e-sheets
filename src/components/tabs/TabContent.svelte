<script lang="ts">
  import type { Tab } from 'src/types/types';
  import { declareLocation } from 'src/types/location-awareness';
  import { CONSTANTS } from 'src/constants';
  import { getAllContexts, getContext, onMount } from 'svelte';
  import type { Readable } from 'svelte/store';
  import { error } from 'src/utils/logging';

  export let tab: Tab;
  export let active: boolean;
  export let cssClass: string = '';

  const context = getContext<Readable<any>>('context');
  const allContexts = getAllContexts();

  declareLocation('tab', tab.id);

  $: useCoreListenersClass = tab.activateDefaultSheetListeners
    ? CONSTANTS.CLASS_TIDY_USE_CORE_LISTENERS
    : '';

  let tidyTab: HTMLElement;

  onMount(() => {
    if (tab.content.type !== 'svelte') {
      return;
    }

    try {
      const props = tab.content.getProps?.($context) ?? {};
      const tabComponentContext =
        tab.content.getContext?.(allContexts) ?? allContexts;
      const svelteTabComponent = new tab.content.component({
        target: tidyTab,
        context: tabComponentContext,
        props: props,
      });

      return () => {
        svelteTabComponent.$destroy();
      };
    } catch (e) {
      error('Failed to render svelte tab', false, e);
    }
  });
</script>

<div
  class="tidy-tab {tab.id} {cssClass} {tab.content.cssClass ??
    ''} {useCoreListenersClass}"
  class:active
  data-tab-contents-for={tab.id}
  bind:this={tidyTab}
></div>

<style lang="scss">
  .tidy-tab {
    height: 100%;
    flex-direction: column;
    display: none;

    &.active {
      display: flex;
    }
  }
</style>
