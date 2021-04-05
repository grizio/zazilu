<script lang="ts">
  import { session } from "$app/stores"
  import AuthenticatedRestriction from "$lib/security/AuthenticatedRestriction.svelte"
  import UnauthenticatedRestriction from "$lib/security/UnauthenticatedRestriction.svelte"
  import AdminRestriction from "$lib/security/AdminRestriction.svelte"

  export let segment: string

  async function logout() {
    await fetch("/logout", {
      method: "POST",
      headers: {
        Accept: "application/json",
      }
    })
    session.set(null)
  }
</script>

<style>
  nav {
    box-shadow: 1px 0 2px #333333;
    margin-bottom: 16px;
  }

  a {
    color: #333333;
  }

  .container {
    margin: auto;
    display: flex;
    max-width: 1200px;
    justify-content: space-between;
  }

  .container > a {
    font-size: 18px;
    text-decoration: none;
    padding: 16px 0;
    font-weight: 400;
  }

  ul {
    display: flex;
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  /* clearfix */
  ul::after {
    content: '';
    display: block;
    clear: both;
  }

  li {
    line-height: unset;
  }

  li a, li button {
    display: block;
    color: #333333;
    text-decoration: none;
    font-size: 18px;
    padding: 16px 12px;
    margin: 0;
    background: none;
    border: none;
    cursor: pointer;
    box-sizing: border-box;
    font-weight: 400;
  }

  li a[aria-current] {
    padding-bottom: 14px;
    border-bottom: 2px solid #333333;
  }
</style>

<nav>
  <div class="container">
    <a href="/">Zazilu</a>

    <ul>
      <UnauthenticatedRestriction>
        <li><a aria-current="{segment === 'login' ? 'page' : undefined}" href="/login">login</a></li>
      </UnauthenticatedRestriction>
      <AdminRestriction>
        <li><a aria-current={segment === 'admin' ? 'page' : undefined} href="/admin">administration panel</a></li>
      </AdminRestriction>
      <AuthenticatedRestriction>
        <li><button on:click={logout}>logout</button></li>
      </AuthenticatedRestriction>
    </ul>
  </div>
</nav>
