<script lang="ts">
  import type { Meet } from "../../model/Page"

  export let bloc: Meet
</script>

<time datetime={bloc.date.toISOString()}>{bloc.date}</time>
