<script lang="ts">
  import { createEventDispatcher } from "svelte"

  export let label: string
  export let name: string
  export let id: string
  export let accept: string | undefined = undefined
  export let multiple: boolean = false
  export let submitLabel: string
  export let formName: string | undefined = undefined
  export let disabled: boolean = false

  let files: FileList = [] as unknown as FileList

  const dispatch =
    createEventDispatcher<{
      submit: { value: Array<File>; clear: () => void }
    }>()

  function submit() {
    dispatch("submit", {
      value: Array.from(files),
      clear: () => {
        files = [] as unknown as FileList
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
  <input
    type="file"
    name={name}
    accept={accept}
    multiple={multiple}
    bind:files={files}
    required
    disabled={disabled}
  />
  <button class="primary" disabled={disabled}>{submitLabel}</button>
</form>
