<script>
  import ListItem from "../components/ListItem.svelte";

  export let list;
  console.log("zashlo v messageList", list);
</script>

{#each list as item}
  <svelte:component this={ListItem} {item} />
{/each}
