<script setup lang="ts">
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose
} from 'reka-ui'
import { IconX } from '@tabler/icons-vue'

defineProps<{
  open: boolean
  title: string
  description?: string
  maxWidth?: string
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()
</script>

<template>
  <DialogRoot :open="open" @update:open="(val) => emit('update:open', val)">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity" />
      <DialogContent
        :class="[
          'fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-xl sm:rounded-xl',
          maxWidth || 'max-w-lg'
        ]"
      >
        <div class="flex items-start justify-between">
          <div class="space-y-1">
            <DialogTitle class="text-lg font-semibold tracking-tight text-foreground">
              {{ title }}
            </DialogTitle>
            <DialogDescription v-if="description" class="text-sm text-muted-foreground">
              {{ description }}
            </DialogDescription>
          </div>
          <DialogClose
            class="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <IconX class="size-4" />
            <span class="sr-only">Close</span>
          </DialogClose>
        </div>

        <div class="py-2">
          <slot />
        </div>

        <div v-if="$slots.footer" class="flex justify-end gap-2 pt-2 border-t">
          <slot name="footer" />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
