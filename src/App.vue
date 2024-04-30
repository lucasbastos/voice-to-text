<template>
  <button @click="switchLanguage">Switch Language</button>
  <h1>{{ t('message.hello') }}</h1>
  <div class="mx-auto max-w-6xl my-12 space-y-6 px-5">
    <img :src="logo" alt="Logo" class="w-16 h-16" />

    <form class="w-full">
      <input
        type="text"
        placeholder="Busque em suas notas..."
        class="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-state-500"
        @input="handleSearch"
      />
    </form>

    <div class="h-px bg-slate-700" />

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
      <NewNoteCard @note-created="onNoteCreated" />

      <NoteCard
        v-for="note in filteredNotes"
        :key="note.id"
        :note="note"
        @note-deleted="onNoteDeleted"
      />
    </div>
  </div>

  <select v-model="$i18n.locale">
      <option v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale">{{ locale }}</option>
    </select>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import NewNoteCard from './components/NewNoteCard.vue';
import NoteCard from './components/NoteCard.vue';
import logo from './assets/waveform-icon.svg';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const search = ref('');
const notes = ref([]);

onMounted(() => {
  const notesOnStorage = localStorage.getItem('notes');
  if (notesOnStorage) {
    notes.value = JSON.parse(notesOnStorage);
  }
});

function onNoteCreated(content) {
  const newNote = {
    id: crypto.randomUUID(),
    date: new Date(),
    content,
  };

  notes.value = [newNote, ...notes.value];

  localStorage.setItem('notes', JSON.stringify(notes.value));
}

function onNoteDeleted(id) {
  notes.value = notes.value.filter(note => note.id !== id);

  localStorage.setItem('notes', JSON.stringify(notes.value));
}

function handleSearch(event) {
  search.value = event.target.value;
}

function switchLanguage() {
  
}

const filteredNotes = computed(() => {
  if (search.value !== "") {
    return notes.value.filter(note =>
      note.content.toLowerCase().includes(search.value.toLowerCase())
    );
  }
  return notes.value;
});


</script>

<style scoped>
/* Include any styles specific to this component */
</style>

<!-- <script setup>
import { ref, watchEffect } from 'vue';

const isDarkMode = ref(false);

watchEffect(() => {
  document.documentElement.className = isDarkMode.value ? 'dark' : '';
});

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
};
</script> -->