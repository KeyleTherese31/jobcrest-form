<template>
  <div class="container mt-4">
    <img src="@/assets/logo.jpg" alt="JobCrest Logo" class="logo" />
    <h2 class="mb-4">Admin Panel</h2>

    <div class="action-buttons">
      <button @click="goToManageQuestions" class="btn btn-primary btn-lg mb-3">
        Manage Test Questions
      </button>
      <button @click="goToViewResults" class="btn btn-success btn-lg mb-3">
        View Jobseeker Test Results
      </button>
    </div>

    <div v-if="showManageQuestions" class="manage-questions">
      <h3>Manage Questions</h3>
      <button @click="goToCreateQuestion" class="btn btn-outline-primary mb-3">Create New Question</button>
      <button @click="goToEditQuestions" class="btn btn-outline-secondary mb-3">Edit/Delete Questions</button>
    </div>

    <div v-if="showViewResults" class="view-results">
      <h3>Jobseeker Results</h3>
      <button @click="downloadResults" class="btn btn-outline-success mb-3">
        Download Test Results (CSV)
      </button>
      <div v-if="jobseekerResults.length > 0">
        <ul class="list-group">
          <li v-for="(result, index) in jobseekerResults" :key="index" class="list-group-item">
            <strong>Test ID: {{ result.timestamp }}</strong>
            <ul>
              <li v-for="(answer, idx) in result.answers" :key="idx">Question {{ idx + 1 }}: {{ answer }}</li>
            </ul>
          </li>
        </ul>
      </div>
      <div v-else>
        <p>No results submitted yet.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showManageQuestions: false,
      showViewResults: false,
      jobseekerResults: []
    }
  },
  mounted() {
    // Fetch jobseeker results from localStorage (or API if available)
    const results = localStorage.getItem('responses')
    if (results) {
      this.jobseekerResults = JSON.parse(results)
    }
  },
  methods: {
    goToManageQuestions() {
      this.showManageQuestions = true
      this.showViewResults = false
    },
    goToViewResults() {
      this.showManageQuestions = false
      this.showViewResults = true
    },
    goToCreateQuestion() {
      this.$router.push('/admin/create-question') // Route for creating questions
    },
    goToEditQuestions() {
      this.$router.push('/admin/edit-questions') // Route for editing/deleting questions
    },
    downloadResults() {
      const results = JSON.parse(localStorage.getItem('responses') || '[]')
      let csv = 'Test ID, Answers\n'
      results.forEach(result => {
        csv += `${result.timestamp}, ${result.answers.join('; ')}\n`
      })
      const blob = new Blob([csv], { type: 'text/csv' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'jobseeker_results.csv'
      link.click()
    }
  }
}
</script>

<style scoped>
.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}
.logo {
  max-width: 240px;
  border-radius: 10px;
}
.manage-questions, .view-results {
  display: flex;
  flex-direction: column;
}
</style>
