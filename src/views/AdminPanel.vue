<template>
    <div class="container mt-4">
      <h2 class="mb-4">Admin Panel</h2>
      
      <!-- Button to Create New Question -->
      <div class="mb-3">
        <router-link to="/admin/create-question" class="btn btn-primary">Create New Question</router-link>
      </div>
  
      <!-- Display questions grouped by test category -->
      <div v-if="Object.keys(questions).length === 0">
        <p>No questions available. Please create some questions first.</p>
      </div>
      
      <div v-for="(testQuestions, testType) in questions" :key="testType" class="mb-4">
        <h3>{{ getTestName(testType) }}</h3>
        
        <!-- Show each question in the category -->
        <ul class="list-group">
          <li v-for="(question, index) in testQuestions" :key="question.id" class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{{ question.label }}</strong>
              <span class="badge badge-info ml-2">{{ question.type }}</span>
              <div v-if="question.image">
                <img :src="question.image" style="max-width: 100px;" class="mt-2" />
              </div>
            </div>
            <div>
              <router-link :to="`/admin/edit-question/${testType}/${index}`" class="btn btn-sm btn-info mr-2">Edit</router-link>
              <button @click="deleteQuestion(testType, index)" class="btn btn-sm btn-danger">Delete</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        questions: {}
      }
    },
    mounted() {
      this.loadQuestions();
    },
    methods: {
      loadQuestions() {
        const savedQuestions = JSON.parse(localStorage.getItem('questions') || '{}');
        this.questions = savedQuestions;
      },
      getTestName(testType) {
        const testNames = {
          pattern: 'Test 1: Image Pattern Analysis',
          math: 'Test 2: Basic Math',
          math2: 'Test 3: Numerical Form',
          read: 'Test 4: Reading Comprehension',
          pretf: 'Pre Interview Questionaire',
          sentcomp: 'Sentence Completion'
        }
        return testNames[testType] || 'Unknown Test';
      },
      deleteQuestion(testType, index) {
        if (confirm('Are you sure you want to delete this question?')) {
          const savedQuestions = JSON.parse(localStorage.getItem('questions') || '{}');
          savedQuestions[testType].splice(index, 1);
          localStorage.setItem('questions', JSON.stringify(savedQuestions));
          this.loadQuestions(); // Reload questions after deletion
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
  