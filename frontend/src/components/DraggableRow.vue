<script setup lang="ts">
import { ref } from "vue"
import type { Row } from "@tanstack/vue-table"
import type { z } from "zod"
import type { schema } from "./DataTable.vue"
import type { Features } from "./features"
import { FlexRender } from "@tanstack/vue-table"
import { useSortable } from "@dnd-kit/vue/sortable"
import { TableCell, TableRow } from '@/components/ui/table'

const props = defineProps<{ 
  row: Row<Features, z.infer<typeof schema>>
  index: number 
}>()

const itemElement = ref<any>(null)

const { isDragging } = useSortable({
  id: props.row.original.id,
  index: props.index,
  element: itemElement, // Monitors spatial tracking layout parameters across the element boundary
})
</script>

<template>
  <TableRow
    ref="itemElement"
    :data-state="row.getIsSelected() && 'selected'"
    :data-dragging="isDragging"
    class="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
  >
    <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
      <FlexRender :cell="cell" />
    </TableCell>
  </TableRow>
</template>