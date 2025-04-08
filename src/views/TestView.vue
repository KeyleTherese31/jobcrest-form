<template>
  <div class="container mt-4">
    <h2 class="mb-4">Job Application Test</h2>

    <form @submit.prevent="submitAnswers">
      <div v-for="(q, i) in questions" :key="i" class="mb-4">
        <label :for="'q' + i" class="font-weight-bold">{{ q.label }}</label>
        <div v-if="q.type === 'image'" class="mb-2">
          <img :src="q.image" class="img-fluid" style="max-width: 300px;" />
        </div>
        <input
          type="text"
          class="form-control"
          :id="'q' + i"
          v-model="answers[i]"
          required
          placeholder="Your answer"
        />
      </div>

      <button type="submit" class="btn btn-success">Submit Answers</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      questions: [],
      answers: []
    }
  },
  mounted() {
    const saved = localStorage.getItem('questions')
    if (saved) {
      this.questions = JSON.parse(saved)
      this.answers = new Array(this.questions.length).fill('')
    }
  },
  methods: {
    submitAnswers() {
      const response = {
        timestamp: new Date().toISOString(),
        answers: this.answers
      }

      const stored = JSON.parse(localStorage.getItem('responses') || '[]')
      stored.push(response)
      localStorage.setItem('responses', JSON.stringify(stored))

      alert('Answers submitted! Thank you.')
      this.$router.push('/') // Redirect or show a confirmation
    }
  }
}
</script>
