<template>
  <div class="container mt-4 panel-wrapper">
    <!-- Back Button -->
    <button class="btn btn-back mb-3" @click="$router.back()">
      ← Back
    </button>

    <!-- Logo -->
    <img src="@/assets/logo.jpg" alt="JobCrest Logo" class="logo d-block mx-auto mb-3" />

    <h2 class="mb-4 text-center text-primary">Admin Panel</h2>

    <!-- Dropdown to Choose Test Category -->
    <div class="mb-3">
      <select v-model="selectedTestType" class="form-control category-select">
        <option value="">Select Test Category</option>
        <option
          v-for="(testName, testType) in testCategories"
          :key="testType"
          :value="testType"
        >
          {{ testName }}
        </option>
      </select>
    </div>

    <!-- Button to Create New Question -->
    <div class="mb-4" v-if="selectedTestType">
      <router-link
        :to="`/admin/create-question?testType=${selectedTestType}`"
        class="btn btn-create"
      >
        Create New Question
      </router-link>
    </div>

    <!-- Category Title -->
    <div v-if="selectedTestType && filteredQuestions.length">
      <h4 class="mb-3 text-blue">{{ getTestName(selectedTestType) }}</h4>
    </div>

    <!-- No Questions Message -->
    <div v-if="filteredQuestions.length === 0">
      <p class="text-center text-muted">Select a test category to view the questions.</p>
    </div>

    <!-- Questions List -->
<ul class="list-group mb-3">
  <li
    v-for="(question, index) in paginatedQuestions"
    :key="question.id"
    class="list-group-item d-flex justify-content-between align-items-start"
  >
    <div class="flex-grow-1">
      <strong>{{ (currentPage - 1) * pageSize + index + 1 }}. {{ question.label }}</strong>
      <span class="badge badge-info ml-2">{{ question.type }}</span>
      <div v-if="question.image">
        <img :src="question.image" class="question-image" />
      </div>
    </div>
    <div class="button-group">
      <router-link
        :to="`/admin/edit-question/${selectedTestType}/${(currentPage - 1) * pageSize + index}`"
        class="btn btn-sm btn-info"
      >
        Edit
      </router-link>
      <button @click="deleteQuestion(question.id)" class="btn btn-sm btn-warning">
        Delete
      </button>
    </div>
  </li>
</ul>

<!-- Pagination Controls -->
<div v-if="totalPages > 1" class="pagination-controls text-center">
  <button
    class="btn btn-sm btn-outline-primary mr-2"
    :disabled="currentPage === 1"
    @click="goToPage(currentPage - 1)"
  >
    ← Prev
  </button>
  <span>    Page {{ currentPage }} of {{ totalPages }}    </span>
  <button
    class="btn btn-sm btn-outline-primary ml-2"
    :disabled="currentPage === totalPages"
    @click="goToPage(currentPage + 1)"
  >
    Next →
  </button>
</div>
  </div>
</template>


<script>
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VUE_APP_SUPABASE_URL,
  process.env.VUE_APP_SUPABASE_KEY
)
export default {
  data() {
    return {
      questions: [],
      selectedTestType: '',
      currentPage: 1,
      pageSize: 10,
      testCategories: {
        pattern: 'Test 1: Image Pattern Analysis',
        math: 'Test 2: Basic Math',
        math2: 'Test 3: Numerical Form',
        read: 'Test 4: Reading Comprehension',
        pretf: 'Pre Interview Questionnaire',
        sentcomp: 'Sentence Completion'
      }
    }
  },
  computed: {
    filteredQuestions() {
      if (this.selectedTestType) {
        return this.questions.filter(q => q.test_type === this.selectedTestType)
      }
      return []
    },
    paginatedQuestions() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredQuestions.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.filteredQuestions.length / this.pageSize)
    }
  },
  watch: {
    selectedTestType() {
      this.currentPage = 1
    }
  },
  mounted() {
    this.loadQuestions()
  },
  methods: {
    async loadQuestions() {
      const { data, error } = await supabase.from('questions').select('*')
      if (error) {
        console.error('Error loading questions:', error)
      } else {
        this.questions = data
      }
    },
    getTestName(testType) {
      return this.testCategories[testType] || 'Unknown Test'
    },
    async deleteQuestion(id) {
      if (confirm('Are you sure you want to delete this question?')) {
        const { error } = await supabase.from('questions').delete().eq('id', id)
        if (error) {
          alert('Failed to delete question')
          console.error(error)
        } else {
          alert('Question deleted!')
          this.loadQuestions()
        }
      }
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
      }
    }
  },
}
</script>

<style scoped>
.panel-wrapper {
  background-color: #f9fcff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 73, 128, 0.1);
}

.logo {
  max-width: 200px;
  border-radius: 8px;
}

.btn-back {
  background-color: #ffcc00;
  color: #003366;
  font-weight: bold;
  border: none;
  border-radius: 8px;
}

.btn-back:hover {
  background-color: #ffdb4d;
}

.btn-create {
  background-color: #007bff;
  color: white;
  font-weight: 500;
  border-radius: 8px;
}

.btn-create:hover {
  background-color: #0056b3;
}

.category-select {
  border: 2px solid #007bff;
  border-radius: 6px;
}

.list-group-item {
  background-color: #ffffff;
  border: 1px solid #cce5ff;
  border-left: 6px solid #007bff;
  border-radius: 6px;
  margin-bottom: 10px;
}

.button-group {
  display: flex;
  flex-direction: row;
  gap: 8px;
}

.question-image {
  max-width: 100px;
  margin-top: 0.5rem;
  border: 2px solid #007bff;
  border-radius: 6px;
}

strong {
  display: block;
  margin-bottom: 4px;
}

.text-blue {
  color: #0056b3;
}

.pagination-controls {
  margin-top: 10px;
}

</style>
