<template>
    <div>
      <div
        class="rounded-md text-left bg-slate-800 flex flex-col p-5 gap-3 overflow-hidden relative hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none"
        @click="isOpen = true"
      >
        <span class="text-sm font-medium text-slate-300">
          {{ formattedDate }}
        </span>
        <p class="text-sm leading-6 text-slate-400">{{ note.content }}</p>
        <div class="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none" />
      </div>
  
      <div v-if="isOpen" class="fixed inset-0 bg-black/50 z-50">
        <div
          class="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none"
          @click.self="isOpen = false"
        >
          <button
            class="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100"
            @click="isOpen = false"
          >
            <!-- <x-icon class="size-5" /> -->
            <Icon name="Airplay" />
          </button>
          <div class="flex flex-1 flex-col gap-3 p-5">
            <span class="text-sm font-medium text-slate-300">
              {{ formattedDate }}
            </span>
            <p class="text-sm leading-6 text-slate-400">{{ note.content }}</p>
          </div>
          <button
            type="button"
            @click="onNoteDeleted(note.id)"
            class="w-full bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none font-medium group"
          >
            Would like to
            <span class="text-red-400 group-hover:underline">
              delete this note
            </span>
            ?
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { formatDistanceToNow } from 'date-fns';
  import { ptBR } from 'date-fns/locale';
  import * as icons from "lucide-vue-next";
  
  const props = defineProps({
    note: {
      type: Object,
      required: true,
    },
    onNoteDeleted: {
      type: Function,
      required: true,
    },
  });
  
  const isOpen = ref(false);
  
  const formattedDate = formatDistanceToNow(new Date(props.note.date), {
    locale: ptBR,
    addSuffix: true,
  });
  
  </script>
  
  <style scoped>
  /* Your component-specific styles here */
  </style>
  