<script lang="ts">
  import { createEventDispatcher } from "svelte"

  export let label: string
  export let name: string
  export let id: string
  export let submitLabel: string
  export let formName: string | undefined = undefined
  export let disabled: boolean = false
  export let required: boolean = true

  let value: string = ""

  const dispatch = createEventDispatcher()

  function submit() {
    dispatch("submit", {
      value,
      clear: () => {
        value = ""
      },
    })
  }

</script>

<style>
  form {
    display: flex;
  }

  label {
    position: absolute !important;
    height: 1px;
    width: 1px;
    overflow: hidden;
    clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
    clip: rect(1px, 1px, 1px, 1px);
  }

  input {
    border: 1px solid #bbbbbb;
    border-right: none;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    padding: 8px;
    margin: 0;
    flex-grow: 1;
  }

  input:focus {
    outline: none;
  }

  button {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  form:invalid button {
    background-color: #a7c4dc;
    cursor: not-allowed;
  }

</style>

<form on:submit|preventDefault={submit} name={formName} id={formName}>
  <label for={id}>{label}</label>
  <input type="text" name={name} placeholder={label} bind:value required={required} disabled={disabled} />
  <button class="primary" disabled={disabled}>{submitLabel}</button>
</form>
