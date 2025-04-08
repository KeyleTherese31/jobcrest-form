<template>
  <div class="container mt-4">
    <h2 class="mb-4">Archived Questions</h2>

    <div v-if="archived.length === 0">
      <p>No archived questions.</p>
    </div>

    <ul class="list-group" v-else>
      <li
        v-for="(q, i) in archived"
        :key="i"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div>
          <strong>{{ q.label }}</strong>
          <span class="badge badge-secondary ml-2">{{ q.type }}</span>
          <div v-if="q.image">
            <img :src="q.image" style="max-width: 100px;" class="mt-2" />
          </div>
        </div>
        <div>
          <button class="btn btn-sm btn-primary mr-2" @click="restoreQuestion(i)">Restore</button>
          <button class="btn btn-sm btn-danger" @click="deleteArchived(i)">Delete</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      archived: []
    }
  },
  mounted() {
    const saved = localStorage.getItem('archived_questions')
    if (saved) {
      this.archived = JSON.parse(saved)
    }
  },
  methods: {
    restoreQuestion(index) {
      const active = JSON.parse(localStorage.getItem('questions') || '[]')
      active.push(this.archived[index])
      localStorage.setItem('questions', JSON.stringify(active))

      this.archived.splice(index, 1)
      this.save()
    },
    deleteArchived(index) {
      if (confirm('Permanently delete this question?')) {
        this.archived.splice(index, 1)
        this.save()
      }
    },
    save() {
      localStorage.setItem('archived_questions', JSON.stringify(this.archived))
    }
  }
}
</script>
