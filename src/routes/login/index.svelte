<script lang="ts">
  import { session } from "$app/stores"
  import { goto } from "$app/navigation"
  import PrimaryButton from "$lib/components/button/PrimaryButton.svelte"
  import InputPassword from "$lib/components/form/InputPassword.svelte"
  import InputText from "$lib/components/form/InputText.svelte"
  import Panel from "$lib/components/Panel.svelte";

  let email: string = ""
  let password: string = ""

  let error: string | undefined = undefined

  async function onSubmit() {
    const result = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (result.status === 200) {
      session.set(await result.json())
      await goto("/")
    } else if (result.status === 400) {
      error = await result.json()
    } else {
      error = await result.text()
    }
  }
</script>

<svelte:head>
  <title>Login</title>
</svelte:head>

<h1>Login</h1>

{#if error !== undefined}
  <Panel type="error">
    {error}
  </Panel>
{/if}

<form on:submit|preventDefault={onSubmit}>
  <InputText
    label="Email"
    id="email"
    name="email"
    bind:value={email}
    dataTestId="login-email"
  />

  <InputPassword
    label="Password"
    id="password"
    name="password"
    bind:value={password}
    dataTestId="login-password"
  />

  <PrimaryButton label="Submit" dataTestId="login-submit" />
</form>
