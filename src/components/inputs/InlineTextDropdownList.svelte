<script lang="ts">
  import type { DropdownListOption } from 'src/types/types';
  import { createEventDispatcher } from 'svelte';
  import ButtonMenu from '../button-menu/ButtonMenu.svelte';
  import ButtonMenuCommand from '../button-menu/ButtonMenuCommand.svelte';

  export let options: DropdownListOption[];
  export let selected: DropdownListOption;
  export let isOpen = false;
  export let title: string | null = null;

  const dispatch = createEventDispatcher<{
    optionClicked: DropdownListOption;
  }>();

  function optionClicked(selection: DropdownListOption): void {
    dispatch('optionClicked', { ...selection });
    isOpen = false;
  }
</script>

<ButtonMenu
  position="bottom"
  ariaLabel={title}
  {title}
  buttonText={selected.text}
  buttonClass="inline-transparent-button primary"
>
  {#each options as option}
    <ButtonMenuCommand
      useIconColumn={false}
      on:click={() => optionClicked(option)}
      size="compact"
    >
      {option.text}
    </ButtonMenuCommand>
  {/each}
</ButtonMenu>
