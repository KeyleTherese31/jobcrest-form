<template>
  <div class="container mt-4 admin-panel-wrapper">
    <!-- Back Button -->
    <button class="btn btn-back mb-3" @click="$router.back()">← Back</button>

    <!-- Logo and Heading -->
    <img src="@/assets/logo.jpg" alt="JobCrest Logo" class="logo mx-auto d-block mb-3" />
    <h2 class="text-center text-primary mb-4">Admin Panel</h2>

    <!-- Action Buttons -->
    <div class="action-buttons mb-4">
      <button @click="goToManageQuestions" class="btn btn-lg btn-blue-yellow">
        Manage Test Questions
      </button>
      <button @click="goToViewResults" class="btn btn-lg btn-yellow-blue">
        View Jobseeker Test Results
      </button>
    </div>

    <!-- Manage Questions Section -->
    <div v-if="showManageQuestions" class="section-box">
      <h3 class="text-blue">Manage Questions</h3>
      <button @click="goToCreateQuestion" class="btn btn-outline-primary mb-3">
        Create New Question
      </button>
      <button @click="goToEditQuestions" class="btn btn-outline-secondary mb-3">
        Edit/Delete Questions
      </button>
    </div>

    <!-- View Results Section -->
    <div v-if="showViewResults" class="section-box">
      <h3 class="text-blue">Jobseeker Results</h3>
      <button @click="downloadResults" class="btn btn-outline-success mb-3">
        Download Test Results (CSV)
      </button>
      <div v-if="jobseekerResults.length > 0">
        <ul class="list-group">
          <li
            v-for="(result, index) in jobseekerResults"
            :key="index"
            class="list-group-item result-item"
          >
            <strong>Test ID: {{ result.timestamp }}</strong>
            <ul class="mb-0">
              <li
                v-for="(answer, idx) in result.answers"
                :key="idx"
              >
                Question {{ idx + 1 }}: {{ answer }}
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div v-else>
        <p class="text-muted">No results submitted yet.</p>
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
  },
}
</script>

<style scoped>
.admin-panel-wrapper {
  background-color: #f2f9ff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 0 12px rgba(0, 85, 170, 0.08);
}

.logo {
  max-width: 220px;
  border-radius: 10px;
}

.btn-back {
  background-color: #ffcc00;
  color: #003366;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
}

.btn-back:hover {
  background-color: #ffe066;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-blue-yellow {
  background-color: #007bff;
  color: white;
  font-weight: 500;
  border-radius: 10px;
  width: 100%;
}

.btn-yellow-blue {
  background-color: #ffcc00;
  color: #003366;
  font-weight: 500;
  border-radius: 10px;
  width: 100%;
}

.section-box {
  background-color: white;
  border-left: 6px solid #007bff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 0 8px rgba(0, 85, 170, 0.05);
  margin-bottom: 20px;
}

.result-item {
  border-left: 4px solid #28a745;
}

.text-blue {
  color: #0056b3;
}
</style>

