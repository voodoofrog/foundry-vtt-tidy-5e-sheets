<script lang="ts">
  import RerenderAfterFormSubmission from 'src/components/utility/RerenderAfterFormSubmission.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SheetEditor from 'src/components/editor/SheetEditor.svelte';
  import type { ItemSheetContext } from 'src/types/item';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<ItemSheetContext>>('context');

  const localize = FoundryAdapter.localize;

  function activateProseMirrorListeners(node: HTMLElement) {
    $context.activateFoundryJQueryListeners(node);
  }
</script>

<RerenderAfterFormSubmission andOnValueChange={$context.item.system.description.value}>
  <article class="editor-container" use:activateProseMirrorListeners>
    <h2 class="details-headline">{localize('TIDY5E.ItemDetailsHeadline')}</h2>
    <SheetEditor
      content={$context.enriched.description}
      editable={$context.editable}
      target="system.description.value"
    />
  </article>
</RerenderAfterFormSubmission>
