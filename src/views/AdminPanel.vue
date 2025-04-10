<template>
  <div class="container mt-4">
    <h2 class="mb-4 text-center">Admin Panel</h2>

    <!-- Dropdown to Choose Test Category -->
    <div class="mb-3">
      <select v-model="selectedTestType" class="form-control">
        <option value="">Select Test Category</option>
        <option v-for="(testName, testType) in testCategories" :key="testType" :value="testType">
          {{ testName }}
        </option>
      </select>
    </div>

    <!-- Button to Create New Question -->
    <div class="mb-4" v-if="selectedTestType">
      <router-link :to="`/admin/create-question?testType=${selectedTestType}`" class="btn btn-primary">
        Create New Question
      </router-link>
    </div>

    <!-- Category Title -->
    <div v-if="selectedTestType && filteredQuestions.length">
      <h4 class="mb-3">{{ getTestName(selectedTestType) }}</h4>
    </div>

    <!-- No Questions Message -->
    <div v-if="filteredQuestions.length === 0">
      <p class="text-center">Select a test's category first to view the list of questions.</p>
    </div>

    <!-- Questions List -->
    <ul class="list-group">
      <li
        v-for="(question, index) in filteredQuestions"
        :key="question.id"
        class="list-group-item d-flex justify-content-between align-items-start"
      >
        <div class="flex-grow-1">
          <strong>{{ index + 1 }}. {{ question.label }}</strong>
          <span class="badge badge-info ml-2">{{ question.type }}</span>
          <div v-if="question.image">
            <img :src="question.image" style="max-width: 100px;" class="mt-2" />
          </div>
        </div>
        <div class="button-group">
          <router-link
            :to="`/admin/edit-question/${selectedTestType}/${index}`"
            class="btn btn-sm btn-info mr-2"
          >
            Edit
          </router-link>
          <button @click="deleteQuestion(question.id)" class="btn btn-sm btn-danger">
            Delete
          </button>
        </div>
      </li>
    </ul>
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
    }
  }
}
</script>

<style scoped>
.list-group-item {
  align-items: center;
}

.button-group {
  display: flex;
  flex-direction: row;
  gap: 5px;
}

img {
  max-width: 100px;
  margin-top: 0.5rem;
}

.btn {
  min-width: 60px;
}

strong {
  display: block;
  margin-bottom: 4px;
}
</style>
