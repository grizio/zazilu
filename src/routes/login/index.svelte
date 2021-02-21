<script lang="ts">
  import { goto, stores } from "@sapper/app"

  const { session } = stores()

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

    if (result.status === 204) {
      session.set({ email })
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
  <p>{error}</p>
{/if}

<form on:submit|preventDefault={onSubmit}>
  <label for="email">Email</label>
  <input type="text" name="email" bind:value={email} id="email"/>

  <label for="password">Password</label>
  <input type="password" name="password" bind:value={password} id="password"/>

  <button>Submit</button>
</form>