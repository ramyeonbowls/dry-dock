<script setup lang="ts">
import { ref } from 'vue'
import { useSortable } from '@dnd-kit/vue/sortable'
import { IconGripVertical } from "@tabler/icons-vue"
import { Button } from '@/components/ui/button'

const props = defineProps<{
  id: string
  index: number
}>()

const handleElement = ref<any>(null)

// Bind the sortable hook strictly to the handle ref mapping
useSortable({
  id: props.id,
  index: props.index,
  handle: handleElement, // Limits drag actions to this specific component instance
})
</script>

<template>
  <Button
    ref="handleElement"
    variant="ghost"
    size="icon"
    class="text-muted-foreground size-7 hover:bg-transparent cursor-grab active:cursor-grabbing"
  >
    <IconGripVertical class="text-muted-foreground size-3" />
    <span class="sr-only">Drag to reorder</span>
  </Button>
</template>