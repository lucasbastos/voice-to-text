<template>
  <div>
    <div
      class="rounded-md flex flex-col gap-3 text-left bg-slate-700 p-5 hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none"
      @click="openModal"
    >
      <span class="text-sm font-medium text-slate-200">
        Adicionar nota
      </span>
      <p class="text-sm leading-6 text-slate-400">
        Grave uma nota em áudio que será convertida para texto automaticamente.
      </p>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black/50 z-50">
      <div
        class="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none"
        @click.self="closeModal"
      >
        <button
          class="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100"
          @click="closeModal"
        >
          <x-icon class="size-5" />
        </button>

        <form class="flex-1 flex flex-col" @submit.prevent="handleSaveNote">
          <div class="flex flex-1 flex-col gap-3 p-5">
            <span class="text-sm font-medium text-slate-300">
              Adicionar nota
            </span>

            <p v-if="shouldShowOnboarding" class="text-sm leading-6 text-slate-400">
              Comece
              <button
                type="button"
                @click="handleStartRecording"
                class="font-medium text-lime-400 hover:underline"
              >
                gravando uma nota
              </button>
              em áudio ou se preferir
              <button
                type="button"
                @click="handleStartEditor"
                class="font-medium text-lime-400 hover:underline"
              >
                utilize apenas texto
              </button>
              .
            </p>
            <textarea
              v-else
              autoFocus
              class="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
              v-model="content"
            />
          </div>

          <button
            v-if="isRecording"
            type="button"
            @click="handleStopRecording"
            class="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100"
          >
            <div class="size-3 rounded-full bg-red-500 animate-pulse" />
            Gravando! (clique p/ interromper)
          </button>
          <button
            v-else
            type="submit"
            class="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
          >
            Salvar nota
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import * as icons from "lucide-vue-next";
import {useToast} from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
const speechRecognition = new SpeechRecognitionAPI();

const isRecording = ref(false);
const shouldShowOnboarding = ref(true);
const content = ref("");
const isModalOpen = ref(false);

const emit = defineEmits(['note-created']);

function handleStartEditor() {
  shouldShowOnboarding.value = false;
}

function handleContentChanged(event) {
  content.value = event.target.value;

  if (event.target.value === "") {
    shouldShowOnboarding.value = true;
  }
}

function handleSaveNote() {
  if (content.value === "") {
    return;
  }

  emit('note-created', content.value);

  content.value = "";
  shouldShowOnboarding.value = true;
  closeModal();
  const $toast = useToast();
  let instance = $toast.success("Nota criada com sucesso!");

  // Force dismiss specific toast
instance.dismiss();

// Dismiss all opened toast immediately
$toast.clear();
}

function handleStartRecording() {
  if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
    alert("Infelizmente seu navegador não suporta a API de gravação!");
    return;
  }

  isRecording.value = true;
  shouldShowOnboarding.value = false;

  speechRecognition.lang = "pt-BR";
  speechRecognition.continuous = true;
  speechRecognition.maxAlternatives = 1;
  speechRecognition.interimResults = true;

  speechRecognition.onresult = (event) => {
    const transcription = Array.from(event.results).reduce((text, result) => {
      return text.concat(result[0].transcript);
    }, "");

    content.value = transcription;
  };

  speechRecognition.onerror = (event) => {
    console.error(event);
  };

  speechRecognition.start();
}

function handleStopRecording() {
  isRecording.value = false;

  if (speechRecognition !== null) {
    speechRecognition.stop();
  }
}

function openModal() {
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}
</script>
