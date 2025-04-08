<template>
  <div class="container mt-4">
    <h2 class="mb-4">Admin Panel</h2>
    
    <!-- Dropdown to Choose Test Category -->
    <div class="mb-3">
      <select v-model="selectedTestType" class="form-control">
        <option value="">Select Test Category</option>
        <option v-for="(testName, testType) in testCategories" :key="testType" :value="testType">{{ testName }}</option>
      </select>
    </div>

    <!-- Button to Create New Question -->
    <div class="mb-3" v-if="selectedTestType">
      <router-link :to="`/admin/create-question?testType=${selectedTestType}`" class="btn btn-primary">Create New Question</router-link>
    </div>

    <!-- Display questions grouped by test category -->
    <div v-if="filteredQuestions.length === 0">
      <p>No questions available. Please create some questions first.</p>
    </div>
    
    <div v-for="(question, index) in filteredQuestions" :key="question.id" class="mb-4">
      <h3>{{ getTestName(selectedTestType) }}</h3>
      <ul class="list-group">
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <strong>{{ question.label }}</strong>
            <span class="badge badge-info ml-2">{{ question.type }}</span>
            <div v-if="question.image">
              <img :src="question.image" style="max-width: 100px;" class="mt-2" />
            </div>
          </div>
          <div>
            <router-link :to="`/admin/edit-question/${selectedTestType}/${index}`" class="btn btn-sm btn-info mr-2">Edit</router-link>
            <button @click="deleteQuestion(question.id)" class="btn btn-sm btn-danger">Delete</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { createClient } from '@supabase/supabase-js'
  
  const supabaseUrl = process.env.VUE_APP_SUPABASE_URL
  const supabaseKey = process.env.VUE_APP_SUPABASE_KEY
  const supabase = createClient(supabaseUrl, supabaseKey)

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
        pretf: 'Pre Interview Questionaire',
        sentcomp: 'Sentence Completion'
      }
    }
  },
  computed: {
    // Filtered questions based on selected test category
    filteredQuestions() {
      if (this.selectedTestType) {
        return this.questions.filter(question => question.test_type === this.selectedTestType);
      }
      return this.questions;
    }
  },
  mounted() {
    this.loadQuestions();
  },
  methods: {
    async loadQuestions() {
      const { data, error } = await supabase
        .from('questions')
        .select('*')

      if (error) {
        console.error('Error loading questions:', error)
        return
      }

      // Store the fetched questions in the component's state
      this.questions = data
    },
    getTestName(testType) {
      return this.testCategories[testType] || 'Unknown Test';
    },
    async deleteQuestion(questionId) {
      if (confirm('Are you sure you want to delete this question?')) {
        const { error } = await supabase
          .from('questions')
          .delete()
          .eq('id', questionId)

        if (error) {
          alert('Failed to delete question')
          console.error(error)
        } else {
          alert('Question deleted!')
          this.loadQuestions(); // Reload questions after deletion
        }
      }
    }
  }
}
</script>

<style scoped>
button {
  margin-top: 10px;
}
</style>
