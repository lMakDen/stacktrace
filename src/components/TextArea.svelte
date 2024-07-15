<script lang="ts">
  export let onChange: ({ target }: { target: any }) => void;
</script>

<textarea on:change={onChange} />
