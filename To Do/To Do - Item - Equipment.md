## Cleanup Side Quest

- [x] Update character sheet to ambiently memoize selected tab ID
- [ ] Update character sheet to Svelte Mode
- [ ] Put tab IDs in CONSTANTS and propagate across the system.

## To Do

- [ ] Create `ItemEquipment.svelte` to house the equipment view
- [ ] Create `ItemNoMatch.svelte` and put a generic "Item Type Template Not Found." message, etc.
- [ ] Implement the item type switch for `activateListeners()`
- [ ] Ensure equipment mounts the equipment component
- [ ] Scaffold the tabs
- [ ] Stub the shared stuff for now
- [ ] Implement the non-shared stuff
- [ ] Task out implementing the stubs
- [ ] Implement the stubs
- [ ] Ensure the window resizes when the size of the contents changes
- [ ] Confirm that changes are saving appropriately
- [ ] Confirm that outside changes affect this form appropriately


### equipment.hbs

```hbs
<form class="{{cssClass}} flexcol" autocomplete="off">

    {{!-- Item Sheet Header --}}
    <header class="sheet-header flexrow">
        <img class="profile" src="{{item.img}}" data-tooltip="{{item.name}}" data-edit="img"/>

        <div class="header-details flexrow">
            <h1 class="charname">
                <input name="name" type="text" value="{{item.name}}" placeholder="{{ localize 'DND5E.ItemName' }}"/>
            </h1>

            <div class="item-subtitle">
                <h4 class="item-type">{{itemType}}</h4>
                <span class="item-status">{{itemStatus}}</span>
            </div>

            <ul class="summary flexrow">
                <li>
                    {{lookup config.equipmentTypes system.armor.type }}
                </li>
                <li>
                    <select name="system.rarity">
                        {{selectOptions config.itemRarity selected=system.rarity blank=""}}
                    </select>
                </li>
                <li>
                    <input type="text" name="system.source" value="{{system.source}}" placeholder="{{ localize 'DND5E.Source' }}"/>
                </li>
            </ul>
        </div>
    </header>

    {{!-- Item Sheet Navigation --}}
    <nav class="sheet-navigation tabs" data-group="primary">
        <a class="item active" data-tab="description">{{ localize "DND5E.Description" }}</a>
        <a class="item" data-tab="details">{{ localize "DND5E.Details" }}</a>
        <a class="item" data-tab="effects">{{ localize "DND5E.Effects" }}</a>
    </nav>

    {{!-- Item Sheet Body --}}
    <section class="sheet-body">

        {{!-- Description Tab --}}
        {{> "dnd5e.item-description"}}

        {{!-- Details Tab --}}
        <div class="tab details" data-group="primary" data-tab="details">
            <h3 class="form-header">{{ localize "DND5E.ItemEquipmentDetails" }}</h3>

            {{!-- Equipment Type --}}
            <div class="form-group">
                <label>{{ localize "DND5E.ItemEquipmentType" }}</label>
                <select name="system.armor.type">
                    <option value=""></option>
                    <optgroup label="{{ localize "DND5E.Armor" }}">
                        {{selectOptions config.armorTypes selected=system.armor.type}}
                    </optgroup>
                    {{selectOptions config.miscEquipmentTypes selected=system.armor.type}}
                </select>
            </div>

            <div class="form-group">
                <label>{{ localize "DND5E.ItemEquipmentBase" }}</label>
                <select name="system.baseItem">
                    {{selectOptions baseItems selected=system.baseItem blank=""}}
                </select>
            </div>

            {{#unless system.isMountable}}
            <div class="form-group">
                <label>{{localize "DND5E.Attunement"}}</label>
                <select name="system.attunement" data-dtype="Number">
                    {{selectOptions config.attunements selected=system.attunement}}
                </select>
            </div>

            {{!-- Equipment Status --}}
            <div class="form-group stacked">
                <label>{{ localize "DND5E.ItemEquipmentStatus" }}</label>
                <label class="checkbox">
                    <input type="checkbox" name="system.proficient" {{checked system.proficient}}/> {{ localize "DND5E.Proficient" }}
                </label>
                <label class="checkbox">
                    <input type="checkbox" name="system.equipped" {{checked system.equipped}}/> {{ localize "DND5E.Equipped" }}
                </label>
                <label class="checkbox">
                    <input type="checkbox" name="system.identified" {{checked system.identified}}/> {{ localize "DND5E.Identified" }}
                </label>
            </div>
            {{/unless}}

            {{!-- Armor Class --}}
            {{#if (or system.isArmor system.isMountable)}}
            <div class="form-group">
                <label>{{ localize "DND5E.ArmorClass" }}</label>
                <div class="form-fields">
                    {{numberInput system.armor.value name="system.armor.value"}}
                </div>
            </div>
            {{/if}}

            {{#if hasDexModifier}}
            {{!-- Dexterity Modifier --}}
            <div class="form-group">
                <label>{{ localize "DND5E.ItemEquipmentDexMod" }}</label>
                <div class="form-fields">
                    {{numberInput system.armor.dex name="system.armor.dex" placeholder=(localize "DND5E.Unlimited")}}
                </div>
            </div>
            {{/if}}

            {{#if system.isArmor}}
            {{!-- Required Strength --}}
            <div class="form-group">
                <label>{{ localize "DND5E.ItemRequiredStr" }}</label>
                <div class="form-fields">
                    {{numberInput system.strength name="system.strength" placeholder=(localize "DND5E.None")}}
                </div>
            </div>

            {{!-- Stealth Disadvantage --}}
            <div class="form-group">
                <label>{{ localize "DND5E.ItemEquipmentStealthDisav" }}</label>
                <input type="checkbox" name="system.stealth" {{checked system.stealth}}/>
            </div>
            {{/if}}

            {{#if system.isMountable}}
            {{> "dnd5e.item-mountable"}}
            <div class="form-group">
                <label>{{localize 'DND5E.Speed'}}</label>
                <div class="form-fields">
                    {{numberInput system.speed.value name="system.speed.value" placeholder="0"}}
                    <span class="sep">{{localize 'DND5E.FeetAbbr'}}</span>
                    <input type="text" name="system.speed.conditions"
                           value="{{system.speed.conditions}}">
                </div>
            </div>
            {{/if}}

            <h3 class="form-header">{{ localize "DND5E.ItemEquipmentUsage" }}</h3>

            {{!-- Item Activation Template --}}
            {{> "dnd5e.item-activation"}}

            <h3 class="form-header">{{ localize "DND5E.ItemEquipmentAction" }}</h3>

            {{!-- Item Action Template --}}
            {{> "dnd5e.item-action"}}
        </div>

        {{!-- Effects Tab --}}
        <div class="tab effects flexcol" data-group="primary" data-tab="effects">
            {{> "dnd5e.active-effects"}}
        </div>
    </section>
</form>
```